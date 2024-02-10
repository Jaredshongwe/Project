const router = require('express').Router();
const inventoryController = require('../controllers/inventory');


router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getSingle);

module.exports = router;
