# Run Android

## gen debug.keystore or donwload [keystore template](https://raw.githubusercontent.com/facebook/react-native/master/template/android/app/debug.keystor://raw.githubusercontent.com/facebook/react-native/master/template/android/app/debug.keystore)

`keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000`
