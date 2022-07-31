const router = require('express').Router();

const webhookToken = process.env.WEBHOOK_TOKEN;

router.get('/', async (req, res) => {
  try {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token && mode === 'subscribe' && token === webhookToken) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
