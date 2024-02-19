const router = require('express').Router();
const orderController = require('../controllers/order');
const { isAuthenticated } = require('../middleware/authenticate');
const { isAdmin } = require('../middleware/authenticate');

router.get('/', orderController.getAll);
router.get('/:id', orderController.getSingle);
router.post('/', isAuthenticated, orderController.createOrder);
router.put('/:id', isAuthenticated, isAdmin, orderController.updateOrderStatus);
router.get('/user/:userId', isAuthenticated, orderController.findByUser);
router.delete('/:id', isAuthenticated, isAdmin, orderController.deleteOrder);

module.exports = router;
