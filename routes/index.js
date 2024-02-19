const router = require('express').Router();

router.use('/', require('./swagger'));
router.use('/records', require('./records'));
router.use('/inventory', require('./inventory'));
router.use('/user', require('./user'));
router.use('/orders', require('./order'));
router.use('/', require('./auth'));

module.exports = router;
