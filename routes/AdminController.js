const express = require('express');
const router = express.Router();

const securityUtils = require('../modules/utils/SecurityUtil');
const userService = require('../modules/services/UserService');
const kidService = require('../modules/services/KidService');
const questionnaireService = require('../modules/services/QuestionnaireService');

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
        kidService.getKidsWithQuestionnairesCompleted(userId, function (result) {
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

router.get('/questionnaires/', securityUtils.authenticateToken, (req, res) => {
    const roleId = req.claims.payload.user.roleId;
    if (roleId != 2) {
        res.status(500).send("Internal Server Error");
    } else {
        questionnaireService.getQuestionnaires(function (result) {
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

router.get('/evaluations-month/', securityUtils.authenticateToken, (req, res) => {
    const roleId = req.claims.payload.user.roleId;
    if (roleId != 2) {
        res.status(500).send("Internal Server Error");
    } else {
        questionnaireService.getEvaluations(function (result) {
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

router.get('/user/:userId', securityUtils.authenticateToken, (req, res) => {
    const roleId = req.claims.payload.user.roleId;
    const userId = req.params.userId;
    if (roleId != 2) {
        res.status(500).send("Internal Server Error");
    } else {
        userService.getUserInformation(userId, function (result) {
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

router.put('/user/:userId', securityUtils.authenticateToken, (req, res) => {
    const roleId = req.claims.payload.user.roleId;
    const userId = req.params.userId;
    const body = req.body;
    if (roleId != 2) {
        res.status(500).send("Internal Server Error");
    } else {
        userService.updateUserInformation(userId, body, function (result) {
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

router.get('/kid/:kidId', securityUtils.authenticateToken, (req, res) => {
    const roleId = req.claims.payload.user.roleId;
    const kidId = req.params.kidId;
    if (roleId != 2) {
        res.status(500).send("Internal Server Error");
    } else {
        kidService.getKidInformation(kidId, function (result) {
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

router.put('/kid/:kidId', securityUtils.authenticateToken, (req, res) => {
    const roleId = req.claims.payload.user.roleId;
    const kidId = req.params.kidId;
    const body = req.body;
    if (roleId != 2) {
        res.status(500).send("Internal Server Error");
    } else {
        kidService.updateKidInformation(kidId, body, function (result) {
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