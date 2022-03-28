const userRepository = require('../repository/UserRepository.js');
const securityUtils = require('../utils/SecurityUtil');

module.exports = {
    registerUser: function (userData, callback) {
        return securityUtils.hashPassword(userData.password, function (hashedPassword) {
            userData.password = hashedPassword;
            userRepository.registerUser(userData, function (insertResult) {
                return callback(insertResult);
            })
        });
    },
    validateEmail: function (userData, callback) {
        return userRepository.findUserByUsername(userData.email, function (userExists) {
            if (userExists === null) {
                return callback(null);
            } else {
                return callback(true);
            }
        })
    },
    getUserInformation: function (userId, response) {
        return userRepository.getUserInformation(userId, function (user) {
            return response(user);
        })
    },
    updateUserInformation: function (userId, userData, response) {
        return userRepository.updateUserInformation(userId, userData, function (user) {
            return response(user);
        })
    }
}