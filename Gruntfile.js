
(function()
{
    'use strict';

    module.exports = function(grunt)  //jshint ignore: line
    {
        var connect_port = 3001;
        /*** istanbul ***/
        grunt.loadNpmTasks('grunt-contrib-qunit');
        /*** istanbul ***/
        require('load-grunt-tasks')(grunt);  //jshint ignore: line

        grunt.initConfig({

            /*** istanbul ***/
            pkg: grunt.file.readJSON('package.json'),

            qunit : {
                all: {
                    options: {
                        urls: ['http://localhost:'+connect_port+'/tests/index.phantom.html']
                    }
                }

                // options: {
                //     coverage: {
                //       src: ['dist/bodegas.client.js'],
                //       instrumentedFiles: 'temp/',
                //       htmlReport: 'report/coverage',
                //       coberturaReport: 'report/',
                //       linesThresholdPct: 20
                //     }
                // }
            },

            connect: {
                server: {
                    options: {
                        port: connect_port,
                        base: '.'
                    }
                }
            },

            /*** istanbul ***/

            concat: {
                js: {
                    src: [
                        'src/*.js',
                        'src/model/*.js',
                        'src/view/*.js',
                        'src/views/*.js',
                        'src/modules/*.js'
                    ],
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
                        'dist/bodegas.client.min.js': ['dist/bodegas.client.es5.js']
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
            babel: {
                options: {
                    sourceMap: true
                },
                dist: {
                    files: {
                        "dist/bodegas.client.es5.js": "dist/bodegas.client.js"
                    }
                }
            }


        });

        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-express');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-babel');

        grunt.registerTask('tests', ['build', 'connect', 'qunit']);
        grunt.registerTask('build', ['concat', 'babel', 'uglify']);
        grunt.registerTask('default', ['concat', 'express', 'watch']);
    };
})();
