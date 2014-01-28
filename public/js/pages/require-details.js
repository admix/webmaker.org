requirejs.config({
  baseUrl: '/js',
  paths: {
    'jquery': '../bower/jquery/jquery',
    'social': '../js/lib/socialmedia',
    'localized': '../bower/webmaker-i18n/localized'
  }
});
require(['pages/details']);
