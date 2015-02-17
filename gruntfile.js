module.exports = function(grunt) {

  grunt.initConfig({
    jslint: {
      js: {
        src: ['./src/*.js'],
      }
    },
    jshint: {
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
    watch: {
      js: {
        files: [
          './src/*.js'
          ],
        tasks: ['jslint', 'jshint', 'uglify:js']
      },
    }
  });

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jslint','jshint', 'uglify']);
}