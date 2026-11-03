Neon Drive - Android source backup

The installable game is NeonDrive_Android_ARM64.apk. This ZIP is source code for future development.

Requirements: Node.js, JDK 17 (full JDK including javac and jlink), Android SDK / build tools 37, NDK 27.1.12297006, Gradle 9.4.1.
Run npm ci before building. Set Android SDK in android/local.properties or ANDROID_HOME.
Use private Gradle user properties NEON_STORE_FILE, NEON_STORE_PASSWORD and NEON_KEY_PASSWORD to configure signing. Key alias: neondrive. Keep the separate PRIVATE signing backup secure.
Build: gradle -p android :app:assembleRelease -PreactNativeArchitectures=arm64-v8a --no-parallel --max-workers=1
Output: android/app/build/outputs/apk/release/app-release.apk

No SDK, dependencies, local settings or release signing credentials are included in this source archive.
