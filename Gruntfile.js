'use strict';

module.exports = function(grunt)  //jshint ignore: line
{
    require('load-grunt-tasks')(grunt);  //jshint ignore: line

    grunt.initConfig({
        concurrent : 
        {
            serve : [ 'serve', 'watch' ],
            options: {
                logConcurrentOutput: true
            }
        },
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
                    'dist/bodegas.client.min.js': ['src/**/*.js']
                }
            }
        },

        serve: {
            options: {
                port: 9000
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-serve');

    grunt.registerTask('default', ['concat', 'uglify', 'concurrent:serve']);
};