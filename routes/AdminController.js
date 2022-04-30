const express = require('express');
const router = express.Router();

const securityUtils = require('../modules/utils/SecurityUtil');
const userService = require('../modules/services/UserService');
const kidService = require('../modules/services/KidService');

router.get('/users/', securityUtils.authenticateToken, (req, res) => {
    const roleId = req.claims.payload.user.roleId;
    if (roleId != 2) {
        res.status(500).send("Internal Server Error");
    } else {
        userService.getUsers(function (result) {
            if (result === null) {
                res.status(500).send("Internal Server Error");
            } else if (result.error != null) {
                res.status(422).send(result);
            } else {
                res.status(200).send(result);
            }
        });
    }
})

router.get('/questionnaires-completed/:userId', securityUtils.authenticateToken, (req, res) => {
    const roleId = req.claims.payload.user.roleId;
    const userId = req.params.userId;
    if (roleId != 2) {
        res.status(500).send("Internal Server Error");
    } else {
        kidService.getKidsWithQuestionnairesCompletedFromAdmin(userId, function (result) {
            if (result === null) {
                res.status(500).send("Internal Server Error");
            } else if (result.error != null) {
                res.status(422).send(result);
            } else {
                res.status(200).send(result);
            }
        });
    }
})

module.exports = router;