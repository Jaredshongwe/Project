const router = require('express').Router();
const userController = require('../controllers/user');
const { isAuthenticated } = require('../middleware/authenticate');
const { isAdmin } = require('../middleware/authenticate');


router.get('/', userController.getAll);
router.get('/:id', userController.getSingle);



router.post('/', isAuthenticated, userController.createUser);
router.put('/password/:id', isAuthenticated, userController.changePassword);
router.put('/admin/:id', isAuthenticated, userController.setAdmin);
router.put('/user/:id', isAuthenticated, userController.setUser);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;