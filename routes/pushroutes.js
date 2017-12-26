var express = require("express");
var router = express.Router();
var webpush = require("web-push");

const subs = [];

router.route("/webpush").post((req, res) => {
    var action = req.body.action;
    var push = req.body.subscription;
    switch (action) {
        case "subscribe":
            for (let i = 0; i < subs.length; i++) {
                const sub = subs[i];
                if (sub.auth === push.auth) {
                    res
                        .status(204)
                        .send()
                        .end();
                    return;
                }
            }
            subs.push(push);
            res
                .status(204)
                .send()
                .end();
            return;
        case "unsubscribe":
            for (let i = 0; i < subs.length; i++) {
                const sub = subs[i];
                if (sub.auth === push.auth) {
                    subs.splice(i, 1);
                }
            }
            res
                .status(204)
                .send()
                .end();
            break;
        default:
            break;
    }
});

router.route("/send").post((req, res) => {
    for (let i = 0; i < subs.length; i++) {
        const push = subs[i];
        webpush.sendNotification(push, JSON.stringify({
            notification: {
                title: "Test",
                name: "This is a test"
            }
        }));
        res
            .status(204)
            .send()
            .end();
        return;
    }
    res
        .status(204)
        .send()
        .end();
});

module.exports = router;
