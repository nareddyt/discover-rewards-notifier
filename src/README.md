# Core Extension Code

This directory contains all the core code for the extension. This is the only _code_ packaged with the extension.
It also has some CSS for styling and the Handlebars library.
See [../templates](../templates) for more info on Handlebars.

[../manifest.json](../manifest.json) has references to the items in this folder based on their functionality type.
It essentially serves as the entry point for all the code in this directory.
For more info on `manifest.json`, see the [Chrome Developer Docs](https://developer.chrome.com/extensions/manifest).

**Note:** The Handlebars templates get directly compiled into this folder, creating a `templates.js` file.

## Background Page

[background.js](background.js) serves as the extension's [Background Page](https://developer.chrome.com/extensions/background_pages).

Please read the documentation and comments inside that script for more info.

## Popup

[popup.html](popup.html) represents the content that is loaded when the **extension's icon** is clicked.
As defined in [../manifest.json](../manifest.json), this popup is the default popup for the [Page Action](https://developer.chrome.com/extensions/pageAction).

Note that [popup.html](popup.html) serves as the entry point to other scripts and stylesheets.

Please read the documentation and comments inside those files for more info.