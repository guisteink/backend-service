const { readFileSync, existsSync, writeFileSync } = require('fs');
const express = require('express')

const fibonacciNumber = require('./helpers/fibonacciNumberRecursive');
const timer = require('./helpers/timer');

const app = express()
const port = 8000;

// TODO: add var env to linux ec2 instance
// const server = env.SERVER;
// app.use('/server', async(req, res) => {
//     res
//         .status(200)
//         .send({
//             "result": server
//         });
// });

app.use('/health-check', async(req, res) => {
    console.info(`health-check request received at ${new Date().toISOString()}`);
    return res
        .status(200)
        .send({
            "result": "OK"
        });
});

app.use('/', async (req, res) => {
    const { fibonacci } = req.query ?? 0;
    console.info(`fibonnaci request received at ${new Date().toISOString()}`);

    let start = new Date().getTime();
    let result = await fibonacciNumber(fibonacci)
    let end = new Date().getTime();

    let timeSpent = timer(start, end);
    console.log(`processing time: ${timeSpent} seconds`);

    let processingTime = 0, success = 0;
    if (!existsSync('./processing-time.json')) {
        writeFileSync('./processing-time.json', JSON.stringify({ processingTime, success }));
    } else {
        const lastRunStr = readFileSync('./processing-time.json');
        const lastRun = JSON.parse(lastRunStr);
        processingTime += lastRun.processingTime;
        success += lastRun.success;

        processingTime = processingTime + timeSpent;
        success += 1;
        writeFileSync('./processing-time.json', JSON.stringify({ processingTime, success }));
    }

    return res.json({
        "result": `The result for the ${fibonacci}th fibonacci number is: ${result}`,
        "processing_time": `${timeSpent} seconds`
    });
});

app.listen(port, () => console.log(`[🔥] Service is now running on ${port}!!!\n`));
