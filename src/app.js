const express = require('express');
const os = require('os');
const cluster = require('cluster');

const fibonacciNumber = require('./algorithms/fibonacciNumberRecursive');
const timer = require('./utils/timer');

const port = 3000;

const clusterWorkerSize = os.cpus().length;

if (clusterWorkerSize > 1) {
    if (cluster.isMaster) {
        for(let i = 0; i < clusterWorkerSize; i++) {
            cluster.fork();
        }

        cluster.on("exit", function(worker) {
            console.log("Worker ", worker.id, " has exitted.")
        });
    } else {
        const app = express();
        app.listen(port, () => console.log(`\n\n[🔥][${process.pid}-work-thread] running on ${port}!!!\n`));

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
                start = await new Date().getTime();

                result = await fibonacciNumber(fibonacci);

                end = await new Date().getTime();
            } catch (error) {
                console.log(error);
                throw new Error('Failed to calculate fibonacci number', error);
            }

            let time = timer(start, end);
            console.info(`\n[${process.pid}-work-thread] fibonnaci ${fibonacci}th request received at ${now} - ${time} seconds spent`);

            res
                .status(200)
                .send({
                    result,
                    time
                });
        });
    }
} else {
    const app = express();
    app.listen(port, () => console.log(`\n\n[🔥][${process.pid}-work-thread] running on ${port}!!!\n`));

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

        let time = timer(start, end);
        console.info(`\n[${process.pid}-work-thread] fibonnaci ${fibonacci}th request received at ${now} - ${time} seconds spent`);

        res
            .status(200)
            .send({
                result,
                time
            });
    });
}
