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
        var _this = this;
        var imgElement = document.createElement('img');
        imgElement.src = album.picture;
        var titleElement = document.createElement('div');
        titleElement.className = 'fsg-album-title';
        titleElement.innerText = album.name;
        var albumElement = document.createElement('div');
        albumElement.appendChild(imgElement);
        albumElement.appendChild(titleElement);
        var imagesElement = document.createElement('div');
        imagesElement.id = this.getImagesId(album);
        var liElement = document.createElement('li');
        liElement.appendChild(albumElement);
        liElement.appendChild(imagesElement);
        albumElement.onclick = function (ev) {
            var collection = _this.getAlbumImagesElement(album);
            if (collection.childNodes.length == 0) {
                _this.loadAlbumImages(album, true);
            }
        };
        return liElement;
    };
    FSG.prototype.getAlbumImagesElement = function (album) {
        var collectionId = this.getImagesId(album);
        var collection = document.getElementById(collectionId);
        return collection;
    };
    FSG.prototype.getImagesId = function (album) {
        return "images-" + album.id;
    };
    FSG.prototype.getImageId = function (image) {
        return "image-" + image.id;
    };
    FSG.prototype.loadAlbumImages = function (album, firstLoad) {
        var collection = this.getAlbumImagesElement(album);
        album.images.then(function (list) {
            list.forEach(function (item) {
                var imageElement = document.createElement('a');
                imageElement.href = item.picture;
                imageElement.setAttribute('data-lightbox', album.id);
                collection.appendChild(imageElement);
            });
            if (firstLoad && collection.children.length > 0) {
                var firstChild = collection.children[0];
                firstChild.click();
            }
        });
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
            FB.api("/" + _this.config.fbPage + "/albums?fields=created_time,name,id,count,picture{url},link,photos{images}", { access_token: _this.config.accessToken }, function (response) {
                var albums = response.data;
                for (var i = 0; i < albums.length; i++) {
                    albums[i].picture = response.data[i].picture.data.url;
                    albums[i].images = _this.loadAlbumImages(albums[i]);
                }
                resolve(albums);
            });
        });
    };
    AlbumsLoader.prototype.loadAlbumImages = function (album) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            FB.api("/" + album.id + "?fields=photos{images}", { access_token: _this.config.accessToken }, function (response) {
                var result = album.count > 0
                    ? _this.getImagesForAlbum(response.photos.data)
                    : [];
                resolve(result);
            });
        });
    };
    AlbumsLoader.prototype.getImagesForAlbum = function (data) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
            var image = {
                id: data[i].id,
                picture: data[i].images[0].source
            };
            result.push(image);
        }
        return result;
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
