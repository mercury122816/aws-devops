const express = require('express');
const httpStatus = require('http-status');
const app = express();
const port = 3010;
const { monitorEventLoopDelay } = require('perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

setInterval(() => {
    console.log(h.min, h.max, h.mean)
}, 1000);

app.get('/', (req, res) => {
    const responseStatus = req.query.status || httpStatus.NOT_FOUND;
    res.status(responseStatus).json({
        data: {
            message: httpStatus[responseStatus]
        }
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})