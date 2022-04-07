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
    getKidsWithQuestionnairesCompletedFromUser: function (userId, callback) {
        databaseConfig.getSession().query(`SELECT k.id, first_name, last_name, avatar_image, birthdate, q.id as questionnaire_id, q.status, q.updated_date, e.id as evaluation_id, e.type, e.score, e.rating
            FROM kid k left join questionnaire q on k.id = q.kid_id 
            left join evaluation e on e.questionnaire_id = q.id
            where k.user_id = ?`, userId, (err, result) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let parsedResult = [];
            result.forEach(raw => {
                if (parsedResult.find(x => x.id === raw.id) == undefined) {
                    parsedResult.push({
                        id: raw.id,
                        firstName: raw.first_name,
                        lastName: raw.last_name,
                        avatarImage: raw.avatar_image,
                        months: Util.calculateAgeInMonths(raw.birthdate)
                    });
                }
            });
            parsedResult.forEach(raw => {
                let questionnaires = [];
                let questionnaireRows = result.filter(x => x.id == raw.id);
                questionnaireRows.forEach(questionnaire => {
                    if (questionnaires.find(x => x.id === questionnaire.questionnaire_id) == undefined && questionnaire.status == 1) {
                        questionnaires.push({
                            id: questionnaire.questionnaire_id,
                            status: questionnaire.status,
                            updatedDate: questionnaire.updated_date
                        });
                    }
                });

                questionnaires.forEach(rawQuestionnaire => {
                    let evaluations = [];
                    let evaluationRows = result.filter(x => x.questionnaire_id == rawQuestionnaire.id);
                    evaluationRows.forEach(evaluation => {
                        evaluations.push({
                            id: evaluation.evaluation_id,
                            type: evaluation.type,
                            score: evaluation.score,
                            rating: evaluation.rating
                        })
                    })
                    rawQuestionnaire.evaluations = evaluations;
                });

                raw.questionnaires = questionnaires;
            });

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
