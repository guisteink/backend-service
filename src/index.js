const express = require('express')
const app = express()
const port = 8000;

const fibonacciNumber = require('./algorithms/fibonacci');
const timer = require('./helpers/timer');

app.use('/', async (req, res) => {
    const { fibonacci } = req.query ?? 0;

    let start = new Date().getTime();
    let result = await fibonacciNumber(fibonacci)
    let end = new Date().getTime();

    console.log(`processing time: ${timer(start, end)} seconds`);

    res.json({
        "result": `Hello from fog server, the result for the ${fibonacci}th fibonacci number is: ${result}`,
        "processing_time": `${timer(start, end)} seconds`
    });
});

app.listen(port, () => console.log(`Service is now running on ${port}!!! 🔥🔥🔥\n`));
// app.listen(port, () => {});
