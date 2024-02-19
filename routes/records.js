const router = require('express').Router();
const recordsController = require('../controllers/records');
const { isAuthenticated } = require('../middleware/authenticate');
const { isAdmin } = require('../middleware/authenticate');


router.get('/', recordsController.getAll);
router.get('/:id', recordsController.getSingle);

router.post('/', isAuthenticated, recordsController.createRecord);
router.put('/:id', isAuthenticated, isAdmin, recordsController.updateRecord);
router.delete('/:id', isAuthenticated, isAdmin, recordsController.deleteRecord);

module.exports = router;
