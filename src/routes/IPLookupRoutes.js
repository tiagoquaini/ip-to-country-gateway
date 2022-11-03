const express = require('express');
const router = express.Router();
const LookupController = require('../controllers/IPLookupController');

router.get('/:ip/country', LookupController.getCountryByIp);

module.exports = router;