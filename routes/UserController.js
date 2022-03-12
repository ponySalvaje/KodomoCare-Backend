const express = require('express');
const router = express.Router();

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

module.exports = router;