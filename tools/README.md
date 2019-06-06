# Tools and Scripts

This directory contains tools, scripts, and config files.
There are all used by the developers to aid the development process.
None of the items in this directory are included in the extension's release.

## dataProcessor.js

A node.js script for transforming raw Discover Data into production-ready json files.

Please read the documentation and comments inside that script for more info.

In order to use this script, you must have a valid API key for [Microsoft Cognitive Services: Bing Web Search](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/).
This API key should be set in the `COGNITIVE_SERVICES_BING_KEY` environment variable.
This should not cost you any money, and it only requires a valid Azure account.
Details on setting up the free plan and retrieving the API key can be found [here](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account).

## hbw-config.json

A config file for handlebars. This allows developers to automatically re-compile handlebar templates anytime they are changed.

To use this feature, see [../templates/README.md](../templates/README.md).
