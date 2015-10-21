module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-shell');
  
  grunt.initConfig({

    "shell": {
      mochaTest: {
        command: 'npm run mochaTest'
      }
    }

  });

  // Run all tests once
  grunt.registerTask('test',function (n) {
    grunt.task.run([ 'shell:mochaTest' ] );
  });

};
