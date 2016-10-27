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
        imgElement.src = album.picture;

        let titleElement = document.createElement('div');
        titleElement.className = 'fsg-album-title';
        titleElement.innerText = album.name;

        let albumElement = document.createElement('div');
        albumElement.appendChild(imgElement);
        albumElement.appendChild(titleElement);

        let imagesElement = document.createElement('div');
        imagesElement.id = this.getImagesId(album);

        let liElement = document.createElement('li');
        liElement.appendChild(albumElement);
        liElement.appendChild(imagesElement);

        albumElement.onclick = (ev) => {
            this.loadAlbumImages(album);
        };

        return liElement;
    }

    private getImagesId(album: Album): string {
        return `images-${album.id}`;
    }

    private loadAlbumImages(album: Album): void {
        let collectionId = this.getImagesId(album);
        let collection = document.getElementById(collectionId);
        album.images.then(list => {
            list.forEach(item => {
                let imageElement = document.createElement('div');
                imageElement.innerText = item.picture;
                collection.appendChild(imageElement);
            });
        });
    }
};

class AlbumsLoader {
    constructor(private config: Config) {
    }

    loadAlbums(): Promise<Album[]> {
        return new Promise<Album[]>((resolve, reject) => {
            FB.api(`/${this.config.fbPage}/albums?fields=created_time,name,id,count,picture{url},link,photos{images}`, { access_token: this.config.accessToken }, (response) => {
                let albums: Album[] = response.data;
                for(let i=0; i<albums.length; i++){
                    albums[i].picture = response.data[i].picture.data.url;
                    albums[i].images = this.loadAlbumImages(albums[i]);
                }
                resolve(albums);
            });
        });
    }

    loadAlbumImages(album: Album): Promise<Image[]>{
        return new Promise<Image[]>((resolve, reject) => {
            FB.api(`/${album.id}?fields=photos{images}`, { access_token: this.config.accessToken }, (response) => {

                let result = album.count > 0
                    ? this.getImagesForAlbum(response.photos.data)
                    : [];

                resolve(result);
            });
        });
    }

    private getImagesForAlbum(data: any): Image[]{
        let result: Image[] = [];

        for(let i=0; i<data.length; i++){
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

interface Album {
    id: string;
    name: string;
    created_time: Date;
    picture: string;
    link: string;
    count: number;
    images: Promise<Image[]>;
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

