const databaseConfig = require('../config/DatabaseConfig');
const uuid = require('uuid');
const LocalDate = require("@js-joda/core");
const Util = require('../utils/Util');
const { raw } = require('mysql');
const moment = require('moment');

module.exports = {
    getKidsFromUser: function (userId, callback) {
        databaseConfig.getSession().query('SELECT id, first_name, last_name, avatar_image, birthdate FROM kid k where k.user_id = ?', userId, (err, result) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let parsedResult = [];
            result.forEach(rawResult => parsedResult.push({
                id: rawResult.id,
                firstName: rawResult.first_name,
                lastName: rawResult.last_name,
                avatarImage: rawResult.avatar_image,
                months: Util.calculateAgeInMonths(rawResult.birthdate)
            }))
            return callback(parsedResult);
        });
        databaseConfig.closeConnection();
    },
    getActiveQuestionnaireFromKid: function (kidId, callback) {
        databaseConfig.getSession().query('SELECT id, kid_id, status, updated_date FROM questionnaire q where q.kid_id = ? and q.status = 0', kidId, (err, rows) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let rawResult = rows[0];
            return callback({
                id: rawResult.id,
                kidId: rawResult.kid_id,
                status: rawResult.status,
                updatedDate: rawResult.updated_date
            });
        });
        databaseConfig.closeConnection();
    },
    getKidInformation: function (id, callback) {
        databaseConfig.getSession().query('SELECT id, first_name, last_name, avatar_image, birthdate FROM kid k where k.id = ?', id, (err, rows) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let rawResult = rows[0];
            return callback({
                id: rawResult.id,
                firstName: rawResult.first_name,
                lastName: rawResult.last_name,
                avatarImage: rawResult.avatar_image,
                months: Util.calculateAgeInMonths(rawResult.birthdate)
            });
        });
        databaseConfig.closeConnection();
    },
    addKid: function (kidData, callback) {
        let insertObject = {
            id: uuid.v4(),
            first_name: kidData.firstName,
            last_name: kidData.lastName,
            identification_number: kidData.identificationNumber,
            birthdate: moment(kidData.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            gender: kidData.gender,
            relationship: kidData.relationship,
            avatar_image: kidData.avatarImage,
            user_id: kidData.userId
        }
        databaseConfig.getSession().query('INSERT INTO kid SET ?', insertObject, (err, result) => {
            if (err) return callback(err);

            return this.getKidInformation(insertObject.id, callback);
        });
        databaseConfig.closeConnection();
    }
}
