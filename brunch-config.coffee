exports.config =
  # See http://brunch.io/#documentation for docs.
  conventions:
    assets: /^app\/assets\//
  plugins:
    #off: ['jade-brunch', 'static-jade-brunch']
    babel:
      presets: ['latest', 'react']
    react:
      harmony: yes    # include some es6 transforms
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(vendor|bower_components|node_modules)/
    stylesheets:
      joinTo: {'app.css': /^(vendor|bower_components|node_modules)/}
    #templates:
    #  joinTo: 'app.js'
