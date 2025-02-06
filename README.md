# GA4 Unified Tag for Webview (Web & App) | Firebase Analytics Handler Global Variable Initialization
[TO DO - Explain what this tag does]
This tag template implements the Javascript Handler in your webview. This is nothing more than a Javascript global object that holds the abstraction for calling the iOS or Android Firebase Analytics interfaces.

An alternative way to implement it is via the [source code](https://github.com/giovaniortolani/ga4-unified-tag-for-webview-web-app-firebase-analytics-handler-global-variable-initialization/blob/main/source-code-es6-version.js) by your developers.

It's one of the required dependencies of the [GA4 Unified Tag for Webview (Web & App) | Commands Tag](https://github.com/giovaniortolani/ga4-unified-tag-for-webview-web-app-commands-tag) implementation.

For more information, check the ["Implement JavaScript handler" section in the reference article from Google](https://firebase.google.com/docs/analytics/webview?platform=android#implement-javascript-handler).

## Preface
This tag template won't be for everyone. This template is geared more toward GTM power users with advanced implementation practices that require a more robust UI.

## Example
[TO DO]
![image](https://github.com/user-attachments/assets/d95c1fe9-b9b5-4c49-8ea6-3da1b37f0d90)

## Installation & Setup
### 1. Import the Template into GTM
1. Download the `tpl` file.
2. In **GTM**, navigate to **Templates** > **Tag Templates**.
3. Click **New** > **Import**.
4. Select the template file and save it.

This template has been submitted to the Google Tag Manager Template Gallery. Once it's approved, you don't need to manually import it anymore. Just search it via the GTM UI.

### 2. Import the **GA4 Unified Tag for Webview (Web & App) | Commands Tag** template into GTM
[TO DO]
https://github.com/giovaniortolani/ga4-unified-tag-for-webview-web-app-commands-tag

### 3. Tag Configuration
It must be added before GTM starts sending events to Firebase (if adding via the GTM template, use the Initialization trigger; if adding via the source code, ensure that this code runs early on the page, ideally before GTM loads).
[TO DO - explain where it must fire]

## Limitations
[TO DO]

## Author(s)
[Giovani Ortolani Barbosa](https://www.linkedin.com/in/giovani-ortolani-barbosa/)
