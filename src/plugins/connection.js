/**
 * Install plugin
 * @param app
 * @param connection
 */
 function plugin(app, connection) {
    if (plugin.installed) {
      return
    }
  
    if (!connection) {
      console.error('You have to install connection')
      return
    }
  
    plugin.installed = true
  
    if (app.version && app.version.split('.')[0] < 3) {
      Object.defineProperties(app.prototype, {
  
        connection: {
          get: function get() {
            return connection
          }
        }
      })
    } else if (app.version && app.version.split('.')[0] >= 3) {
      app.config.globalProperties.connection = connection
    } else {
      console.error('Unknown Vue version')
      return
    }
  
    app.connection = connection
  }
  
  if (typeof exports == "object") {
    module.exports = plugin
  } else if (typeof define == "function" && define.amd) {
    define([], function () { return plugin })
  } 
  
  export default plugin