const router = require('express').Router();
const recordsController = require('../controllers/records');
const { isAuthenticated } = require('../middleware/authenticate');


router.get('/', recordsController.getAll);
router.get('/:id', recordsController.getSingle);

router.post('/', isAuthenticated, recordsController.createRecord);
router.put('/:id', isAuthenticated, recordsController.updateRecord);
router.delete('/:id', isAuthenticated, recordsController.deleteRecord);

module.exports = router;
