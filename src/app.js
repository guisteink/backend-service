const express = require('express');

const fibonacciNumber = require('./algorithms/fibonacciNumberRecursive');
const timer = require('./utils/timer');

const app = express();
const port = 3000;

app.use('/health-check', async(req, res) => {
    console.info(`\nhealth-check request received at ${new Date().toISOString()}`);
    res
        .status(200)
        .send({
            "result": "OK"
        });
});

app.use('/', async (req, res) => {
    let result, start, end, now;
    now = new Date().toISOString();
    const { fibonacci } = req.query ?? 0;

    try {
        start = new Date().getTime();

        result = await fibonacciNumber(fibonacci);

        end = new Date().getTime();
    } catch (error) {
        console.log(error);
        throw new Error('Failed to calculate fibonacci number', error);
    }

    let timeSpent = timer(start, end);
    console.info(`\nfibonnaci ${fibonacci}th request received at ${now} - ${timeSpent} seconds spent`);

    res
        .status(200)
        .send({
            result,
            "time": `${timeSpent}`
        });
});

app.listen(port, () => console.log(`\n\n[🔥] Service is now running on ${port}!!!\n`));
