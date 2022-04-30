const databaseConfig = require('../config/DatabaseConfig');
const uuid = require('uuid');
const LocalDate = require("@js-joda/core");

module.exports = {
    findUserByUsername: function (username, callback) {
        databaseConfig.getSession().query('SELECT id, username, email, password, first_name, last_name, identification_number, avatar_image, status, role_id, created_date FROM user WHERE username = ?', username, (err, rows) => {
            if (err) return callback(err);
            let rawResult = rows[0];
            if (rawResult === undefined) {
                return callback(null);
            } else {
                return callback({
                    id: rawResult.id,
                    username: rawResult.username,
                    password: rawResult.password,
                    email: rawResult.email,
                    firstName: rawResult.first_name,
                    lastName: rawResult.last_name,
                    identificationNumber: rawResult.identification_number,
                    avatarImage: rawResult.avatar_image,
                    status: rawResult.status,
                    roleId: rawResult.role_id,
                    createdDate: rawResult.created_date
                });
            }
        });
        databaseConfig.closeConnection();
    },
    registerUser: function (userData, callback) {
        let insertObject = {
            id: uuid.v4(),
            username: userData.username,
            password: userData.password,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            identification_number: userData.identificationNumber,
            avatar_image: userData.avatarImage,
            status: 0,
            role_id: '1',
            created_date: LocalDate.LocalDate.now().toString(),
        }
        databaseConfig.getSession().query('INSERT INTO user SET ?', insertObject, (err, result) => {
            if (err) return callback(err);

            return this.findUserByUsername(userData.username, callback);
        });
        databaseConfig.closeConnection();
    },
    getUserInformation: function (userId, callback) {
        databaseConfig.getSession().query('SELECT username, email, first_name, last_name, identification_number, avatar_image FROM user WHERE id = ?', userId, (err, rows) => {
            if (err) return callback(err);
            let rawResult = rows[0];
            if (rawResult === undefined) {
                return callback(null);
            } else {
                return callback({
                    username: rawResult.username,
                    email: rawResult.email,
                    firstName: rawResult.first_name,
                    lastName: rawResult.last_name,
                    identificationNumber: rawResult.identification_number,
                    avatarImage: rawResult.avatar_image
                });
            }
        });
        databaseConfig.closeConnection();
    },
    updateUserInformation: function (userId, userData, callback) {
        databaseConfig.getSession().query('UPDATE user r SET r.first_name = ?, r.last_name = ?, r.identification_number = ?, r.avatar_image = ? WHERE r.id = ?', [userData.firstName, userData.lastName, userData.identificationNumber, userData.avatarImage, userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            return this.getUserInformation(userId, callback);
        });
        databaseConfig.closeConnection();
    },
    getUsers: function (callback) {
        databaseConfig.getSession().query('SELECT username, email, first_name, last_name, identification_number, avatar_image FROM user WHERE role_id = 1', [], (err, result) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let parsedResult = [];
            result.forEach(rawResult => parsedResult.push({
                username: rawResult.username,
                email: rawResult.email,
                firstName: rawResult.first_name,
                lastName: rawResult.last_name,
                identificationNumber: rawResult.identification_number,
                avatarImage: rawResult.avatar_image
            }))
            return callback(parsedResult);
        });
        databaseConfig.closeConnection();
    },
}
