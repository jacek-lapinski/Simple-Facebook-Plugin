module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: ["./dist"],

        sass: {
            dist: {
                options: {
                    sourcemap: 'none'
                },
                files: [{
                    expand: true,
                    cwd: './src/styles',
                    src: ['*.scss'],
                    dest: './dist/styles',
                    ext: '.css'
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: './dist/styles',
                    src: ['*.css', '!*.min.css'],
                    dest: './dist/styles',
                    ext: '.min.css'
                }]
            }
        },

        ts: {
            default: {
                tsconfig: true
            }
        },

        uglify: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: './dist/scripts',
                    src: ['*.js', '!*.min.js'],
                    dest: './dist/scripts',
                    ext: '.min.js'
                }]
            }
        },

        copy: {
            js: {
                files: [{ 
                        expand: true, 
                        flatten: true,
                        src: ['./src/scripts/*.js'], 
                        dest: './dist/scripts', 
                        filter: 'isFile' 
                }],
            },
            css: {
                files: [{ 
                        expand: true, 
                        flatten: true,
                        src: ['./src/styles/*.css'], 
                        dest: './dist/styles', 
                        filter: 'isFile' 
                }],
            },
            images: {
                files: [{ 
                        expand: true, 
                        flatten: true,
                        src: ['./src/images/*'], 
                        dest: './dist/images', 
                        filter: 'isFile' 
                }],
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('build', [
        'clean', 'ts', 'copy:js', 'copy:css', 'copy:images', 'uglify', 'sass', 'cssmin'
    ]);

    grunt.registerTask('default', ['build']);
};