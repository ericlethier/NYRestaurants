module.exports = function(grunt) {
grunt.initConfig({
  watch: {
    options: {
      livereload: 35729
      },
    elements: {
      files: ['**/*.css','**/*.js', '**/*.jade']
    },
  },
});
  grunt.registerTask('default', ['watch']);

  grunt.loadNpmTasks('grunt-contrib-watch');
};
