const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));
router.use('/records', require('./records'));
router.use('/inventory', require('./inventory'));
router.use('/user', require('./user'));
router.use('/', require('./auth'));

module.exports = router;
