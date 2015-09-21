exports.config =
  # See http://brunch.io/#documentation for docs.
  plugins:
    off: ['jade-brunch', 'static-jade-brunch']
    react:
      transformOptions:
        # options passed through to `react-tools.main.transformWithDetails()` 
        harmony: yes    # include some es6 transforms 
        sourceMap: no   # generate inline source maps 
        stripTypes: no  # strip type annotations 
      # if you use babel to transform jsx, transformOptions would be passed though to `babel.transform()` 
      # See: http://babeljs.io/docs/usage/options/ 
      babel: false
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(vendor|bower_components)/

    stylesheets:
      joinTo: 'app.css'
    #templates:
    #  joinTo: 'app.js'
