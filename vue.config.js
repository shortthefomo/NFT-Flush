const fs = require('fs')

module.exports = {
    // options...
    devServer: {
        allowedHosts: 'all',
        https: {
            key: fs.readFileSync('/home/lathan/ssl/panicbot.xyz.key'),
            cert: fs.readFileSync('/home/lathan/ssl/panicbot_xyz.crt'),
        },
    }
}