/*
  Proxy Persona
*/
function proxyPersona(source, type) {
  return function(arg) {
    var payload = {
      type: type,
      data: {}
    };
    switch (type) {
      case "sso_onlogin":
        payload.data.assertion = arg;
        break;
      default:

        break;
    }
    source.postMessage(JSON.stringify(payload), "*");
  }
}

function setupLoginButton(loginButton, logoutButton) {
  loginButton.addEventListener("click", function() {
    var personaObj = {
          backgroundColor: "#E3EAEE",
          privacyPolicy: "/privacy",
          returnTo: "/new",
          siteName: "Mozilla Webmaker",
          termsOfService: "/terms"
        };

    if (location.protocol === "https:") {
      personaObj.siteLogo = "/img/logo-webmaker.png";
    }

    navigator.id.request(personaObj);
  }, false);

  // Set up the logout button's UX
  logoutButton.addEventListener("click", function() {
    navigator.id.logout();
  }, false);
}

/**
 * Listen for messages from owning document.
 */
window.addEventListener("message", function onMessage(event) {
  window.removeEventListener("message", onMessage, false);
  
  //wrap with try...catch
  var payload = JSON.parse(event.data),
      loginButton = document.getElementById("webmaker-login"),
      logoutButton = document.getElementById("webmaker-logout");

  function showLogin() {
    if (!loginButton || !logoutButton ) {
      return;
    }
    loginButton.style.display = "inline-block";
    logoutButton.style.display = "none";
  }

  function showLogout() {
    if (!loginButton || !logoutButton ) {
      return;
    }
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";
  }

  if (payload.type === "sso_watch") {
    var proxyLogin = proxyPersona(event.source, "sso_onlogin"),
        proxyLogout = proxyPersona(event.source, "sso_onlogout");
    navigator.id.watch({
      loggedInUser: payload.data.loggedInUser,
      onlogin: function(assertion) {
        proxyLogin(assertion);
        showLogout();
      },
      onlogout: function() {
        showLogin();
        proxyLogout();
      },
      onmatch: proxyPersona(event.source, "sso_onmatch")
    });

    // Set up the login button's UX now that navigator.id.watch is done
    // (we have to make sure navigator.id.request() happens after watch())
    setupLoginButton(loginButton, logoutButton);
  }
}, false);
