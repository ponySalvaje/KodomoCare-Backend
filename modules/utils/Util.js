require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    calculateAgeInMonths: function (birthdate) {
        var today = new Date();
        var birthDate = new Date(birthdate);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        age = age * 12 + m;
        return age;
    }
}