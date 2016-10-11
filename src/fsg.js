
window.fbAsyncInit = function () {
  $.getScript("http://connect.facebook.net/en_US/sdk.js")
    .done(function (script, textStatus) {
      //console.log("Facebook Init called..");
      FB.init({
        appId: '1270801512983487',
        cookie: true,
        xfbml: false,
        version: 'v2.8'
      });
      FB.AppEvents.logPageView();
      FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          console.log('Logged in.');
        }
        else {
          FB.login();
        }
      });
    })
    .fail(function (jqxhr, settings, exception) {
      //console.log("Facebook Init failed..");
    });
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = "http://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));