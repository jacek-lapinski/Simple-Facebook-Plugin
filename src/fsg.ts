/// <reference path="fbsdk.d.ts" />
/// <reference path="es6-promise.d.ts" />

class FSG {
    constructor(private config: Config) {
        this.init();
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

            this.loadAlbums(this.config.elementId);
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

    private createAlbumElement(album: Album): HTMLElement {
        let imgElement = document.createElement('img');
        album.cover_photo_url.then((url) => imgElement.src = url);

        let titleElement = document.createElement('div');
        titleElement.className = 'fsg-album-title';
        titleElement.innerText = album.name;

        let liElement = document.createElement('li');
        liElement.appendChild(imgElement);
        liElement.appendChild(titleElement);

        return liElement;
    }
};

class AlbumsLoader {
    constructor(private config: Config) {
    }

    loadAlbums(): Promise<Album[]> {
        return new Promise<Album[]>((resolve, reject) => {
            FB.api('/' + this.config.fbPage + '/albums', { access_token: this.config.accessToken }, (response) => {
                let albums: Album[] = response.data;
                albums.forEach(album => {
                    album.cover_photo_url = this.loadAlbumCoverPicture(album);
                });
                resolve(albums);
            });
        });
    }

    private loadAlbumCoverPicture(album: Album): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            FB.api('/' + album.id + '/picture', { access_token: this.config.accessToken }, (response) => {
                resolve(response.data.url);
            });
        });
    }
};

interface Album {
    id: string;
    name: string;
    created_time: Date;
    cover_photo_url: Promise<string>;
}

interface Config {
    appId: string;
    accessToken: string;
    fbPage: string;
    elementId: string;
}

let fsg = new FSG({
    appId: '1270801512983487',
    accessToken: '1270801512983487|21c21db8b582aa474f30bea9b73edc0b',
    fbPage: 'kendosopot',
    elementId: 'albums'
});

