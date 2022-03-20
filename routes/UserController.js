const express = require('express');
const router = express.Router();

const securityUtils = require('../modules/utils/SecurityUtil');
const userService = require('../modules/services/UserService');


router.post('/register', (req, res) => {
    const body = req.body;
    userService.registerUser(body, function (result) {
        if (result != null) {
            res.status(201).send(result);
        } else {
            res.status(422).send({ "error": "Could not register user due or user duplication!" });
        }
    }
    );
})

router.get('/', securityUtils.authenticateToken, (req, res) => {
    const userId = req.claims.payload.user.userId;
    userService.getUserInformation(userId, function (result) {
        if (result === null) {
            res.status(500).send("Internal Server Error");
        } else if (result.error != null) {
            res.status(422).send(result);
        } else {
            res.status(200).send(result);
        }
    });
})

module.exports = router;