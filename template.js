const callInWindow = require('callInWindow');
const setInWindow = require('setInWindow');
const copyFromWindow = require('copyFromWindow');
const logToConsole = require('logToConsole');
const getType = require('getType');
const JSON = require('JSON');
const Object = require('Object');
const containerVersion = require('getContainerVersion')();

/**
 * Logs messages to the console based on debug mode or user preference.
 * Only logs to console, if:
 * - is on preview and debug mode, always
 * or
 * - production, if the checkbox data.enableLog is checked.
 * @param {string} message - The log message to display.
 * @param {*} content - Additional content to log, such as objects or variables.
 */
const log = (message, content) => {
  const logIdentifier = '[GA4 Unified Tag for Webview (Web & App) | Firebase Analytics Handler Global Variable Initialization] |';
  const isInPreviewOrDebugMode = containerVersion.previewMode || containerVersion.debugMode;
  if (data.enableLog || isInPreviewOrDebugMode) logToConsole(logIdentifier, message, content);
};

/**
 * Initializes the Firebase Analytics Handler global variable for native communication.
 */
const initializeFirebaseAnalyticsHandlerGlobal = () => {
  log('initializeFirebaseAnalyticsHandlerGlobal', 'Initializing JS handler global object.');

  // Check if the Firebase Analytics Handler global variable already exists
  const firebaseAnalyticsHandlerName = data.firebaseAnalyticsHandlerName || 'firebaseAnalyticsHandler';
  let firebaseAnalyticsHandler = copyFromWindow(firebaseAnalyticsHandlerName);
   
  if (!firebaseAnalyticsHandler) {
    // Define the Firebase Analytics Handler global variable
    firebaseAnalyticsHandler = {
      /**
       * Calls a native method for Firebase Analytics.
       *
       * @param {string} command - The command to execute (e.g., 'logEvent').
       * @param {Object} data - The data to pass to the native method.
       */
      _callNativeMethod: function (command, params) {
        // Check for the interfaces on every run to overcome problems if they were defined late.
        const androidInterfaceName = data.firebaseAnalyticsInterfaceNameAndroid || 'AnalyticsWebInterface';
        const iOSInterfaceName = data.firebaseAnalyticsInterfaceNameIOS || 'firebase';
        const androidInterface = copyFromWindow(androidInterfaceName);
        const iOSInterface = copyFromWindow('webkit.messageHandlers.' + iOSInterfaceName);
        const commonInterfaceName = data.firebaseAnalyticsInterfaceNameCommon;
        const commonInterface = commonInterfaceName && copyFromWindow(commonInterfaceName);
        
        log('_callNativeMethod | interface: ', { 
          iOSInterface: iOSInterface, 
          androidInterface: androidInterface,
          commonInterface: commonInterface
        });
        log('_callNativeMethod | command and params: ', { command: command, params: params });
        
        if (androidInterface) {
          // Android native interface          
          switch(command) {
            case 'logEvent':
              callInWindow(androidInterfaceName + '.logEvent', params.name, JSON.stringify(params.parameters));
              break;
            case 'setUserProperty':
               callInWindow(androidInterfaceName + '.setUserProperty', params.name, params.value);
              break;
            case 'setDefaultEventParameters':
              callInWindow(androidInterfaceName + '.setDefaultEventParameters', JSON.stringify(params.parameters));
              break;
            case 'setUserId':
              callInWindow(androidInterfaceName + '.setUserId', params.userId);
              break;
            case 'setAnalyticsCollectionEnabled':
              callInWindow(androidInterfaceName + '.setAnalyticsCollectionEnabled', params.value);
              break;
            case 'resetAnalyticsData':
              callInWindow(androidInterfaceName + '.resetAnalyticsData');
              break;
            case 'setConsent':
              callInWindow(androidInterfaceName + '.setConsent', JSON.stringify(params.consentSettings));
              break;
          }
        } else if (iOSInterface) {
          // iOS native interface
          const message = { command: command };
          Object.keys(params || {}).forEach((key) => message[key] = params[key]);
          callInWindow('webkit.messageHandlers.' + iOSInterfaceName + '.postMessage', message);
        } else if (commonInterface) {
          // Common (iOS and Android) native interface
          const message = { command: command };
          Object.keys(params || {}).forEach((key) => message[key] = params[key]);
          callInWindow(commonInterfaceName, JSON.stringify(message));
        } else {
          log('_callNativeMethod', 'No native APIs found.');
        }
      },

      /**
       * Logs an event to Firebase Analytics.
       *
       * @param {string} name - The name of the event.
       * @param {Object} params - The event parameters.
       */
      logEvent: function (name, params) {
        if (!name) return;
        firebaseAnalyticsHandler._callNativeMethod('logEvent', { name: name, parameters: params });
      },

      /**
       * Sets a user property in Firebase Analytics.
       *
       * @param {string} name - The name of the user property.
       * @param {*} value - The value of the user property.
       */
      setUserProperty: function (name, value) {
        if (!name || value === undefined) return;
        firebaseAnalyticsHandler._callNativeMethod('setUserProperty', { name: name, value: value });
      },

      /**
       * Sets default event parameters for Firebase Analytics.
       *
       * @param {Object} params - The default parameters.
       */
      setDefaultEventParameters: function (params) {
        if (!params) return;
        firebaseAnalyticsHandler._callNativeMethod('setDefaultEventParameters', { parameters: params });
      },

      /**
       * Sets the user ID in Firebase Analytics.
       *
       * @param {string} userId - The user ID.
       */
      setUserId: function (userId) {
        if (userId === undefined) return;
        firebaseAnalyticsHandler._callNativeMethod('setUserId', { userId: userId });
      },

      /**
       * Enables or disables Firebase Analytics data collection.
       *
       * @param {boolean} value - Whether to enable or disable data collection.
       */
      setAnalyticsCollectionEnabled: function (value) {
        if (getType(value) !== 'boolean') return;
        firebaseAnalyticsHandler._callNativeMethod('setAnalyticsCollectionEnabled', { value: value });
      },

      /**
       * Resets Firebase Analytics data.
       */
      resetAnalyticsData: function () {
        firebaseAnalyticsHandler._callNativeMethod('resetAnalyticsData');
      },

      /**
       * Sets consent settings for Firebase Analytics.
       *
       * @param {Object} consentSettings - The consent settings.
       */
      setConsent: function (consentSettings) {
        if (!consentSettings) return;
        firebaseAnalyticsHandler._callNativeMethod('setConsent', { consentSettings: consentSettings });
      },
    };
    
    log('JS Handler global object not detected. Initialized global object:', firebaseAnalyticsHandlerName);
    // Set the Firebase Analytics Handler in the global scope
    setInWindow(firebaseAnalyticsHandlerName, firebaseAnalyticsHandler, true);
  }
};

log('data:', data);

initializeFirebaseAnalyticsHandlerGlobal();

data.gtmOnSuccess();
