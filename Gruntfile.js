'use strict';

var  _ = require('lodash');

var paths = {
    js: ['Gruntfile.js','public/**/*.js','!public/system/lib/**'],
    html: ['public/**/views/**/*.html', 'server/views/**/*.html'],
    css: ['public/**/css/**/*.css', '!public/system/lib/**']
};



module.exports = function(grunt) {
    function getLoginAssets(){
        var scripts = {};
        var assets = grunt.file.readJSON('server/config/assets.json');
        _.each(['admin', 'app', 'login'], function (module,index){
            scripts[module] = {};
            _.each(assets[module], function (current, type) {
                scripts[module][type] = {};
                _.each(current, function (value, key) {
                    if (_.isString(key)) {
                        var regex = new RegExp('^(http://|https://|//)');
                        if (!regex.test(key)) {
                            scripts[module][type][key] = {};
                            scripts[module][type][key] = current[key];
                            //scripts[module][type][key].push(current[key]);
                        }
                    }
                });
            });
        });
        return scripts;
    }
    
    // Project configuration.
    grunt.initConfig({
        
        // This line makes your node configurations available for use
        pkg: grunt.file.readJSON('package.json'),
        assets:getLoginAssets(),
        banner:
        '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
        ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        dist: 'public/build',
        lib: 'public/system/lib',
        modulesDev:{
            admin:'public/admin',
            app:'public/default',
            login:'public/login'
        },
        modulesDist:{
            admin:'<%= dist %>/admin',
            app:'<%= dist %>/default',
            login:'<%= dist %>/login'
        },
        jshint: {
            all: {
                src: paths.js,
                options: {
                    jshintrc: true
                }
            }
        },
        clean: ['<%= dist %>/*','<%= modulesDev.app %>/assets/css','<%= modulesDev.app %>/assets/fonts','<%= modulesDev.admin %>/assets/css','<%= modulesDev.admin %>/assets/fonts','<%= modulesDev.login %>/assets/css','<%= modulesDev.login %>/assets/fonts'],
        concat:{
            adminCss:{
                options: {
                    banner: '<%= banner %>'
                },
                files: '<%= assets.admin.css %>',
                nonull: true
            },
            adminJs:{
                options: {
                    banner: '<%= banner %>'
                },
                files: '<%= assets.admin.js %>',
                nonull: true
            },
            appCss:{
                options: {
                    banner: '<%= banner %>'
                },
                files: '<%= assets.app.css %>',
                nonull: true
            },
            appJs:{
                options: {
                    banner: '<%= banner %>'
                },
                files: '<%= assets.app.js %>',
                nonull: true
            },
            loginCss:{
                options: {
                    banner: '<%= banner %>'
                },
                files: '<%= assets.login.css %>',
                nonull: true
            },
            loginJs:{
                options: {
                    banner: '<%= banner %>'
                },
                files: '<%= assets.login.js %>',
                nonull: true
            }
        },
        copy: {
            fontsAdmin: {
                cwd: '<%= lib %>/bootstrap/fonts/',
                src: '*',
                dest: '<%=  modulesDev.admin %>/assets/fonts',
                expand: true
            },
            fontsApp: {
                cwd: '<%= lib %>/bootstrap/fonts/',
                src: '*',
                dest: '<%=  modulesDev.app %>/assets/fonts',
                expand: true
            },
            fontsLogin: {
                cwd: '<%= lib %>/bootstrap/fonts/',
                src: '*',
                dest: '<%=  modulesDev.login %>/assets/fonts',
                expand: true
            },
            assetsAdmin: {
                cwd: '<%= modulesDev.admin %>/assets/',
                src: ['**'],
                dest: '<%=  modulesDist.admin %>/assets',
                expand: true
            },
            assetsApp: {
                cwd: '<%= modulesDev.app %>/assets/',
                src: ['**'],
                dest: '<%=  modulesDist.app %>/assets',
                expand: true
            },
            assetsLogin: {
                cwd: '<%= modulesDev.login %>/assets/',
                src: ['**'],
                dest: '<%=  modulesDist.login %>/assets',
                expand: true
            }
        },
        less: {
            bootstrapApp: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'bootstrap.css.map',
                    sourceMapFilename: '<%= modulesDev.app %>/assets/css/bootstrap.css.map'
                },
                files: {
                    '<%= modulesDev.app %>/assets/css/bootstrap.css': '<%= modulesDev.app %>/less/bootstrap.less'
                }
            },
            compileThemeApp: {
                options: {
                    banner: '<%= banner %>',
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'theme.css.map',
                    sourceMapFilename: '<%= modulesDev.app %>/assets/css/theme.css.map'
                },
                files: {
                    '<%= modulesDev.app %>/assets/css/theme.css': '<%= modulesDev.app %>/less/theme.less'
                }
            },
            bootstrapAdmin: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'bootstrap.css.map',
                    sourceMapFilename: '<%= modulesDev.admin %>/assets/css/bootstrap.css.map'
                },
                files: {
                    '<%= modulesDev.admin %>/assets/css/bootstrap.css': '<%= modulesDev.admin %>/less/bootstrap.less'
                }
            },
            compileThemeAdmin: {
                options: {
                    banner: '<%= banner %>',
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'theme.css.map',
                    sourceMapFilename: '<%= modulesDev.admin %>/assets/css/theme.css.map'
                },
                files: {
                    '<%= modulesDev.admin %>/assets/css/theme.css': '<%= modulesDev.admin %>/less/theme.less'
                }
            },
            bootstrapLogin: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'bootstrap.css.map',
                    sourceMapFilename: '<%= modulesDev.login %>/assets/css/bootstrap.css.map'
                },
                files: {
                    '<%= modulesDev.login %>/assets/css/bootstrap.css': '<%= modulesDev.login %>/less/bootstrap.less'
                }
            },
            compileThemeLogin: {
                options: {
                    banner: '<%= banner %>',
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'theme.css.map',
                    sourceMapFilename: '<%= modulesDev.login %>/assets/css/theme.css.map'
                },
                files: {
                    '<%= modulesDev.login %>/assets/css/theme.css': '<%= modulesDev.login %>/less/theme.less'
                }
            }
        }
    });
    //console.log(grunt.config('assets').login.js);
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    //grunt.registerTask('default', ['jshint','clean','less','copy','concat']);
    grunt.registerTask('default', ['jshint','clean','less','copy','concat']);
};

