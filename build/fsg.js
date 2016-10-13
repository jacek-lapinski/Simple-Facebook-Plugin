var FSG = (function () {
    function FSG(config) {
        this.config = config;
        this.init();
    }
    FSG.prototype.init = function () {
        this.initFbScript(document, 'facebook-jssdk');
        this.initFb(window);
    };
    FSG.prototype.initFb = function (window) {
        var _this = this;
        window.fbAsyncInit = function () {
            FB.init({
                appId: _this.config.appId,
                xfbml: true,
                version: 'v2.8'
            });
            _this.loadAlbums(_this.config.elementId);
        };
    };
    FSG.prototype.initFbScript = function (document, id) {
        if (document.getElementById(id)) {
            return;
        }
        var fjs = document.getElementsByTagName('script')[0];
        var js = document.createElement('script');
        js.id = id;
        js.src = "http://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    };
    FSG.prototype.loadAlbums = function (elementId) {
        var _this = this;
        var albumsLoader = new AlbumsLoader(this.config);
        var albums = albumsLoader.loadAlbums();
        var albumsElement = document.getElementById(elementId);
        var ulElement = document.createElement('ul');
        ulElement.className = 'fsg-albums';
        albumsElement.appendChild(ulElement);
        albums.then(function (list) {
            list.forEach(function (album) {
                var liElement = _this.createAlbumElement(album);
                ulElement.appendChild(liElement);
            });
        });
    };
    FSG.prototype.createAlbumElement = function (album) {
        var imgElement = document.createElement('img');
        album.cover_photo_url.then(function (url) { return imgElement.src = url; });
        var titleElement = document.createElement('div');
        titleElement.className = 'fsg-album-title';
        titleElement.innerText = album.name;
        var liElement = document.createElement('li');
        liElement.appendChild(imgElement);
        liElement.appendChild(titleElement);
        return liElement;
    };
    return FSG;
}());
;
var AlbumsLoader = (function () {
    function AlbumsLoader(config) {
        this.config = config;
    }
    AlbumsLoader.prototype.loadAlbums = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            FB.api('/' + _this.config.fbPage + '/albums', { access_token: _this.config.accessToken }, function (response) {
                var albums = response.data;
                albums.forEach(function (album) {
                    album.cover_photo_url = _this.loadAlbumCoverPicture(album);
                });
                resolve(albums);
            });
        });
    };
    AlbumsLoader.prototype.loadAlbumCoverPicture = function (album) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            FB.api('/' + album.id + '/picture', { access_token: _this.config.accessToken }, function (response) {
                resolve(response.data.url);
            });
        });
    };
    return AlbumsLoader;
}());
;
var fsg = new FSG({
    appId: '1270801512983487',
    accessToken: '1270801512983487|21c21db8b582aa474f30bea9b73edc0b',
    fbPage: 'kendosopot',
    elementId: 'albums'
});
