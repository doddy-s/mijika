const { Router } = require('express');
const { createLink } = require('../controllers/createLink.htmx');
const { readLink } = require('../controllers/readLink');
const { deleteLink } = require('../controllers/deleteLink');

const router = Router();

router.
    route('/link').
    post(createLink).
    delete(deleteLink);

module.exports = router;