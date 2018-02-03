var Webpush = require("web-push");

const subs = [];

module.exports = {
    webpush: (req, res) => {
        webpush(req, res);
    },
    send: (req, res) => {
        send(req, res);
    }
}

function webpush(req, res) {   
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error);
    }
   
};

function send(req, res) {
    for (let i = 0; i < subs.length; i++) {
        const push = subs[i];
        Webpush.sendNotification(push, JSON.stringify({
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
};
