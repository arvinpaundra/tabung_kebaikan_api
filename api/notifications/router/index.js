const { notifAfterPenarikan } = require('../controller/controller');

const router = require('express').Router();

router.post('/notif-penarikan', notifAfterPenarikan);

module.exports = router;
