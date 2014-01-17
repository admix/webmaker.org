var hash = window.location.hash;
if( hash.length > 0 ) {
  var tag = hash.slice(1);
  window.location = window.location.origin + '/t/' + tag;
}