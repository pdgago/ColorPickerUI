module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    root: '/',

    // JS
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      files: [
        'Gruntfile.js',
        'src/{,*/}{,*/}{,*/}*.js'
      ]
    },

    clean: ['.tmp', 'dist'],

    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },

    watch: {
      options: {
        spawn: false
      },
      css: {
       files: ['src/dropdown-color-picker-ui.css'],
       tasks: ['htmlConvert', 'build', 'jshint']
      },
      html: {
        files: ['src/templates/*'],
        tasks: ['htmlConvert', 'build', 'jshint']
      },
      scripts: {
        files: '<%= jshint.files %>',
        tasks: ['htmlConvert', 'build', 'jshint']
      }
    },

    concat: {
      dist: {
        src: [
          'src/start.js',
          'bower_components/micro-templating/micro-mustache.js',
          'bower_components/FlexiColorPicker/colorpicker.js',
          '.tmp/templates.js',
          'src/helpers.js',
          'src/dropdown-color-picker-ui.js',
          'src/end.js'
        ],
        dest: 'dist/dropdown-color-picker-ui.js'
      }
    },

    concat_css: {
      options: {},
      dist: {
        files: {
          'dist/dropdown-color-picker-ui.css': [
            'src/dropdown-color-picker-ui.css',
            'bower_components/FlexiColorPicker/themes.css'
          ]
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/dropdown-color-picker-ui.min.js': [
            'dist/dropdown-color-picker-ui.js'
          ]
        }
      }
    },

    copy: {
      demo: {
        files: {
          'demo/dropdown-color-picker-ui.js': ['dist/dropdown-color-picker-ui.js'],
          'demo/dropdown-color-picker-ui.css': ['dist/dropdown-color-picker-ui.css']
        }
      }
    },

    shell: {
      options: {
        stderr: false
      },
      server: {
        command: 'http-server demo/'
      }
    },

    htmlConvert: {
      options: {
        // custom options, see below    
      },
      templates: {
        src: ['src/templates/*.html'],
        dest: '.tmp/templates.js'
      },
    },

  });

  grunt.registerTask('build', [
    'clean',
    'htmlConvert',  
    'concat:dist',
    'concat_css:dist',
    'uglify',
    'copy:demo'
  ]);


  grunt.registerTask('run', [
    'bower',
    'build',
    'watch'
  ]);

  grunt.registerTask('s', [
    'shell:server'
  ]);

  grunt.registerTask('default', 'run');

};