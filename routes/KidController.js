const express = require('express');
const router = express.Router();

const securityUtils = require('../modules/utils/SecurityUtil');
const kidService = require('../modules/services/KidService');


router.post('/', securityUtils.authenticateToken, (req, res) => {
    const body = req.body;
    body.userId = req.claims.payload.user.userId;
    kidService.addKid(body, function (result) {
        if (result != null) {
            res.status(201).send(result);
        } else {
            res.status(422).send({ "error": "Could not register kid due to user duplication!" });
        }
    }
    );
})

router.get('/users', securityUtils.authenticateToken, (req, res) => {
    const userId = req.claims.payload.user.userId;
    kidService.getKidsFromUser(userId, function (result) {
        if (result === null) {
            res.status(500).send("Internal Server Error");
        } else if (result.error != null) {
            res.status(422).send(result);
        } else {
            res.status(200).send(result);
        }
    });
})

router.get('/questionnaire/:kidId', securityUtils.authenticateToken, (req, res) => {
    const kidId = req.params.kidId;
    kidService.getCurrentQuestionnaire(kidId, function (result) {
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