(function() {
      window.onerror = function (message, url, linenumber) {
        window.jsErrorDetected = true;
      }
    })();