"use strict";
const SRC_SUFFIX = ['.html', '.css', '.js', '.svg'];
// Immediately install and activate.
self.addEventListener('install', evt => {
  evt.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});
function isFileWithSrc(pathname) {
  for (let suffix of SRC_SUFFIX) {
    if (pathname.endsWith(suffix)) {
      return true;
    }
  }
  return false;
}
self.addEventListener('fetch', evt => {
  let request = evt.request;
  if (request.mode == 'navigate') {
    let url = new URL(request.url);
    if (isFileWithSrc(url.pathname)) {
      url.pathname = '/sources' + url.pathname.replace('.', '_') + '.html';
      let init = {};
      // Copy all fields from original request to init, ...
      for (let key in request) {
        init[key] = request[key];
      }
      // but change mode explicitly because 'navigate' is not allowed
      // to be used for creating new request.
      init.mode = 'no-cors';
      request = new Request(url.href, init);
    }
  }
  evt.respondWith(fetch(request));
});
