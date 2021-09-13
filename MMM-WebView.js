/* Magic Mirror
 * Module: MMM-WebView
 *
 * By Shunta Iketaki https://twitter.com/Iketaki
 * MIT Licensed.
 */

Module.register('MMM-WebView', {
	defaults: {
		url: 'https://www.google.com/',
		height: '640px',
		width: '480px',
	},
	getDom: function () {
		let wrapper = document.createElement('div');
		wrapper.id = 'mmm-webview-wrapper';
		wrapper.innerHTML = `<webview style="width: ${this.config.width}; height: ${this.config.height};" src="${this.config.url}"></webview>`;
		return wrapper;
	},
});
