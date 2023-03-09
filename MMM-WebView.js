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
    invertColors: false,
    filterPercent: 100, // new config option for filter percentage
    loadedJS: undefined,
    showScrollbar: true,
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

  getDom: function () {
    let wrapper = document.createElement('div');
    wrapper.id = 'mmm-webview-wrapper';
	wrapper.classList.add('mmm-webview'); 
    wrapper.style.overflow = this.config.showScrollbar ? 'scroll' : 'hidden';
    let filter = this.config.invertColors ? `invert(${this.config.filterPercent}%)` : 'none';
    wrapper.innerHTML = `<webview id="${WEBVIEW_ID}" style="width: ${this.config.width}; height: ${this.config.height}; filter: ${filter};" src="${this.config.url}"></webview>`;
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

  getStyles: function () {
    return ['MMM-WebView.css'];
  },

  getScripts: function() {
    return ['moment.js'];
  },

  toggleScrollbar: function() {
    this.config.showScrollbar = !this.config.showScrollbar;
    const wrapper = document.getElementById('mmm-webview-wrapper');
    if (this.config.showScrollbar) {
      wrapper.style.overflow = 'scroll';
    } else {
      wrapper.style.overflow = 'hidden';
    }
  },

  notificationReceived: function(notification, payload, sender) {
    if (notification === 'MMM_WEBVIEW_TOGGLE_SCROLLBAR') {
      this.toggleScrollbar();
    }
  },

  suspend: function() {
    const webview = document.getElementById(WEBVIEW_ID);
    if (webview) {
      webview.src = '';
    }
  },

  resume: function() {
    const webview = document.getElementById(WEBVIEW_ID);
    if (webview) {
      webview.src = this.config.url;
    }
  }
});
