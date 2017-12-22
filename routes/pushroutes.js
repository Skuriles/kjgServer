var express = require('express');
var router = express.Router();
var webpush = require('web-push');

const subs = [];

router.route('/webpush').post((req, res) => {
    var action = req.body.action;
    var push = req.body.subscription;
    switch (action) {
        case "subscribe":
            subs.push(push);
            res.status(204).send().end();
            return;
        case "unsubscribe":
            // TODO remove
            break;
        default:
            break;
    }
});

router.route('/send').post((req, res) => {
    for (let i = 0; i < subs.length; i++) {
        const push = subs[i];
        webpush.sendNotification(
            push, JSON.stringify({ test: 'Test' })
        );
        res.status(204).send().end();
        return;
    }
});

module.exports = router;
