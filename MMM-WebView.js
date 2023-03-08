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
    autoRefreshInterval: 10 * 60 * 1000, // Refresh interval in milliseconds (10 minutes)
    refreshMinute: 5, // Set the minute at which to refresh
    useRefreshMinute: true, // Set to false to use autoRefreshInterval instead of refreshMinute
    loadedJS: undefined,
  },

  start: function() {
    if (this.config.autoRefresh) {
      if (this.config.useRefreshMinute) {
        const refreshInterval = 60 * 60 * 1000; // Refresh interval in milliseconds (1 hour)
        setInterval(() => {
          const now = new Date();
          if (now.getMinutes() === this.config.refreshMinute) {
            const webview = document.getElementById(WEBVIEW_ID);
            webview.reloadIgnoringCache();
          }
        }, refreshInterval);
      } else {
        setInterval(() => {
          const webview = document.getElementById(WEBVIEW_ID);
          webview.reloadIgnoringCache();
        }, this.config.autoRefreshInterval);
      }
    }
  },

  getDom: function() {
    let wrapper = document.createElement('div');
    wrapper.id = 'mmm-webview-wrapper';
    wrapper.innerHTML = `<webview id="${WEBVIEW_ID}" style="width: ${this.config.width}; height: ${this.config.height};" src="${this.config.url}"></webview>`;
    return wrapper;
  },

  notificationReceived: function(notification, payload, sender) {
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
