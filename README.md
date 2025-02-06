# GA4 Unified Tag for Webview (Web & App) | Firebase Analytics Handler Global Variable Initialization
This tag template implements the Javascript Handler in your webview. It creates a global object that provides an abstraction for calling the iOS or Android Firebase Analytics interfaces.

An alternative way to implement it is via the [source code](https://github.com/giovaniortolani/ga4-unified-tag-for-webview-web-app-firebase-analytics-handler-global-variable-initialization/blob/main/source-code-es6-version.js) by your developers.

It's one of the required dependencies of the [GA4 Unified Tag for Webview (Web & App) | Commands Tag](https://github.com/giovaniortolani/ga4-unified-tag-for-webview-web-app-commands-tag) implementation.

It must be added to the page **before GTM starts sending events to Firebase**. If added via the GTM template, use an Initialization trigger; if added via source code, ensure this code runs early in the page load process.

You do not need to use this GTM template if you have already added the handler via source code.

For more information, see the ["Implement JavaScript handler" section in the Google reference article](https://firebase.google.com/docs/analytics/webview?platform=android#implement-javascript-handler).

## Preface
This tag template is designed for GTM power users with advanced implementation practices that require a robust UI.

## Examples
- **Using `different` interfaces for Android and iOS**  
  ![image](https://github.com/user-attachments/assets/d95c1fe9-b9b5-4c49-8ea6-3da1b37f0d90)
  The `firebaseAnalyticsHandler` is the JavaScript Handler. For Android, the native interface is in the `AnalyticsWebInterface` global variable; for iOS, it is in the `firebase` property within `webkit.messageHandlers`.

- **Using the `same` interface for both Android and iOS**  
  ![image](https://github.com/user-attachments/assets/26c1f510-4be0-4945-a680-f856690b6616)
  The `firebaseAnalyticsHandler` is the JavaScript Handler. For both Android and iOS, the common native interface is exposed via `WebInterface.postMessage`.

## Installation & Setup
### 1. Import the Template into GTM
1. Download the `tpl` file.
2. In **GTM**, navigate to **Templates** > **Tag Templates**.
3. Click **New** > **Import**.
4. Select the template file and save it.

This template has been submitted to the Google Tag Manager Template Gallery. Once approved, you can search for it directly in the GTM UI.

### 2. Import the **GA4 Unified Tag for Webview (Web & App) | Commands Tag** template into GTM
Follow the instructions outline [here](https://github.com/giovaniortolani/ga4-unified-tag-for-webview-web-app-commands-tag).

### 3. Tag Configuration
If adding via the **GTM template**, use the *Initialization trigger*; if adding via the **source code**, ensure that this code runs early on the page, ideally before GTM loads.

Refer to the [Examples](#examples) section above for guidance.  

> **Note:** If you modify any of the JavaScript Handler or native interface names in the template, you must also update the "Accesses global variables" permissions in the Template Editor.

## Author(s)
[Giovani Ortolani Barbosa](https://www.linkedin.com/in/giovani-ortolani-barbosa/)
