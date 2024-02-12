QuaDev Mobile App
=======

# Requirements

## For Android
- First set up your local environment by following the [instructions here](https://reactnative.dev/docs/environment-setup?package-manager=yarn&guide=native&platform=android)
- Set up Firebase
  - Download the `google-services.json` file from the android app within the [Firebase Console](https://console.firebase.google.com/u/0/project/quadevapp/settings/general/ios:com.qdmobile)
  - Move it to:
    - Development: `/app/android/app/src/development/google-services.json`
    - Production: `/app/android/app/src/production/google-services.json`

## For iOS
- Set up Firebase
  - Download the `GoogleService-Info.plist` file from the android app within the [Firebase Console](https://console.firebase.google.com/u/0/project/quadevapp/settings/general/android:com.qdmobile)
  - Move it to:
    - Development: `/Users/gustavofranco/Documents/qd-mobile/ios/QDMobile/firebase/dev/GoogleService-Info.plist`
    - Production: `/Users/gustavofranco/Documents/qd-mobile/ios/QDMobile/firebase/prod/GoogleService-Info.plist`

# Quickstart

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
yarn android
```

### For iOS

```bash
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Tchnical details

### Environments
The `react-native-config` npm package handles environment variables. A .env file will contain the environment variables.

- Development: `.env.dev`
- Production: `.env.prod`

In android the mapping to the corresponding environments is performed in `android/app/build.gradle` where there is an environment file determined for each flavor:
```groovy
project.ext.envConfigFiles = [
        development: ".env.dev",
        production: ".env.prod"
]
```
Each flavor has its own application id which map them to their own firebase project:
```groovy
productFlavors {
    development {
        dimension "default"
        applicationId "com.qdmobile.dev"
    }
    production {
        dimension "default"
        applicationId "com.qdmobile"
    }
    // Define other flavors as needed
}
 ```
To build **release** or **debug** variants of each flavor you need to run the following commands from `/app/android`:
- For development debug: `./gradlew assembleDevelopmentDebug`
- For development release: `./gradlew assembleDevelopmentRelease`
- For production debug: `./gradlew assembleProductionDebug`
- For production release: `./gradlew assembleProductionRelease`

Configuration variables can be exploited from many places. Android, iOS, Javascript bundle, gradle and more.
For more info about this read [react-native-config docs](https://www.npmjs.com/package/react-native-config)

### Versioning
Use `yarn update-version <<semv-new-version>>` to update the version in package.json and in android versionName in build.gradle file.

### APK signing
For distribution through stores you need a signed apk.  
To sign your apk you first need to create an Signing Key file.  
To do so, choose a keystore file name, an alias and set a password to it running the following command:
```shell
keytool -genkeypair -v -keystore release-key.keystore -alias easydriver.key -keyalg RSA -keysize 2048 -validity 10000
```
This will generate the key file in the current working directory. Make sure that the key is in `android/app` folder (e.g. `app/android/app/release-key.keystore`).  
The signing configuration is defined in `app/android/app/build.gradle` file under the **release** variant:
```groovy
        release {
          if (System.getenv("STORE_FILE")) {
            storeFile file(System.getenv("STORE_FILE"))
            storePassword System.getenv("STORE_PASSWORD")
            keyAlias System.getenv("STORE_ALIAS")
            keyPassword System.getenv("STORE_KEY_PASSWORD")
          }
        }
```
You will need to provide the values as environment variables.  
If you are creating a signed release build manually, then you can add the exports above in your local configuration file (`zshrc`, `.bashrc`, etc.) and then build any of the **release** variants to get your signed apk:
- `./gradlew assembleDevelopmentRelease`
- `./gradlew assembleProductionRelease`

# Docker image
If running on a M1 or M2 mac, you will need to build the image with the following command to simulate an amd64 processor architecture
```shell
docker build --platform=linux/amd64 --tag tavoargento/react-native-android:0.0.1 .
```

# TODO
- firebase
  - app distribution
  - authentication
  - terraform
- Functional tests 
- react-navigation
- paper
- react-native-camera-vision
