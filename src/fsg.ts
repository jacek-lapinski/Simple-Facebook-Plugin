/// <reference path="fbsdk.d.ts" />
/// <reference path="es6-promise.d.ts" />

class FSG {
    constructor(private config: Config) {
        this.setDefaults();
        this.init();
    }

    private setDefaults(): void {
        if (this.config.imagesCountLimit == undefined) {
            this.config.imagesCountLimit = 100;
        }

        if (this.config.includeAlbums) {
            this.convertStringArrayToLowerCase(this.config.includeAlbums);
        }

        if (this.config.excludeAlbums) {
            this.convertStringArrayToLowerCase(this.config.excludeAlbums);
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
        ulElement.setAttribute('data-masonry', '{ "itemSelector": ".fsg-album", "columnWidth": 200 }');
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

        let countWrapperElement = document.createElement('div');
        countWrapperElement.className = 'fsg-album-count-wrapper';

        let countBoxElement = document.createElement('div');
        countBoxElement.className = 'fsg-album-count-box';

        let countElement = document.createElement('span');
        countElement.className = 'fsg-album-count';
        countElement.innerText = album.count.toString();

        countBoxElement.appendChild(countElement);
        countBoxElement.appendChild(document.createElement('br'));
        let textNode = document.createTextNode(album.count == 1 ? "Zdjęcie" : "Zdjęcia");
        countBoxElement.appendChild(textNode);
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

class AlbumsLoader {
    constructor(private config: Config) {
    }

    loadAlbums(): Promise<Album[]> {
        return new Promise<Album[]>((resolve, reject) => {
            FB.api(`/${this.config.fbPage}/albums?limit=100&fields=created_time,name,id,count,picture{url},link,photos{images}`, { access_token: this.config.accessToken }, (response) => {
                let albums: Album[] = response.data;
                let result: Album[] = [];

                if (this.config.excludeAlbums == undefined && this.config.includeAlbums == undefined) {
                    for (let i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0) {
                            albums[i].picture = response.data[i].picture.data.url;
                            albums[i].images = this.loadAlbumImages(albums[i]);
                            result.push(albums[i]);
                        }
                    }
                } else if (this.config.includeAlbums) {
                    for (let i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0 && this.arrayContains(this.config.includeAlbums, albums[i].name)) {
                            albums[i].picture = response.data[i].picture.data.url;
                            albums[i].images = this.loadAlbumImages(albums[i]);
                            result.push(albums[i]);
                        }
                    }
                } else {
                    for (let i = 0; i < albums.length; i++) {
                        if (albums[i].count > 0 && !this.arrayContains(this.config.excludeAlbums, albums[i].name)) {
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
            FB.api(`/${album.id}?fields=photos.limit(100){images}`, { access_token: this.config.accessToken }, (response) => {

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
    imagesCountLimit?: number;
    includeAlbums?: string[];
    excludeAlbums?: string[];
}

let fsg = new FSG({
    appId: '1270801512983487',
    accessToken: '1270801512983487|21c21db8b582aa474f30bea9b73edc0b',
    fbPage: 'kendosopot',
    elementId: 'albums'
});


