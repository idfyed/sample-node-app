/**
 * Copyright 2017 (C) Diglias AB
 *
 * @author jonas
 * 
 */

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['Gruntfile.js',
                'src/**/*.js',
                'eapi-client/src/**/*.js',
                'eapi-client/test/**/*.js',
            ],
            options: {
                node: true,
                globals: {
                    /* MOCHA */
                    after: false,
                    afterEach: false,
                    before: false,
                    beforeEach: false,
                    describe: false,
                    it: false
                }
            }
        },


        watch: {
            scripts: {
                files: '**/*.js',
                tasks: ['jshint'],
                options: {
                    interrupt: true,
                    spawn: false
                }
            }
        },


        copy: {
            zip: {
                files: [
                    { expand: true, src: ['eapi-client/*.tgz'], dest: 'diglias-node-sample-app/' },
                    { expand: true, src: ['src/**/*'], dest: 'diglias-node-sample-app/' },
                    {
                        expand: true,
                        src: [
                            '.dockerignore',
                            'docker-compose.yml',
                            'Dockerfile',
                            'package.json',
                            'README.md'
                        ],
                        dest: 'diglias-node-sample-app/'
                    },

                ],
            },
        },

        compress: {
            zip: {
                options: {
                    archive: 'diglias-node-sample-app.zip'
                },
                files: [
                    { src: ['diglias-node-sample-app/**'], dest: '/' },
                ]
            }
        },

        clean: {
            zip: ['diglias-node-sample-app'],
            all: [
                'node_modules',
                'eapi-client/node_modules',
                'diglias-node-sample-app.zip'
                ],
        },


    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('lint', ['Run JSHint on all source and test files'], 'jshint');

    grunt.registerTask('default', ['lint']);
    grunt.registerTask('dist', ['copy:zip', 'compress:zip', 'clean:zip']);
};