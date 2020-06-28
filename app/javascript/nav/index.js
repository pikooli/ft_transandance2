// Load all the files within this directory and all subdirectories.
// Files must be named *.js.


const channels = require.context('.', true, /\.js$/)
channels.keys().forEach(channels)

