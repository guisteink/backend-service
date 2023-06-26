const { readFileSync, existsSync, writeFileSync } = require('fs');
const express = require('express');
const redis = require('redis');

const fibonacciNumber = require('./algorithms/fibonacciNumberRecursive');
const timer = require('./utils/timer');

const app = express();
const port = 8000;
let redisClient;

(async () => {
    redisClient = new redis.createClient();
    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

app.use('/health-check', async(req, res) => {
    console.info(`health-check request received at ${new Date().toISOString()}`);
    res
        .status(200)
        .send({
            "result": "OK"
        });
});

app.use('/', async (req, res) => {
    let result, start, end;
    const { fibonacci } = req.query ?? 0;
    console.info(`fibonnaci ${fibonacci}th request received at ${new Date().toISOString()}`);

    try {
        start = new Date().getTime();

        result = await fibonacciNumber(fibonacci);
        await redisClient.set(fibonacci, JSON.stringify(result));

        end = new Date().getTime();
    } catch (error) {
        console.log(error);
        throw new Error('Failed to calculate fibonacci number', error);
    }

    let timeSpent = timer(start, end);
    console.log(`processing time: ${timeSpent} seconds`);

    res
        .status(200)
        .send({
            result,
            "time": `${timeSpent}`
        });
});

app.listen(port, () => console.log(`\n\n[🔥] Service is now running on ${port}!!!\n`));
