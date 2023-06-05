const fs = require('fs')
const path = require('path')

// Function to generate a random interval
exports.getRandomInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// Method to return the base directory of the application
exports.baseDir = () => {
    let currentDir = __dirname
    while(!fs.existsSync(path.join(currentDir, 'package.json'))) {
        currentDir = path.join(currentDir, '..')
    }
    return currentDir
}


