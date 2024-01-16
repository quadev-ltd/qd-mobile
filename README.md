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


# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.


# Docker image
If running on a M1 or M2 mac, you will need to build the image with the following command to simulate an amd64 processor architecture
```shell
docker build --platform=linux/amd64 --tag tavoargento/react-native-android:0.0.1 .
```

# TODO
- import aliases
- Readme
- firebase
  - app distribution
  - authentication
  - terraform
- react-native-config and environments
  - zod
  - environments
- react-native-camera-vision
- react-navigation
- paper