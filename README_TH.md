# NEON DRIVE — Motion Driving Experience

เกมขับรถ React Native + Expo SDK 58 สำหรับ iPhone ใช้ภาพถนนแบบ perspective pseudo-3D วาดด้วย native SVG ไม่ใช่เกม WebView หรือเอนจินฟิสิกส์รถระดับวิศวกรรม

## เปิดเล่นบน iPhone

ชุดนี้เป็นโปรเจกต์พร้อมตัวเปิดและไฟล์ล็อก dependencies ไม่ใช่ IPA ที่เซ็นแล้ว

1. คอมพิวเตอร์ติดตั้ง Node.js LTS และเชื่อมต่ออินเทอร์เน็ต
2. iPhone ติดตั้ง/อัปเดต Expo Go รุ่นรองรับ SDK 58
3. แตก ZIP ทั้งโฟลเดอร์ Windows ดับเบิลคลิก START_IPHONE.cmd / macOS เปิด START.command หรือรัน bash START.command
4. รอการติดตั้งครั้งแรก ถ้า Expo ขอเข้าสู่ระบบ ให้ใช้บัญชีเดียวกับ Expo Go
5. รอ Tunnel พร้อม แล้วสแกน QR ใหม่ด้วย Camera ของ iPhone เปิดใน Expo Go
6. เลือกเส้นทาง กดเริ่มขับด้วยการเอียงเครื่อง อนุญาต Motion & Fitness ถือเครื่องท่าที่สบายแล้วแตะตั้งศูนย์
7. กดคันเร่ง/เบรกค้าง และเอียงซ้าย–ขวาเพื่อเลี้ยว

เปิดหน้าต่างบนคอมค้างไว้ระหว่างเล่น ไม่ใช้ QR จากเซิร์ฟเวอร์รอบเก่า

ถ้า tunnel ใช้ไม่ได้ และคอมกับโทรศัพท์อยู่ Wi-Fi เดียวกัน ใช้ START_LAN.cmd โดยต้องอนุญาต Local Network ให้ Expo Go บน iPhone

คำสั่งรันเอง:

```sh
npm ci
npm run tunnel
```

ไม่ต้องใช้ไฟล์ Tilt Orbit / Tilt Galaxy เก่าหรือแก้แพ็กเกจด้วยตนเอง

## โหมดเกม

- Driving Academy: 1.6 กม. / 180 วินาที / กำหนด 60 กม./ชม. มีไฟจราจร
- Coastal Run: 2.5 กม. / 150 วินาที / กำหนด 100 กม./ชม. ถนนชายฝั่งยามเย็น
- Neon Express: 2.2 กม. / 125 วินาที / กำหนด 90 กม./ชม. ทางด่วนกลางคืน รถหนาแน่นขึ้น

ป้ายจำกัดความเร็วเป็นกติกาของเกม ไม่ใช่การอ้างกฎหมายจราจรจริง

รถมีเกียร์อัตโนมัติ แรงเร่ง เบรก แรงเสียดทาน และแรงเบนออกตามโค้ง ความเสียหายเริ่ม 100% ชนหนึ่งครั้งเสีย 28% และลดความเร็ว มีช่วงป้องกันการชนซ้ำสั้น ๆ

ให้คะแนนการแซงอย่างปลอดภัยและหยุดรอไฟแดง หักคะแนนจากการชน ฝ่าไฟแดง ออกนอกถนน หรือขับเร็วเกินเกณฑ์ต่อเนื่อง การทำคะแนนไม่ชดเชยการฝ่าฝืนกฎในชีวิตจริง

สลับมุมตามรถ/ฝากระโปรงได้ ปรับความไวและกลับทิศได้จากเมนูพัก คะแนนสูงสุดอยู่เฉพาะระหว่างเปิดแอป

## ตรงเงื่อนไขงานอาจารย์อย่างไร

- เป็นแอป React Native โดยตรง
- ใช้ Accelerometer จาก expo-sensors อ่านค่าแรงเร่งรวมแรงโน้มถ่วง แกน X หน่วย g
- กรอง low-pass ลดการสั่น ลบค่าอ้างอิงเมื่อตั้งศูนย์ และแปลงค่าเป็นพวงมาลัย ไม่กล่าวอ้างว่าเป็นการวัดมุมที่แม่นยำทางเครื่องมือ
- อ่าน Gyroscope เพื่อแสดงขนาดอัตราการหมุน rad/s บนหน้าจอด้วย ถ้าอุปกรณ์มี
- มีการขอสิทธิ์ Motion & Fitness และตั้ง NSMotionUsageDescription สำหรับ native build
- ใช้เกมขับรถจำลองแทนลูกบอลหรือเกมยานอวกาศเดิม แต่ผู้เรียนควรตรวจเทียบกับตัวอย่างที่เคยทำในชั้น เพื่อยืนยันว่าไม่ซ้ำ
- เซนเซอร์ประมวลผลในเครื่อง ไม่มีการส่งข้อมูลการเคลื่อนไหวออกไป
- มีโหมดปุ่มสำหรับทดสอบหน้าจอบนเครื่องที่ไม่มีเซนเซอร์ โหมดนี้ไม่ถือเป็นหลักฐานว่าเซนเซอร์ทำงานจริง

## การพักและสัญญาณขาด

เมื่อเข้า background เกมจะพัก คันเร่ง/เบรกถูกปล่อย และถอด listeners เมื่อกลับมาให้กดเล่นต่อและตั้งศูนย์อีกครั้ง หากไม่มีสัญญาณเซนเซอร์ เกมหยุดเวลาและให้เปลี่ยนเป็นโหมดปุ่มได้

## ไฟล์ติดตั้งแอป iOS แยกจาก Expo Go

การติดตั้งจริงต้องมี binary IPA ที่บิลด์และเซ็นด้วยบัญชี Apple Developer ของเจ้าของงาน ชุดนี้ยังไม่มี IPA หรือ TestFlight URL และไม่อ้างว่าติดตั้งโดยไม่ต้องผ่านการเซ็นได้

มี app.json และ eas.json เตรียมไว้ ให้เปลี่ยน bundleIdentifier เป็นของตนเองก่อนบิลด์:

```sh
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform ios --profile preview
```

EAS จะให้เชื่อมบัญชีและลงทะเบียน iPhone สำหรับ internal distribution ตามสิทธิ์บัญชี ค่าใช้จ่ายและการยอมรับเงื่อนไขเป็นของผู้ใช้ ทำหลังเตรียมบัญชีแล้วเท่านั้น สำหรับ TestFlight ใช้ production profile และส่งผ่านบัญชี App Store Connect

## การตรวจสอบ

ระบบทดสอบ: เร่ง/เบรก, พวงมาลัย, ขอบถนน, ความเร็วเกิน, ไฟแดง, โบนัสหยุดรถ, การชน, จบเส้นทางและหมดเวลา ใช้ npm test

สร้าง iOS JavaScript/Hermes bundle เพื่อตรวจการรวมไฟล์แล้ว ไม่ใช่การบิลด์ IPA และยังไม่ได้ทดสอบเซนเซอร์บน iPhone ของผู้ใช้

ก่อนส่งงาน: ทดสอบอนุญาต/ปฏิเสธสิทธิ์ การตั้งศูนย์ เอียงซ้าย/ขวา กดคันเร่งกับเบรก ปล่อยนิ้ว เปลี่ยนแอปแล้วกลับมา สลับกล้อง เล่นครบเส้นทาง ตรวจคะแนนและสัญญาณขาด

ไฟล์สำคัญ: App.js (UI/เซนเซอร์), Scene.js (กราฟิก), engine.cjs (ระบบขับรถ), engine.test.cjs (ทดสอบ), package-lock.json (ล็อกแพ็กเกจ)


## Excitement update / v1.1

- Rush Hour: closed-course 2.4 km sprint, 82 seconds plus checkpoint bonuses. No speeding penalties in this mode.
- Hold NITRO to boost; it also accelerates the car. Brake overrides Nitro. Release the button before reusing a fully depleted tank.
- Nitro recharges gradually, and near misses and checkpoints refill it. Nitro is disabled in Driving Academy.
- Pass closely without contact at over 58 km/h to earn a Near Miss. Chain these within 5 seconds for a score multiplier up to x5. A collision resets the combo.
- Every 500 m checkpoint adds 5 seconds, 250 points and 20 Nitro charge in arcade routes.
- Flashing roadblocks occupy one lane; watch for the warning and steer around them.
- Boost adds speed streaks, exhaust flames and a cyan screen edge.
- All in-game content remains English. No additional packages are needed if you already have the previous Neon Drive installed. To update the existing project, stop Metro, back up and replace App.js, Scene.js and engine.cjs, then restart Metro with --clear.
