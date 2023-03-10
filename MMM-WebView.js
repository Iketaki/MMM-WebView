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
    autoRefresh: true,
    autoRefreshInterval: 10 * 60 * 1000, // Refresh interval in milliseconds (10 minutes)
    refreshMinute: 5, // Set the minute at which to refresh
    useRefreshMinute: true, // Set to false to use autoRefreshInterval instead of refreshMinute
    invert: false, // Set to true to activate invert, false to disable
	invertColors: false, // Set to true to invert colors, false to invert only white
    filterPercent: 100, // new config option for filter percentage
    loadedJS: undefined,
    showScrollbar: false,
  },

start: function() {
  if (this.config.autoRefresh) {
    if (this.config.useRefreshMinute) {
      const refreshInterval = 60 * 1000; // Refresh interval in milliseconds (1 minute)
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

//  const myWebView = document.getElementById(WEBVIEW_ID);
//  myWebView.insertCSS('html,body{ overflow: hidden !important; }');
},



getDom: function () {
  let wrapper = document.createElement('div');
  wrapper.id = 'mmm-webview-wrapper';
  wrapper.classList.add('mmm-webview');
  let scrollbar = this.config.showScrollbar ? 'auto' : 'hidden';
  let filter;
  if (this.config.invert) {
    filter = this.config.invertColors ? `invert(${this.config.filterPercent}%)` : `saturate(0) brightness(100%) invert(100%)`;
  } else {
    filter = 'none';
  }
  wrapper.innerHTML = `<webview id="${WEBVIEW_ID}" style="width: ${this.config.width}; height: ${this.config.height}; filter: ${filter}; overflow: hidden;" src="${this.config.url}"></webview>`;
  wrapper.style.overflow = scrollbar;
      // Add the CSS styling to the webview
    let webview = wrapper.querySelector('webview');
    webview.addEventListener('did-finish-load', () => {
      webview.insertCSS('html, body { overflow: hidden !important; }');
    });
  return wrapper;
},

toggleScrollbar: function() {
  this.config.showScrollbar = !this.config.showScrollbar;
  const wrapper = document.getElementById('mmm-webview-wrapper');
  if (this.config.showScrollbar) {
    wrapper.style.overflow = 'auto';
  } else {
    wrapper.style.overflow = 'hidden';
  }
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
    if (notification === 'MMM_WEBVIEW_TOGGLE_SCROLLBAR') {
      this.toggleScrollbar();
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
