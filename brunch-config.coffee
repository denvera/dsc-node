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
      #transformOptions:
        # options passed through to `react-tools.main.transformWithDetails()`
        #sourceMap: no   # generate inline source maps
        #stripTypes: no  # strip type annotations
      # if you use babel to transform jsx, transformOptions would be passed though to `babel.transform()`
      # See: http://babeljs.io/docs/usage/options/
      #babel: false
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(vendor|bower_components|node_modules)/
      order:
        before: [
          'bower_components/react-bootstrap/react-bootstrap.js'
        ]
    stylesheets:
      #joinTo: 'app.css'
      joinTo: {'app.css': /^(vendor|bower_components|node_modules)/}
    #templates:
    #  joinTo: 'app.js'
