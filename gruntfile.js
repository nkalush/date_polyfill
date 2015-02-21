module.exports = function(grunt) {

  grunt.initConfig({
    jslint: {
      js: {
        src: ['./src/*.js'],
      }
    },
    jshint: {
      options: {
        // enforceall: true,
        browser: true
      },
      src: ['./src/*.js'],
    },
    uglify: {
      options: {
        mangle: false
      },
      js: {
        files: {
          './dist/date_polyfill.min.js': './src/date_polyfill.js',
        }
      }
    },
    sass: {
      distmin: {
        options: {
          style: 'compressed'
        },
        files: {
          './dist/date_polyfill.min.css': './src/date_polyfill.scss'
        }
      },
      distfull: {
        options: {
          style: 'expanded'
        },
        files: {
          './dist/date_polyfill.css': './src/date_polyfill.scss'
        }
      }
    },
    watch: {
      js: {
        files: [
          './src/*.js'
          ],
        tasks: ['jslint', 'jshint', 'uglify:js']
      },
      sass: {
        files: [
          './src/*.scss'
          ],
        tasks: ['sass']
      },
    }
  });

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jslint','jshint', 'uglify']);
}