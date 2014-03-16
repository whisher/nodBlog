module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        // This line makes your node configurations available for use
        pkg: grunt.file.readJSON('package.json'),
        banner:
            '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
            ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        src: {
            jshint: ['src/**/*.js'],
            jsModules: {
                app: ['src/app/default/**/*.js'],
                admin: ['src/app/admin/**/*.js'],
                login:  ['src/app/login/**/*.js'],
                common: ['src/common/**/*.js']
            },
            tpl: {
                app: ['src/app/default/**/*.tpl.html'],
                admin: ['src/app/admin/**/*.tpl.html'],
                login:  ['src/app/login/**/*.tpl.html'],
                common: ['src/common/**/*.tpl.html']
            }
        },
        html2js: {
            options: { useStrict: true },
            app: {
                options: {
                    //base: 'src/app/default'
                    process: function(src, filepath) {
          console.log(src, filepath);
        }
                },
                src: ['<%= src.tpl.app %>'],
                dest: '<%= distdir %>/templates/app.js',
                module: 'templates.app'
            },
            login: {
                /*options: {
                    base: 'src/app/login'
                },*/
                src: ['<%= src.tpl.login %>'],
                dest: '<%= distdir %>/templates/login.js',
                module: 'templates.login'
            },
            admin: {
                /*options: {
                    base: 'src/app/admin'
                },*/
                src: ['<%= src.tpl.admin %>'],
                dest: '<%= distdir %>/templates/admin.js',
                module: 'templates.admin'
            },
            common: {
                /*options: {
                    base: 'src/common'
                },*/
                src: ['<%= src.tpl.common %>'],
                dest: '<%= distdir %>/templates/common.js',
                module: 'templates.common'
            }
        },
        clean: ['<%= distdir %>/*'],
        concat:{
            app:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.jsModules.app %>','<%= distdir %>/templates/app.js'],
                dest:'<%= distdir %>/default/<%= pkg.name %>.js'
            },
            admin:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.jsModules.admin %>','<%= distdir %>/templates/admin.js'],
                dest:'<%= distdir %>/admin/<%= pkg.name %>.js'
            },
            login:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.jsModules.login %>','<%= distdir %>/templates/login.js'],
                dest:'<%= distdir %>/login/<%= pkg.name %>.js'
            },
            angular: {
                src:[
                    'vendor/angular/angular.js',
                    'vendor/angular-local-storage/angular-local-storage.js',
                    'vendor/angular-sanitize/angular-sanitize.js',
                    'vendor/angular-ui-router/release/angular-ui-router.js',
                    'vendor/restangular/dist/restangular.js'],
                dest: '<%= distdir %>/angular.js'
            },
            
            bootstrap: {
                src:['vendor/angular-bootstrap/ui-bootstrap-tpls.js'],
                dest: '<%= distdir %>/ui-bootstrap.js'
            },
            jquery: {
                src:['vendor/jquery/*.js'],
                dest: '<%= distdir %>/jquery.js'
            }
        },
        ngmin: {
            dist: {
                src: ['<%= distdir %>/<%= pkg.name %>.js'],
                dest: '<%= distdir %>/<%= pkg.name %>-ngmin.js'
            }
        },
        copy: {
            build: {
              cwd: 'src',
              src: [ '**' ],
              dest: '<%= distdir %>',
              expand: true
            }
        },
        jshint: {
           options:{
                newcap:false,
                globals: {
                    jQuery: false
                }
           }, 
           myFiles: ['gruntFile.js', '<%= src.jshint %>']
       }
    });
   
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-ngmin');
    
    grunt.registerTask('default', ['jshint','build']);
    grunt.registerTask('build', ['clean','html2js','concat'/*,'ngmin'*/]);
};

