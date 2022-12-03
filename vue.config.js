const fs = require('fs')

module.exports = {
    // options...
    devServer: {
        allowedHosts: 'all',
        https: {
            key: fs.readFileSync('../../ssl/panicbot.xyz.key'),
            cert: fs.readFileSync('../../ssl/panicbot_xyz.crt'),
        },
    }
}