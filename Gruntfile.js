/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 * 
 */

module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['Gruntfile.js',
                'app.js',
                'bin/**/*.js',
                'diglias/**/*.js',
                'lab/**/*.js',
                'routes/**/*.js',
                'www/**/*.js'
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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('lint', ['Run JSHint on all source and test files'], 'jshint');

    grunt.registerTask('default', ['lint']);
};