var loginAPI = require("./loginapi"),
	hood = require("hood"),
	url = require("url");

module.exports.checkAdmin = function (req, res, next) {
  loginAPI.getUserByEmail(req.session.email, function (err, user) {
    if (err || !user || !user.isAdmin) {
      return next(new Error("Admin access only"));
    }
    req.isAdmin = true;
    return next();
  });
};

module.exports.addCSP = function(options) {
  return hood.csp({
    headers: [
      "Content-Security-Policy-Report-Only"
    ],
    policy: {
      'default-src': ["'self'","http://mozorg.cdn.mozilla.net","https://themes.googleusercontent.com"],
      'report-uri': ["'uri'"],
      'frame-src': ["'self'","https://login.persona.org"],
      'img-src': ["*"],
      'script-src': ["'self'","https://mts0.googleapis.com","https://maps.gstatic.com","https://maps.googleapis.com","https://login.persona.org","http://mozorg.cdn.mozilla.net","https://mozorg.cdn.mozilla.net"],
      'style-src': ["'self'","http://mozorg.cdn.mozilla.net/media/css/tabzilla-min.css","http://localhost:3000/css/nav.css","https://fonts.googleapis.com","https://mozorg.cdn.mozilla.net"]
    }
  });
};