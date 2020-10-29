const router = require('express-promise-router')()

router.get('/status', (req, res)=>res.status(200).json({
    uptime: process.uptime()
}));

router.use('/corpus', require('./corpus'));

module.exports = router;