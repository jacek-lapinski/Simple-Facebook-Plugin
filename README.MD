# facebook-simple-gallery 

It is a very simple plugin for displaying facebook gallery on your own website


## Example

[link](http://htmlpreview.github.io/?https://github.com/jacek-lapinski/Facebook-Simple-Gallery/blob/master/src/index.html)


## Getting started

1. Download all files from /dist folder

2. Put links to css files in your html file
    ```html
    <head>
        <link rel="stylesheet" href="../dist/styles/fsg.min.css" />
        <link rel="stylesheet" href="../dist/styles/lightbox.min.css" />
    </head>
    ```

3. Put scripts in your html file
    ```html
    <script src="../dist/scripts/wookmark.min.js"></script>
    <script src="../dist/scripts/fsg.min.js"></script>
    <script src="../dist/scripts/lightbox-plus-jquery.min.js"></script>
    ```

4. Configure your gallery by script
    ```html
    <script>
    facebookGallery({
        appId: '<YOUR FACEBOOK APP ID>',
        accessToken: '<YOUR FACEBOOK APP ID>|<YOUR FACEBOOK APP SECURE>',
        fbPage: '<YOUR FACEBOOK PAGE NAME>',
        elementId: '<HTML ELEMENT ID FOR GALLERY>'
    });
    </script>
    ```

5. Configure wookmark layout
    ```html
    <script>
    facebookGallery({
    appId: '<YOUR FACEBOOK APP ID>',
    accessToken: '<YOUR FACEBOOK APP ID>|<YOUR FACEBOOK APP SECURE>',
    fbPage: '<YOUR FACEBOOK PAGE NAME>',
    elementId: '<HTML ELEMENT ID FOR GALLERY>',
    wookmarkOptions: {
        align: 'center',
        autoResize: false,
        comparator: null,
        container: $('body'),
        direction: undefined,
        ignoreInactiveItems: true,
        itemWidth: 0,
        fillEmptySpace: false,
        flexibleWidth: 0,
        offset: 2,
        onLayoutChanged: undefined,
        outerOffset: 0,
        possibleFilters: [],
        resizeDelay: 50,
        verticalOffset: undefined
        }
    });
    </script>
    ```
    See the wookmark [documentation](http://www.wookmark.com/jquery-plugin) for details on available options.

6. Configure lightbox by script
    ```html
    <script>
    lightbox.option({
    'alwaysShowNavOnTouchDevices': true,
    'albumLabel': 'Image %1 of %2',
    'maxHeight': 500
    })  
    </script>
    ```
    See the lightbox [documentation](http://lokeshdhakar.com/projects/lightbox2/#options) for details on available options.


## Options

appId: string

accessToken: string

fbPage: string

elementId: string

imagesCountLimit: number

includeAlbums: string[ ]

excludeAlbums: string[ ]

wookmarkOptions?: { }


## Dependencies

- [wookmark](https://github.com/germanysbestkeptsecret/Wookmark-jQuery): Javascript plugin for laying out elements of varying heights in a column-based grid. It also contains support for filtering and sorting items. A lot of examples are included showing how to use all the available options.
- [lightbox](https://github.com/lokesh/lightbox2/)
- [jQuery](https://github.com/jquery/jquery)


## Dev Dependencies

- [grunt](https://github.com/gruntjs/grunt): The JavaScript Task Runner
- [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin): Minify CSS
- [grunt-contrib-sass](https://github.com/gruntjs/grunt-contrib-sass): Compile Sass to CSS
- [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify): Minify JavaScript files with UglifyJS
- [grunt-ts](https://github.com/TypeStrong/grunt-ts): Compile and manage your TypeScript project
- [typescript](https://github.com/Microsoft/TypeScript): TypeScript is a language for application scale JavaScript development


## License

ISC


## Contribution

I am waiting for your help :)