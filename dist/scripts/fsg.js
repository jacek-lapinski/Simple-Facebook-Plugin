var FSG = (function () {
    function FSG(config) {
        this.config = config;
        this.setDefaults();
        this.init();
    }
    FSG.prototype.setDefaults = function () {
        this.setGalleryDefaults();
        this.setPostsDefaults();
    };
    FSG.prototype.setPostsDefaults = function () {
        if (this.config.postsOptions) {
            if (this.config.postsOptions.wookmarkOptions == undefined) {
                var wookmarkOptions = {
                    autoResize: true,
                    offset: 50,
                    itemWidth: 250,
                    flexibleWidth: 400,
                    outerOffset: 50
                };
                this.config.postsOptions.wookmarkOptions = wookmarkOptions;
            }
            if (this.config.postsOptions.postsCountLimit == undefined) {
                this.config.postsOptions.postsCountLimit = 100;
            }
        }
    };
    FSG.prototype.setGalleryDefaults = function () {
        if (this.config.galleryOptions) {
            if (this.config.galleryOptions.wookmarkOptions == undefined) {
                var wookmarkOptions = {
                    autoResize: true,
                    offset: 10,
                    itemWidth: 200,
                    flexibleWidth: 400,
                    outerOffset: 10
                };
                this.config.galleryOptions.wookmarkOptions = wookmarkOptions;
            }
            if (this.config.galleryOptions.imagesCountLimit == undefined) {
                this.config.galleryOptions.imagesCountLimit = 100;
            }
            if (this.config.galleryOptions.includeAlbums) {
                this.convertStringArrayToLowerCase(this.config.galleryOptions.includeAlbums);
            }
            if (this.config.galleryOptions.excludeAlbums) {
                this.convertStringArrayToLowerCase(this.config.galleryOptions.excludeAlbums);
            }
        }
    };
    FSG.prototype.convertStringArrayToLowerCase = function (array) {
        for (var i = 0; i < array.length; i++) {
            array[i] = array[i].toLocaleLowerCase();
        }
    };
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
            if (_this.config.postsOptions) {
                _this.loadPosts(_this.config.postsOptions.elementId);
            }
            if (_this.config.galleryOptions) {
                _this.loadAlbums(_this.config.galleryOptions.elementId);
            }
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
    FSG.prototype.loadPosts = function (elementId) {
        var _this = this;
        var postsLoader = new PostsLoader(this.config);
        var posts = postsLoader.loadPosts();
        var postsElement = document.getElementById(elementId);
        var ulElement = document.createElement('ul');
        ulElement.className = 'fsg-posts';
        postsElement.appendChild(ulElement);
        posts.then(function (list) {
            list.forEach(function (post) {
                var liElement = _this.createPostElement(post);
                ulElement.appendChild(liElement);
            });
        });
    };
    FSG.prototype.createPostElement = function (post) {
        var _this = this;
        var imgElement = document.createElement('img');
        imgElement.src = post.full_picture;
        imgElement.onload = function () { return _this.initWookmark('.fsg-posts', _this.config.postsOptions.wookmarkOptions); };
        var dateElement = document.createElement('div');
        dateElement.innerText = new Date(post.created_time).toLocaleDateString();
        dateElement.className = 'fsg-post-date';
        var textElement = document.createElement('div');
        textElement.className = 'fsg-post-text';
        textElement.innerText = post.message;
        var postElement = document.createElement('div');
        postElement.appendChild(imgElement);
        postElement.appendChild(dateElement);
        postElement.appendChild(textElement);
        if (post.attachments
            && post.attachments.data
            && post.attachments.data.length > 0
            && (post.attachments.data[0].type == 'share' || post.attachments.data[0].type == 'video_share_youtube')) {
            var linkElement = document.createElement('a');
            linkElement.href = post.attachments.data[0].url;
            linkElement.className = 'fsg-post-link';
            linkElement.innerText = post.attachments.data[0].title;
            postElement.appendChild(linkElement);
        }
        var liElement = document.createElement('li');
        liElement.className = 'fsg-post';
        liElement.appendChild(postElement);
        return liElement;
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
    FSG.prototype.initWookmark = function (element, wookmarkOptions) {
        var wookmark = new Wookmark(element, wookmarkOptions);
    };
    FSG.prototype.createAlbumElement = function (album) {
        var _this = this;
        var imgElement = document.createElement('img');
        imgElement.src = album.picture;
        imgElement.onload = function () { return _this.initWookmark('.fsg-albums', _this.config.galleryOptions.wookmarkOptions); };
        var countWrapperElement = document.createElement('div');
        countWrapperElement.className = 'fsg-album-count-wrapper';
        var countBoxElement = document.createElement('div');
        countBoxElement.className = 'fsg-album-count-box';
        var countElement = document.createElement('div');
        countElement.className = 'fsg-album-count';
        countElement.innerText = album.count > this.config.galleryOptions.imagesCountLimit
            ? this.config.galleryOptions.imagesCountLimit.toString()
            : album.count.toString();
        countBoxElement.appendChild(countElement);
        countWrapperElement.appendChild(countBoxElement);
        var titleElement = document.createElement('div');
        titleElement.className = 'fsg-album-title';
        titleElement.innerText = album.name;
        var albumElement = document.createElement('div');
        albumElement.appendChild(imgElement);
        albumElement.appendChild(countWrapperElement);
        albumElement.appendChild(titleElement);
        var imagesElement = document.createElement('div');
        imagesElement.id = this.getImagesId(album);
        var liElement = document.createElement('li');
        liElement.className = 'fsg-album';
        liElement.appendChild(albumElement);
        liElement.appendChild(imagesElement);
        albumElement.onclick = function (ev) {
            var collection = _this.getAlbumImagesElement(album);
            if (collection.childNodes.length == 0) {
                _this.loadAlbumImages(album);
            }
            else {
                _this.showAlbum(album);
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
    FSG.prototype.loadAlbumImages = function (album) {
        var _this = this;
        var collection = this.getAlbumImagesElement(album);
        album.images.then(function (list) {
            list.forEach(function (item) {
                var imageElement = document.createElement('a');
                imageElement.href = item.picture;
                imageElement.setAttribute('data-lightbox', album.id);
                collection.appendChild(imageElement);
            });
            _this.showAlbum(album);
        });
    };
    FSG.prototype.showAlbum = function (album) {
        var collection = this.getAlbumImagesElement(album);
        if (collection.children.length > 0) {
            var firstChild = collection.children[0];
            firstChild.click();
        }
    };
    return FSG;
}());
;
var PostsLoader = (function () {
    function PostsLoader(config) {
        this.config = config;
    }
    PostsLoader.prototype.loadPosts = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            FB.api("/" + _this.config.fbPage + "?fields=posts.limit(" + _this.config.postsOptions.postsCountLimit + "){full_picture,created_time,message,id,attachments{type,url,title}}", { access_token: _this.config.accessToken }, function (response) {
                var posts = response.posts.data;
                var result = [];
                for (var i = 0; i < posts.length; i++) {
                    if (posts[i].message) {
                        result.push(posts[i]);
                    }
                }
                resolve(result);
            });
        });
    };
    return PostsLoader;
}());
var AlbumsLoader = (function () {
    function AlbumsLoader(config) {
        this.config = config;
    }
    AlbumsLoader.prototype.loadAlbums = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            FB.api("/" + _this.config.fbPage + "/albums?limit=100&fields=created_time,name,id,count,picture{url},link,photos{images}", { access_token: _this.config.accessToken }, function (response) {
                var albums = response.data;
                var result = [];
                if (_this.config.galleryOptions.excludeAlbums == undefined && _this.config.galleryOptions.includeAlbums == undefined) {
                    for (var i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0) {
                            albums[i].picture = response.data[i].picture.data.url;
                            albums[i].images = _this.loadAlbumImages(albums[i]);
                            result.push(albums[i]);
                        }
                    }
                }
                else if (_this.config.galleryOptions.includeAlbums) {
                    for (var i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0 && _this.arrayContains(_this.config.galleryOptions.includeAlbums, albums[i].name)) {
                            albums[i].picture = response.data[i].picture.data.url;
                            albums[i].images = _this.loadAlbumImages(albums[i]);
                            result.push(albums[i]);
                        }
                    }
                }
                else {
                    for (var i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0 && !_this.arrayContains(_this.config.galleryOptions.excludeAlbums, albums[i].name)) {
                            albums[i].picture = response.data[i].picture.data.url;
                            albums[i].images = _this.loadAlbumImages(albums[i]);
                            result.push(albums[i]);
                        }
                    }
                }
                resolve(result);
            });
        });
    };
    AlbumsLoader.prototype.arrayContains = function (array, item) {
        return array.indexOf(item.toLowerCase()) >= 0;
    };
    AlbumsLoader.prototype.loadAlbumImages = function (album) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            FB.api("/" + album.id + "?fields=photos.limit(100){images}", { access_token: _this.config.accessToken }, function (response) {
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
function facebookGallery(config) {
    var fsg = new FSG(config);
}
