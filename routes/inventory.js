const router = require('express').Router();
const inventoryController = require('../controllers/inventory');
const { isAuthenticated } = require('../middleware/authenticate');
const { isAdmin } = require('../middleware/authenticate');


router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getSingle);
router.delete('/:id', isAuthenticated, isAdmin, inventoryController.deleteInventory);

module.exports = router;
