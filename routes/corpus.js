const router = require('express-promise-router')();
const control = require('@controllers/corpus')

router.get('/', control.getWordInfo);

module.exports = router;