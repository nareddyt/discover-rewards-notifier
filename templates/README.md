# UI

This folder contains [Handlebars](https://handlebarsjs.com/) templates for the extension's UI.
Essentially, it allows us to define a **template** for the UI with placeholders for the values.
The extension's js code in [../src/popup.js](../src/popup.js) can use these templates and just pass in real data to be displayed.

## Compiling

For the extension to work, you must **compile** the templates. This converts these `.handlebars` files into `.js` files.

As stated in the **Getting Started Guide** in the [../README.md](../README.md), you can run the following line to compile templates:

```
npm run compileTemplates
```

This places the compiled templates directly into [../src][../src].

_Alternatively_, you can **watch** the templates so that they automatically re-compile anytime you change them.

To use this feature, run this command:

```bash
npm run watchTemplates
```

This also places the compiled templates directly into [../src][../src].