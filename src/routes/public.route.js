const { Router } = require('express');
const { createLink } = require('../controllers/createLink');
const { readLink } = require('../controllers/readLink');
const { deleteLink } = require('../controllers/deleteLink');

const router = Router();

router.
    route('/link').
    post(createLink).
    delete(deleteLink);

router.get('/:short', readLink);

module.exports = router;