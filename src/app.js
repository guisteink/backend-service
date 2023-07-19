const express = require('express');
const os = require('os');
const cluster = require('cluster');
const { performance } = require('perf_hooks');

const fibonacciNumber = require('./algorithms/fibonacciNumberRecursive');

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
            let result, now;
            now = new Date().toISOString();
            const { fibonacci } = req.query ?? 0;

            try {
                await performance.mark('start');

                result = await fibonacciNumber(fibonacci);

                const cpuInUse = await performance.eventLoopUtilization();
                await performance.mark('end');

                cpuUsage = cpuInUse.utilization.toFixed(3);
                performance.measure('execution_time', 'start', 'end');
            } catch (error) {
                console.log(error);
                throw new Error('Failed to calculate fibonacci number', error);
            }

            const time = performance.getEntriesByName('execution_time')[0]?.duration?.toFixed(3);
            console.info(`\n[${process.pid}-work-thread][cpu-usage-${cpuUsage*100}%][${time}ms] fibonnaci ${fibonacci}th request received at ${now}`);

            performance.clearMeasures();

            res
                .status(200)
                .send({
                    result,
                    time,
                    cpuUsage
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
        let result, now;
            now = new Date().toISOString();
            const { fibonacci } = req.query ?? 0;

            try {
                const before = await performance.eventLoopUtilization();
                await performance.mark('start');

                result = await fibonacciNumber(fibonacci);

                const after = await performance.eventLoopUtilization();
                await performance.mark('end');

                cpuUsage = (after.utilization - before.utilization).toFixed(3);
                performance.measure('execution_time', 'start', 'end');
            } catch (error) {
                console.log(error);
                throw new Error('Failed to calculate fibonacci number', error);
            }

            const time = performance.getEntriesByName('execution_time')[0]?.duration?.toFixed(3);
            console.info(`\n[${process.pid}-work-thread][cpu-usage-${cpuUsage*100}%][${time}ms] fibonnaci ${fibonacci}th request received at ${now}`);

            performance.clearMeasures();

            res
                .status(200)
                .send({
                    result,
                    time,
                    cpuUsage
                });
    });
}
