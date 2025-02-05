(() => {
  try {
    const enableLog = true
        , logPrefix = '[GA4 Unified Tag for Webview (Web & App) | Firebase Analytics Handler Global Variable Initialization] |';
      
    /*
    The name of the global variable that will hold the Javascript Handler to the Firebase Analytics methods for iOS and Android interfaces.     
    This is object is a global variable defined by us and it doesn't have anything to do with Firebase Analytics. 
    You can change the name if you want. It holds the abstraction for calling the iOS or Android interfaces.
    Default: 'firebaseAnalyticsHandler'

    This global variable must be added either via the GTM Template (https://github.com/giovaniortolani/ga4-unified-tag-for-webview-web-app-firebase-analytics-handler-global-variable-initialization),
    or via the source code (https://github.com/giovaniortolani/ga4-unified-tag-for-webview-web-app-firebase-analytics-handler-global-variable-initialization/blob/main/source-code-es6-version.js) by your developers.
    It must be added before GTM starts sending events to Firebase (if adding via the GTM template, use the Initialization trigger; if adding via the source code, ensure that this code runs early on the page, ideally before GTM loads).
    If you add it via the GTM, you don't need to add this script.

    Reference: "Implement JavaScript handler" section
    https://firebase.google.com/docs/analytics/webview?platform=android#implement-javascript-handler
    */
    const firebaseAnalyticsHandlerName = 'firebaseAnalyticsHandler';
    window[firebaseAnalyticsHandlerName] = window[firebaseAnalyticsHandlerName] || {
      /*
      The name of the global object that contains the native interface to Firebase Analytics for Android.
      Default: 'AnalyticsWebInterface'
      
      Use the same name as defined on the 2nd argument when adding the Javascript interface:
      - Java: https://github.com/FirebaseExtended/analytics-webview/blob/master/android/app/src/main/java/com/google/firebase/quickstart/analytics/webview/MainActivity.java#L52-L53
      
      This global object is defined as 'AnalyticsWebInterface' in the documentation linked above. Make sure to use the same name in both places (in the native code and in this template).
      
      Reference: "Implement native interface" section
      https://firebase.google.com/docs/analytics/webview?platform=android#implement_native_interface
      */
      androidInterfaceName: 'AnalyticsWebInterface',
      /*
      The name of the global object in "window.webkit.messageHandlers" that contains the native interface to Firebase Analytics for iOS.
      Default: 'firebase'
      
      Use the same name as defined on the 2nd argument when adding the webview handler:
      - Objective-C: https://github.com/FirebaseExtended/analytics-webview/blob/322f8aeccbf5e2f2aac96d5c3083c8b5183f53cb/ios/objc/FirebaseAnalyticsWeb/ViewController.m#L45
      - Swift: https://github.com/FirebaseExtended/analytics-webview/blob/322f8aeccbf5e2f2aac96d5c3083c8b5183f53cb/ios/swift/FirebaseAnalyticsWeb/ViewController.swift#L42
      
      This global object is defined as "window.webkit.messageHandlers.firebase" in the documentation linked above. Make sure to use the same name in both places (in the native code and in this template).
      
      Reference: "Implement native interface" section
      https://firebase.google.com/docs/analytics/webview?platform=ios#implement_native_interface
      */
      iOSInterfaceName: 'firebase',
      /*
      The name of the global method that contains the native interface to Firebase Analytics for both Android and iOS.
      This option is suited for when you have the same interface for both iOS and Android (i.e., you use React Native, Flutter etc.).
      Example: 'WebviewInterface.postMessage'
      
      Some implementation examples:
      - React Native: https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#the-windowreactnativewebviewpostmessage-method-and-onmessage-prop
      - Flutter: https://stackoverflow.com/a/64429209/4043937
      
      Make sure to use the same name in both places (in the native code and in this template).
      
      Reference: "Implement native interface" section
      - iOS: https://firebase.google.com/docs/analytics/webview?platform=ios#implement_native_interface
      - Android: https://firebase.google.com/docs/analytics/webview?platform=android#implement_native_interface
      */
      commonInterfaceName: '', // Example: 'WebviewInterface.postMessage'
      
      _callNativeMethod(command, params) {
        // Check for the interfaces on every run to overcome problems if they were defined late.
        const androidInterface = window[this.androidInterfaceName];
        const iOSInterface = window.webkit?.messageHandlers?.[this.iOSInterfaceName];
        const commonInterface = this.commonInterfaceName && this.commonInterfaceName.split('.').reduce((obj, key) => obj?.[key], window);

        enableLog && console.log(logPrefix, 'interface: ', { iOSInterface, androidInterface, commonInterface });
        enableLog && console.log(logPrefix, 'command and params: ', { command, params });
          
        try {
          if (androidInterface) {
            // Android native interface
            const androidMethodMap = {
              logEvent: (name, params) => androidInterface.logEvent(name, JSON.stringify(params)),
              setUserProperty: (name, value) => androidInterface.setUserProperty(name, value),
              setDefaultEventParameters: (params) => androidInterface.setDefaultEventParameters(JSON.stringify(params)),
              setUserId: (userId) => androidInterface.setUserId(userId),
              setAnalyticsCollectionEnabled: (value) => androidInterface.setAnalyticsCollectionEnabled(value),
              resetAnalyticsData: () => androidInterface.resetAnalyticsData(),
              setConsent: (consentSettings) => androidInterface.setConsent(JSON.stringify(consentSettings))
            };

            if (androidMethodMap[command]) {
              androidMethodMap[command](...Object.values(params || {}));
            }
          } else if (iOSInterface) {
            // iOS native interface
            const message = { command, ...params };
            iOSInterface.postMessage(message);
          } else if (commonInterface) {
            // Common (iOS and Android) native interface
            const message = { command, ...params };
            commonInterface(JSON.stringify(message));
          } else {
            enableLog && console.log(logPrefix, 'No native APIs found.');
          }
        } catch(e) {
          enableLog && console.log(logPrefix, e);
        }
      },

    /**
     * Logs an event to Firebase Analytics.
     *
     * @param {string} name - The name of the event.
     * @param {Object} params - The event parameters.
     */
      logEvent(name, params) {
        if (!name) return;
        this._callNativeMethod('logEvent', { name, parameters: params });
      },

    /**
     * Sets a user property in Firebase Analytics.
     *
     * @param {string} name - The name of the user property.
     * @param {*} value - The value of the user property.
     */
      setUserProperty(name, value) {
        if (!name || value === undefined) return;
        this._callNativeMethod('setUserProperty', { name, value });
      },

    /**
     * Sets default event parameters for Firebase Analytics.
     *
     * @param {Object} params - The default parameters.
     */
      setDefaultEventParameters(params) {
        if (!params) return;
        this._callNativeMethod('setDefaultEventParameters', { parameters: params });
      },

    /**
     * Sets the user ID in Firebase Analytics.
     *
     * @param {string} userId - The user ID.
     */
      setUserId(userId) {
        if (userId === undefined) return;
        this._callNativeMethod('setUserId', { userId });
      },

    /**
     * Enables or disables Firebase Analytics data collection.
     *
     * @param {boolean} value - Whether to enable or disable data collection.
     */
      setAnalyticsCollectionEnabled(value) {
        if (typeof value !== 'boolean') return;
        this._callNativeMethod('setAnalyticsCollectionEnabled', { value });
      },
      
    /**
     * Resets Firebase Analytics data.
     */
      resetAnalyticsData() {
        this._callNativeMethod('resetAnalyticsData');
      },

    /**
     * Sets consent settings for Firebase Analytics.
     *
     * @param {Object} consentSettings - The consent settings.
     */
      setConsent(consentSettings) {
        if (!consentSettings) return;
        this._callNativeMethod('setConsent', { consentSettings });
      }
    };
    
    enableLog && console.log(logPrefix, 'Initialized global object.');
      
  } catch(e) {}
})();
