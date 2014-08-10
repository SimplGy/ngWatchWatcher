#LIVERELOAD_PORT = 35729
#lrSnippet = require("connect-livereload")(port: LIVERELOAD_PORT)
#mountFolder = (connect, dir) ->
#  connect.static require("path").resolve(dir)


# # Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
module.exports = (grunt) ->

  # load all grunt tasks
  require("load-grunt-tasks") grunt

  # configurable paths
  cfg =
    app: '.'
    tmp: '.tmp'

  grunt.initConfig
    cfg: cfg

    # grunt-express will serve the files from the folders listed in `bases` on specified `port` and `hostname`
    express:
      app:
        options:
          port: 3001
          hostname: "0.0.0.0"
          bases: [ __dirname ] #  `__dirname` is actually a NodeJS variable storing the path to the folder containing the script accessing it, in this case the Gruntfile.
          livereload: true

    open: app: path: 'http://localhost:<%= express.app.options.port %>'

    watch:
      app:
        options: livereload: true
        files: [
          "<%= cfg.app %>/*.html"
          "<%= cfg.app %>/{,*/}*.css"
          "<%= cfg.app %>/*.js"
          "<%= cfg.app %>/{,*/}*.js"
        ]

    uglify:
      min:
        files: 'ngWatchWatcher.min.js': [
          'ngWatchWatcher/watchWatcher.module.js' # Matches the pattern, but has to be first in source order
          'ngWatchWatcher/*.js'
        ]

    concat:
      noMin:
        files: 'ngWatchWatcher.js': [
          'ngWatchWatcher/watchWatcher.module.js' # Matches the pattern, but has to be first in source order
          'ngWatchWatcher/*.js'
        ]



  # --------------------------------- Server Tasks
  grunt.registerTask "server", [
    "express"
    "open"
#    "express-keepalive"
    'watch'
  ]


  # --------------------------------- Build Tasks

  grunt.registerTask "build", [ "uglify", "concat"]

  grunt.registerTask "default", [ "build", "server" ]
