// From solveig-site (https://github.com/icebit-no/solveig-site, MIT), src/scripts/language.js.
//
// Runs in <head>, before the page is drawn: a reader who chose a language with the switch in the hero gets each page
// in that language. The page's own <link rel="alternate" hreflang> names its other address, so this script knows no
// paths. Without storage (a private window, storage turned off) the page simply stays in the language it is in.
(function () {
  var key = 'skald-language';
  var lang = document.documentElement.lang;
  try {
    var chosen = window.localStorage.getItem(key);
    if (chosen && chosen !== lang) {
      var other = document.querySelector('link[rel="alternate"][hreflang="' + chosen + '"]');
      if (other) {
        var target = new URL(other.getAttribute('href'), window.location.href);
        window.location.replace(target.pathname + window.location.search + window.location.hash);
        return;
      }
    }
  } catch (e) {
    // Storage is not available; the page works as it is.
  }

  document.addEventListener('click', function (event) {
    var link = event.target instanceof Element ? event.target.closest('a[data-language]') : null;
    if (!link) {
      return;
    }

    try {
      window.localStorage.setItem(key, link.getAttribute('data-language'));
    } catch (e) {
      // The link still opens the page in the other language.
    }
  });
})();
