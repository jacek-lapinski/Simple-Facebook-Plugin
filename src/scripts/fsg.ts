

declare class Wookmark {
    constructor(container: string, options: any);
}

class FSG {
    constructor(private config: Config) {
        this.setDefaults();
        this.init();
    }

    private setDefaults(): void {
        this.setGalleryDefaults();
        this.setPostsDefaults();
    }

    private setPostsDefaults(): void {
        if (this.config.postsOptions) {
            if (this.config.postsOptions.wookmarkOptions == undefined) {
                let wookmarkOptions = {
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
    }

    private setGalleryDefaults(): void {
        if (this.config.galleryOptions) {
            if (this.config.galleryOptions.wookmarkOptions == undefined) {
                let wookmarkOptions = {
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
    }

    private convertStringArrayToLowerCase(array: string[]): void {
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].toLocaleLowerCase();
        }
    }

    private init(): void {
        this.initFbScript(document, 'facebook-jssdk');
        this.initFb(window);
    }

    private initFb(window: any): void {
        window.fbAsyncInit = () => {
            FB.init({
                appId: this.config.appId,
                xfbml: true,
                version: 'v2.8'
            });

            if (this.config.postsOptions) {
                this.loadPosts(this.config.postsOptions.elementId);
            }

            if (this.config.galleryOptions) {
                this.loadAlbums(this.config.galleryOptions.elementId);
            }
        };
    }

    private initFbScript(document: Document, id: string): void {
        if (document.getElementById(id)) {
            return;
        }

        let fjs: HTMLScriptElement = <HTMLScriptElement>document.getElementsByTagName('script')[0];
        let js: HTMLScriptElement = document.createElement('script');
        js.id = id;
        js.src = "http://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }

    private loadPosts(elementId: string): void {
        let postsLoader = new PostsLoader(this.config);
        let posts = postsLoader.loadPosts();

        let postsElement = document.getElementById(elementId);
        let ulElement = document.createElement('ul');
        ulElement.className = 'fsg-posts';
        postsElement.appendChild(ulElement);

        posts.then(list => {
            list.forEach(post => {
                let liElement = this.createPostElement(post);
                ulElement.appendChild(liElement);
            })
        });
    }

    private createPostElement(post: Post): HTMLElement {
        let imgElement = document.createElement('img');
        imgElement.src = post.full_picture;
        imgElement.onload = () => this.initWookmark('.fsg-posts', this.config.postsOptions.wookmarkOptions);

        let dateElement = document.createElement('div');
        dateElement.innerText = new Date(post.created_time).toLocaleDateString();
        dateElement.className = 'fsg-post-date';

        let textElement = document.createElement('div');
        textElement.className = 'fsg-post-text';
        textElement.innerText = post.message;

        let postElement = document.createElement('div');
        postElement.appendChild(dateElement);
        postElement.appendChild(imgElement);
        postElement.appendChild(textElement);

        if (post.attachments
            && post.attachments.data
            && post.attachments.data.length > 0
            && (post.attachments.data[0].type == 'share' || post.attachments.data[0].type == 'video_share_youtube')) {
            let linkElement = document.createElement('a');
            linkElement.href = post.attachments.data[0].url;
            linkElement.className = 'fsg-post-link';
            linkElement.innerText = post.attachments.data[0].title;
            postElement.appendChild(linkElement);
        }


        let liElement = document.createElement('li');
        liElement.className = 'fsg-post';
        liElement.appendChild(postElement);

        return liElement;
    }

    private loadAlbums(elementId: string): void {
        let albumsLoader = new AlbumsLoader(this.config);
        let albums = albumsLoader.loadAlbums();

        let albumsElement = document.getElementById(elementId);
        let ulElement = document.createElement('ul');
        ulElement.className = 'fsg-albums';
        albumsElement.appendChild(ulElement);

        albums.then(list => {
            list.forEach(album => {
                let liElement = this.createAlbumElement(album);
                ulElement.appendChild(liElement);
            })
        });
    }

    private initWookmark(element: string, wookmarkOptions: any) {
        var wookmark = new Wookmark(element, wookmarkOptions);
    }

    private createAlbumElement(album: Album): HTMLElement {
        let imgElement = document.createElement('img');
        imgElement.src = album.picture;
        imgElement.onload = () => this.initWookmark('.fsg-albums', this.config.galleryOptions.wookmarkOptions);

        let countWrapperElement = document.createElement('div');
        countWrapperElement.className = 'fsg-album-count-wrapper';

        let countBoxElement = document.createElement('div');
        countBoxElement.className = 'fsg-album-count-box';

        let countElement = document.createElement('div');
        countElement.className = 'fsg-album-count';
        countElement.innerText = album.count > this.config.galleryOptions.imagesCountLimit
            ? this.config.galleryOptions.imagesCountLimit.toString()
            : album.count.toString();

        countBoxElement.appendChild(countElement);
        countWrapperElement.appendChild(countBoxElement);

        let titleElement = document.createElement('div');
        titleElement.className = 'fsg-album-title';
        titleElement.innerText = album.name;

        let albumElement = document.createElement('div');
        albumElement.appendChild(imgElement);
        albumElement.appendChild(countWrapperElement);
        albumElement.appendChild(titleElement);

        let imagesElement = document.createElement('div');
        imagesElement.id = this.getImagesId(album);

        let liElement = document.createElement('li');
        liElement.className = 'fsg-album';
        liElement.appendChild(albumElement);
        liElement.appendChild(imagesElement);

        albumElement.onclick = (ev) => {
            let collection = this.getAlbumImagesElement(album);
            if (collection.childNodes.length == 0) {
                this.loadAlbumImages(album);
            } else {
                this.showAlbum(album);
            }
        };

        return liElement;
    }

    private getAlbumImagesElement(album: Album): HTMLElement {
        let collectionId = this.getImagesId(album);
        let collection = document.getElementById(collectionId);
        return collection;
    }

    private getImagesId(album: Album): string {
        return `images-${album.id}`;
    }

    private getImageId(image: Image): string {
        return `image-${image.id}`;
    }

    private loadAlbumImages(album: Album): void {
        let collection = this.getAlbumImagesElement(album);
        album.images.then(list => {
            list.forEach(item => {
                let imageElement = document.createElement('a');
                imageElement.href = item.picture;
                imageElement.setAttribute('data-lightbox', album.id);

                collection.appendChild(imageElement);
            });
            this.showAlbum(album);
        });
    }

    private showAlbum(album: Album): void {
        let collection = this.getAlbumImagesElement(album);
        if (collection.children.length > 0) {
            let firstChild = collection.children[0] as HTMLElement;
            firstChild.click();
        }
    }
};

class PostsLoader {
    constructor(private config: Config) {
    }

    loadPosts(): Promise<Post[]> {
        return new Promise<Post[]>((resolve, reject) => {
            FB.api(`/${this.config.fbPage}?fields=posts.limit(${this.config.postsOptions.postsCountLimit}){full_picture,created_time,message,id,attachments{type,url,title}}`, { access_token: this.config.accessToken }, (response: any) => {
                let posts: Post[] = response.posts.data;
                let result: Post[] = [];

                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].message) {
                        result.push(posts[i]);
                    }
                }

                resolve(result);
            });
        });
    }
}

class AlbumsLoader {
    constructor(private config: Config) {
    }

    loadAlbums(): Promise<Album[]> {
        return new Promise<Album[]>((resolve, reject) => {
            FB.api(`/${this.config.fbPage}/albums?limit=100&fields=created_time,name,id,count,picture{url},link,photos{images}`, { access_token: this.config.accessToken }, (response: any) => {
                let albums: Album[] = response.data;
                let result: Album[] = [];

                if (this.config.galleryOptions.excludeAlbums == undefined && this.config.galleryOptions.includeAlbums == undefined) {
                    for (let i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0) {
                            albums[i].picture = response.data[i].picture.data.url;
                            albums[i].images = this.loadAlbumImages(albums[i]);
                            result.push(albums[i]);
                        }
                    }
                } else if (this.config.galleryOptions.includeAlbums) {
                    for (let i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0 && this.arrayContains(this.config.galleryOptions.includeAlbums, albums[i].name)) {
                            albums[i].picture = response.data[i].picture.data.url;
                            albums[i].images = this.loadAlbumImages(albums[i]);
                            result.push(albums[i]);
                        }
                    }
                } else {
                    for (let i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0 && !this.arrayContains(this.config.galleryOptions.excludeAlbums, albums[i].name)) {
                            albums[i].picture = response.data[i].picture.data.url;
                            albums[i].images = this.loadAlbumImages(albums[i]);
                            result.push(albums[i]);
                        }
                    }
                }

                resolve(result);
            });
        });
    }

    private arrayContains(array: string[], item: string): boolean {
        return array.indexOf(item.toLowerCase()) >= 0;
    }

    loadAlbumImages(album: Album): Promise<Image[]> {
        return new Promise<Image[]>((resolve, reject) => {
            FB.api(`/${album.id}?fields=photos.limit(100){images}`, { access_token: this.config.accessToken }, (response: any) => {

                let result = album.count > 0
                    ? this.getImagesForAlbum(response.photos.data)
                    : [];

                resolve(result);
            });
        });
    }

    private getImagesForAlbum(data: any): Image[] {
        let result: Image[] = [];

        for (let i = 0; i < data.length; i++) {
            let image: Image = {
                id: data[i].id,
                picture: data[i].images[0].source
            };

            result.push(image);
        }

        return result;
    }

};

interface Image {
    id: string;
    picture: string;
}

interface Post {
    id: string;
    created_time: string;
    full_picture: string;
    message: string;
    attachments: any;
}

interface Album {
    id: string;
    name: string;
    created_time: string;
    picture: string;
    link: string;
    count: number;
    images: Promise<Image[]>;
}

interface Config {
    appId: string;
    accessToken: string;
    fbPage: string;
    galleryOptions?: GalleryOptions;
    postsOptions?: PostsOptions;
}

interface GalleryOptions {
    elementId: string;
    imagesCountLimit?: number;
    includeAlbums?: string[];
    excludeAlbums?: string[];
    wookmarkOptions?: any;
}

interface PostsOptions {
    elementId: string;
    postsCountLimit?: number;
    wookmarkOptions?: any;
}

function facebookGallery(config: Config): void {
    let fsg = new FSG(config);
}
