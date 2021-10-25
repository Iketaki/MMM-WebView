/* Magic Mirror
 * Module: MMM-WebView
 *
 * By Shunta Iketaki https://twitter.com/Iketaki
 * MIT Licensed.
 */

const WEBVIEW_ID = 'mmm-webview';

Module.register('MMM-WebView', {
  defaults: {
    url: 'https://www.google.com/',
    height: '640px',
    width: '480px',
    autoRefresh: false,
    autoRefreshInterval: 10 * 60 * 1000,
    loadedJS: undefined,
  },
  start: function () {
    if (this.config.autoRefresh) {
      setInterval(() => {
        //Electron.session.defaultSession.clearCache(() => {});
        //this.updateDom();
        const webview = document.getElementById(WEBVIEW_ID);
        webview.reloadIgnoringCache();
      }, this.config.autoRefreshInterval);
    }
  },
  getDom: function () {
    let wrapper = document.createElement('div');
    wrapper.id = 'mmm-webview-wrapper';
    wrapper.innerHTML = `<webview id="${WEBVIEW_ID}" style="width: ${this.config.width}; height: ${this.config.height};" src="${this.config.url}"></webview>`;
    return wrapper;
  },
  notificationReceived: function (notification, payload, sender) {
    if (notification == 'MODULE_DOM_CREATED') {
      if (this.config.loadedJS && this.config.loadedJS.length > 0) {
        const webview = document.getElementById(WEBVIEW_ID);
        if (webview) {
          webview.addEventListener('did-finish-load', () => {
            webview.executeJavaScript(this.config.loadedJS);
          });
        } else {
          // TODO: Show Error
        }
      }
    }
  },
});
