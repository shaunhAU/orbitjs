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
          Orbits: false,

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
          "build/orbit.min.js": ["src/math.js", "src/orbits.js", "src/orbits/**/*.js"],
          "build/canvas.min.js": ["src/canvas.js"],
          "build/orbit-full.min.js": ["src/math.js", "src/orbits.js", "src/orbits/**/*.js", "src/canvas.js"]
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

  grunt.registerTask("getsha", function() {
    var done = this.async();
    grunt.util.spawn({cmd: "git", args: ["rev-parse", "HEAD"]}, function(err, stdout, stderr) {
      grunt.config("uglify.options.banner", '/*! orbitjs (https://github.com/shuhaowu/orbitjs) v: ' + stdout.stdout + '*/\n');
      done();
    });
  });
  grunt.registerTask("default", ["jshint", "karma:dev:start", "watch"]);
  grunt.registerTask("prod", ["getsha", "jshint", "uglify:prod", "karma:ci:start"]);
};
