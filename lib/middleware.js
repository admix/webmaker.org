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
      'default-src': ["'self'"],
      'report-uri': '/restxt',
      'frame-src': ["'self'", options.detailsHost, options.profileHost],
      'img-src': ["'self'", "https://ssl.google-analytics.com", "http://ssl.google-analytics.com", "http://www.google-analytics.com"],
      'script-src': ["'self'", "https://mozorg.cdn.mozilla.net/en-US/tabzilla/tabzilla.js","https://mozorg.cdn.mozilla.net/tabzilla/tabzilla.js"],//"https://ssl.google-analytics.com","https://mozorg.cdn.mozilla.net/en-US/tabzilla/tabzilla.js","https://mozorg.cdn.mozilla.net/tabzilla/tabzilla.js"],
      'style-src': ["'self'","'unsafe-inline'","https://mozorg.cdn.mozilla.net/media/css/tabzilla-min.css","http://mozorg.cdn.mozilla.net/media/css/tabzilla-min.css"]//,"http://localhost:3000/css/nav.css"]//, "'unsafe-inline'"]
    }
  });
};

module.exports.errorHandler = function(err, req, res, next) {
  if (!err.status) {
    err.status = 500;
  }

  res.status(err.status);
  res.render("error.html", err);
};

module.exports.fourOhFourHandler = function(req, res, next) {
  var err = {
    message: req.gettext("You found a loose thread!"),
    status: 404
  };

  res.status(err.status);
  res.render("error.html", err);
};

module.exports.setVanityURL = function(req, res, next) {
  res.locals.vanityURL = utils.getUrl(req);
  next();
};

module.exports.loadMakeDetails = function(makeClient) {
  return function(req, res, next) {
    makeClient.url(utils.getUrl(req))
      .then(function(err, makes, total) {
        if (err) {
          return next(err);
        }

        if (!makes.length) {
          return next("route");
        }

        res.locals.make = makes[0];
        next();
      });
  };
};

module.exports.proxyPathPrepare = function(staticDataStore) {
  return function(req, res, next) {
    var subdomain = req.subdomains[0];

    if (!subdomain) {
      return next("route");
    }
    res.locals.proxyPath = url.resolve(staticDataStore, subdomain + req.path);
    next();
  }
};

module.exports.removeCSP = function(req, res, next) {
  res.removeHeader("Content-Security-Policy-Report-Only");

  process.nextTick(function() {
    next();
  });
};

module.exports.rootRedirect = function rootRedirect(req, res, next) {
  if (req.subdomains.length !== 1) {
    return res.redirect(307, "https://webmaker.org");
  }

  next();
};
