"use strict";

module.exports = function(grunt) {
  var ALL_OUR_JS_SOURCES = ["src/**/*.js", "tests/**/*.js"];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      files: ALL_OUR_JS_SOURCES.concat(["Gruntfile.js"]),
      options: {
        browser: true,
        globalstrict: true,
        sub: true,
        expr: true,
        boss: true,
        globals: {
          module: false,
          console: false,
          $: false,

          math: false,
          Orbit: false,

          // jasmine stuff
          describe: false,
          expect: false,
          it: false,
          beforeEach: false,
          jasmine: false,
        }
      }
    },
    karma: {
      dev: {
        configFile: "test.conf.js",
        background: true,
        autoWatch: false,
      },
      ci: {
        configFile: "ci-test.conf.js"
      }
    },
    uglify: {
      prod: {
        files: {
          "build/orbit.min.js": ["src/math.js", "src/orbit.js"],
          "build/canvas.min.js": ["src/canvas.js"]
        },
      }
    },
    watch: {
      jswatch: {
        files: ALL_OUR_JS_SOURCES.concat("Gruntfile.js"),
        tasks: ["jshint", "karma:dev:run"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-karma");

  grunt.registerTask("default", ["jshint", "karma:dev:start", "watch"]);
  grunt.registerTask("prod", ["jshint", "uglify:prod", "karma:ci:start"]);
};
