'use strict';

module.exports = function(grunt)  //jshint ignore: line
{
    /*** istanbul ***/
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-qunit-istanbul');
    /*** istanbul ***/

    require('load-grunt-tasks')(grunt);  //jshint ignore: line

    grunt.initConfig({

        /*** istanbul ***/
        pkg: grunt.file.readJSON('package.json'),

        qunit : {
            all: ['tests/index.html'],
            options: {
                coverage: {
                  src: ['dist/bodegas.client.js'],
                  instrumentedFiles: 'temp/',
                  htmlReport: 'report/coverage',
                  coberturaReport: 'report/',
                  linesThresholdPct: 20
                }
            }
        },
        /*** istanbul ***/

        concat: {
            js: {
                src: ['src/**/*.js'],
                dest: 'dist/bodegas.client.js',
            },
            css: {
                src : ['css/**/*.css'],
                dest: 'dist/bodegas.client.css',

            }
        },

        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['concat']
            },
            css: {
                files: ['css/**/*.css'],
                tasks: ['concat']
            }
        },

        uglify: {
            my_target: {
                files: {
                    'dist/bodegas.client.js': ['src/**/*.js']
                }
            }
        },

        express : {
            all : {
                options: {
                    port : 9000,
                    hostname : 'localhost',
                    bases : ['.']
                }
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('tests', ['qunit']);
    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('default', ['concat', 'uglify', 'express', 'watch']);
};
