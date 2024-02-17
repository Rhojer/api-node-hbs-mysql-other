const timeago = require('timeago.js')

const helpers = {}
helpers.timeago = (timestamp) =>{
    return timeago.format(timestamp)
}

module.exports = helpers