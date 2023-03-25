const { readFileSync, existsSync } = require('fs');

function loadFile(filepath){
    if(!existsSync(filepath)) return;
    else return JSON.parse(readFileSync(filepath));
}

module.exports = loadFile;
