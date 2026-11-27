// Runs in <head>, before the page is drawn: names the visitor's system on <html> (data-system), so the hero offers
// the download for it (styles/hero.css). A system it does not know, a phone among them, keeps the macOS button.
(function () {
  var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  var agent = navigator.userAgent || '';
  var system = null;
  if (/win/i.test(platform)) {
    system = 'windows';
  } else if (/linux/i.test(platform) && !/android/i.test(agent)) {
    system = 'linux';
  }

  if (system) {
    document.documentElement.setAttribute('data-system', system);
  }
})();
