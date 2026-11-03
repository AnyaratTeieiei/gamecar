const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const MODES={academy:{title:'DRIVING ACADEMY',subtitle:'Build your safe-driving skills',distance:1600,duration:180,limit:60,traffic:1},coast:{title:'COASTAL RUN',subtitle:'Golden-hour roads. Boost through the curves.',distance:2500,duration:150,limit:100,traffic:1.1},night:{title:'NEON EXPRESS',subtitle:'Night traffic. Tight gaps. Big rewards.',distance:2200,duration:125,limit:90,traffic:1.4},rush:{title:'RUSH HOUR',subtitle:'Closed-course sprint. Beat the clock.',distance:2400,duration:82,limit:200,traffic:1.9}};
function curveAt(s,mode){return Math.sin(s/210)*.25+(mode==='academy'?.06:.16)*Math.sin(s/85)}
function createGame(mode='academy'){return{mode,s:0,time:0,timeLimit:MODES[mode].duration,bonusTime:0,speed:0,x:0,steer:0,integrity:100,score:1000,penalties:0,hits:0,overtakes:0,stops:0,cars:[],hazards:[],nextId:0,spawn:.1,invincible:0,overSpeed:0,offRoad:0,passedLights:[],stopCredit:[],done:false,won:false,message:'READY TO DRIVE',messageTime:2,flash:0,braking:false,throttle:false,tripMax:0,nitro:100,nitroActive:false,nitroEmpty:false,combo:0,bestCombo:0,nearMisses:0,lastNearMiss:-10,checkpoints:0,nextCheckpoint:500,nextHazard:240,bonusFlash:0}}
function lightState(time){const p=time%30;return p<13?'green':p<16?'yellow':'red'}
function nextLight(g){if(g.mode!=='academy')return null;const s=(Math.floor((g.s-180)/450)+1)*450+180;return{s,dist:s-g.s,state:lightState(g.time)}}
function notify(g,text){g.message=text;g.messageTime=2.8}
function penalty(g,text,points){g.score=Math.max(0,g.score-points);g.penalties++;notify(g,text)}
function hit(g,text){g.integrity=Math.max(0,g.integrity-28);g.hits++;g.speed*=.45;g.invincible=1.8;g.flash=.5;g.combo=0;penalty(g,text,200)}
function step(g,input,dt,random=Math.random){
 if(g.done)return g;
 dt=clamp(dt,0,.05);const rules=MODES[g.mode],oldS=g.s,arcade=g.mode!=='academy';
 g.time+=dt;g.timeLimit=rules.duration+g.bonusTime;g.messageTime=Math.max(0,g.messageTime-dt);g.flash=Math.max(0,g.flash-dt);g.bonusFlash=Math.max(0,g.bonusFlash-dt);g.invincible=Math.max(0,g.invincible-dt);g.braking=!!input.brake;
 if(!input.nitro)g.nitroEmpty=false;
 g.nitroActive=arcade&&!!input.nitro&&!input.brake&&g.nitro>0&&!g.nitroEmpty;
 if(g.nitroActive){g.nitro=Math.max(0,g.nitro-dt*22);if(g.nitro===0)g.nitroEmpty=true}else g.nitro=Math.min(100,g.nitro+dt*5);
 g.throttle=!!input.throttle||g.nitroActive;
 if(g.time-g.lastNearMiss>5)g.combo=0;
 const acceleration=input.brake?-9.6:g.nitroActive?14-g.speed*.05:input.throttle?5.8-g.speed*.055:-1.1-g.speed*.018;
 g.speed=clamp(g.speed+acceleration*dt,0,g.nitroActive?62:Math.max(46,g.speed-1.5*dt));
 if(Math.abs(g.x)>1)g.speed=Math.max(0,g.speed-4*dt);
 g.tripMax=Math.max(g.tripMax,g.speed*3.6);g.steer+=(clamp(input.steer||0,-1,1)-g.steer)*Math.min(1,dt*9);g.x=clamp(g.x+(g.steer*(.22+g.speed*.035)-curveAt(g.s,g.mode)*g.speed*.012)*dt*(g.speed>.25?1:0),-1.42,1.42);g.s+=g.speed*dt;
 if(g.mode!=='rush'&&g.speed*3.6>rules.limit+7){g.overSpeed+=dt;if(g.overSpeed>=3){penalty(g,'Speeding −80',80);g.overSpeed=0}}else g.overSpeed=0;
 if(Math.abs(g.x)>1.02){g.offRoad+=dt;if(g.offRoad>=2){penalty(g,'Off the road −100',100);g.integrity-=4;g.offRoad=0}}else g.offRoad=0;
 if(g.mode==='academy'){
  const first=Math.floor(oldS/450)-1;
  for(let i=Math.max(0,first);i<=Math.floor(g.s/450)+1;i++){const line=180+i*450;if(oldS<line&&g.s>=line&&!g.passedLights.includes(line)){g.passedLights.push(line);if(lightState(g.time)==='red'&&g.speed>1)penalty(g,'Red-light violation −250',250)}if(line-g.s>=3&&line-g.s<24&&lightState(g.time)==='red'&&g.speed<.5&&!g.stopCredit.includes(line)){g.stopCredit.push(line);g.stops++;g.score+=150;notify(g,'Safe stop +150')}}
 }
 if(arcade&&g.s>=g.nextCheckpoint&&g.nextCheckpoint<rules.distance){g.checkpoints++;g.nextCheckpoint+=500;g.bonusTime+=5;g.timeLimit=rules.duration+g.bonusTime;g.nitro=Math.min(100,g.nitro+20);g.score+=250;g.bonusFlash=.8;notify(g,'CHECKPOINT! +5s / +250 / NITRO +20')}
 if(arcade&&g.s>=g.nextHazard){g.nextHazard+=g.mode==='rush'?210:360;g.hazards.push({id:++g.nextId,s:g.s+155,x:[-.64,0,.64][Math.floor(random()*3)],hit:false})}
 g.spawn-=dt;
 if(g.spawn<=0){g.spawn=(2.8+random()*2)/rules.traffic;const lane=[-.64,0,.64][Math.floor(random()*3)];if(!g.cars.some(c=>Math.abs(c.s-(g.s+210))<30&&Math.abs(c.x-lane)<.2))g.cars.push({id:++g.nextId,s:g.s+210+random()*80,x:lane,speed:9+random()*7,color:Math.floor(random()*5),passed:false,minGap:9,collided:false})}
 for(const c of g.cars){
  let target=9+c.color*1.3;
  if(g.mode==='academy'){const line=180+Math.ceil((c.s-180)/450)*450;const d=line-c.s;if(lightState(g.time)==='red'&&d>0&&d<45)target=Math.max(0,(d-7)*.35)}
  c.speed+=clamp(target-c.speed,-8*dt,3*dt);const before=c.s-oldS;c.s+=c.speed*dt;const after=c.s-g.s,gap=Math.abs(c.x-g.x);
  if(Math.abs(after)<9)c.minGap=Math.min(c.minGap??9,gap);
  if(g.invincible<=0&&gap<.27&&(Math.abs(after)<5.5||(before>0&&after<0))){c.collided=true;hit(g,'Collision! −200')}
  if(!c.passed&&after< -9){c.passed=true;g.overtakes++;
   if(arcade&&!c.collided&&g.invincible<=0&&g.speed>16&&c.minGap>=.27&&c.minGap<.49){g.combo++;g.bestCombo=Math.max(g.bestCombo,Math.min(5,g.combo));g.lastNearMiss=g.time;g.nearMisses++;const mult=Math.min(5,g.combo),points=150*mult;g.score+=points;g.nitro=Math.min(100,g.nitro+12);g.bonusFlash=.5;notify(g,`NEAR MISS! x${mult} +${points}`)}
   else{g.score+=80;notify(g,'Clean overtake +80')}
  }
 }
 for(const h of g.hazards)if(!h.hit&&g.invincible<=0&&Math.abs(h.x-g.x)<.29&&(Math.abs(h.s-g.s)<4.5||(h.s>oldS&&h.s<=g.s))){h.hit=true;hit(g,'Roadblock collision! −200')}
 g.cars=g.cars.filter(c=>c.s>g.s-70);g.hazards=g.hazards.filter(h=>h.s>g.s-30);
 if(g.integrity<=0){g.done=true;g.won=false;notify(g,'Your car is too damaged to continue.')}
 else if(g.s>=rules.distance){g.done=true;g.won=true;g.score+=Math.round(g.integrity*10+Math.max(0,g.timeLimit-g.time)*5);notify(g,'Destination reached!')}
 else if(g.time>=g.timeLimit){g.done=true;g.won=false;notify(g,'Time is up. Try another drive.')}
 if(g.done)g.nitroActive=false;
 return g;
}
module.exports={MODES,clamp,createGame,step,curveAt,lightState,nextLight};
