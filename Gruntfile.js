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

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      server: [
      ],
      dist: [
      ]
    },

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
      scripts: {
        files: '<%= jshint.files %>',
        tasks: ['jshint', 'build']
      }
    },

    concat: {
      dist: {
        src: [
          'src/start.js',
          'src/end.js'
        ],
        dest: 'color-picker-ui.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'color-picker-ui.min.js': ['color-picker-ui.js']
        }
      }
    },

    copy: {
      demo: {
        src: 'color-picker-ui.js',
        dest: 'demo/'
      }
    }

  });

  grunt.registerTask('build', [
    'concurrent:dist',
    'concat',
    'uglify',
    'copy:demo'
  ]);


  grunt.registerTask('run', [
    'bower',
    'concurrent:server',
    'watch'
  ]);

  grunt.registerTask('default', 'run');

};