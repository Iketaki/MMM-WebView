# MMM-WebView: A WebView module for MagicMirror²

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

MMM-WebView allows you to add a webview which can display any url.

This module uses the [Electron's \<webview\> tag](https://www.electronjs.org/docs/api/webview-tag) instead of `<iframe>` to embed pages.
It makes possible to display pages that cannot be displayed in a `<iframe>`.

## Installation

1. Clone this repository in your `modules` folder:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/Iketaki/MMM-WebView.git
```

2. Add the following configuration block to the modules array in the `config/config.js` file:

```js
let config = {
  modules: [
    {
      module: 'MMM-WebView',
      position: 'top_center',
      config: {
        url: 'https://www.google.com/',
        width: '640px',
        height: '480px',
      },
    },
  ],
};
```

3. Finally, add the following configuration block to `config/config.js` file. This is required to run this module correctly.

```js
let config = {
  electronOptions: {
    webPreferences: {
      webviewTag: true,
    },
  },
};
```

## Update

1. Get the latest version using the command `git pull`:

```bash
cd ~/MagicMirror/modules/MMM-WebView
git pull
```

## Configuration options

| Option                | Description                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `url`<br>             | [Optional] the URL in the WebView<br>Default: `https://www.google.com/`                                                    |
| `width`               | [Optional] the Width of the WebView (the value of CSS property `width`)<br>Default: `640px`                                |
| `height`              | [Optional] the Height of the WebView (the value of CSS property `height`)<br>Default: `480px`                              |
| `autoRefresh`         | [Optional] Set to true to allow an auto-refresh of the WebView<br>Default: `false`                                         |
| `autoRefreshInterval` | [Optional] the interval of auto-refresh for the WebView, in milliseconds If autoRefresh: true<br>Default: `10 * 60 * 1000` |
| `loadedJS`            | [Optional] the JavaScript code string to be executed after page load<br>Default: `undefined`                               |

## Motivation

When considering about embedding websites to MagicMirror, some websites cannot be embedded using iframe.

There are several reasons, one of that is HTTP response header `X-Frame-Options: DENY` by the websites makes iframe disable. This is needed for the internet security.

For MagicMirror usage, using WebView instead of iframe may resolve the problem.
