exports.config =
  # See http://brunch.io/#documentation for docs.
  conventions:
    assets: /^app\/assets\//
  plugins:
    babel:
      plugins: ['transform-class-properties']
      presets: ['env', 'react']
    react:
      harmony: yes    # include some es6 transforms
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(vendor|node_modules)/
    stylesheets:
      joinTo:
        'app.css': /^(app\/styles|vendor|node_modules)/
