module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: './src/styles',
                    src: ['*.scss'],
                    dest: './build/styles',
                    ext: '.css'
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: './build/styles',
                    src: ['*.css', '!*.min.css'],
                    dest: './build/styles',
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
                    cwd: 'src/js',
                    src: '**/*.js',
                    dest: 'dest/js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask('build', [
        'ts', 'sass'
    ]);

    grunt.registerTask('default', ['build']);
};