const { readFileSync, existsSync, writeFileSync } = require('fs');

function loadFileMemory(){
    let total = 0,
        success = 0,
        media_processing_time = 0;

    if (!existsSync('./total-reqs.json')) {
        writeFileSync('./total-reqs.json', JSON.stringify({ total, success, media_processing_time }));
    } else {
        const lastRunStr = readFileSync('./total-reqs.json');
        const lastRun = JSON.parse(lastRunStr);
        total+= lastRun.total;
        success += lastRun.success;
        media_processing_time = lastRun.media_processing_time;
    }

    return { total, success, media_processing_time };
}

module.exports = loadFileMemory;
