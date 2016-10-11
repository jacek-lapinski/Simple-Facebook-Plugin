  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1270801512983487',
      xfbml      : true,
      version    : 'v2.8'
    });

    FB.api('/kendosopot/albums', { access_token: 'EAACEdEose0cBAO8UPWdlGZCLiWuRmeB7jrZCm6TFUk96xtZAZCoXUDW5oFV86490HcoMU4rTUbVH7QAfF4g5MuZAyy1lWgC5c8Csa1ETZCWJQggSolr5MwDyB8NDYJkoV2E3zZAiiiZC5oZBJPF6bOKaxa3ZAms2sLeRGIvnqCHHDRaAZDZD'}, function(response) {
        console.log(response);
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "http://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));