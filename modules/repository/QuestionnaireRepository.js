const databaseConfig = require('../config/DatabaseConfig');
const uuid = require('uuid');
const LocalDate = require("@js-joda/core");
const Util = require('../utils/Util');
const { raw } = require('mysql');
const moment = require('moment');

module.exports = {
    getQuestionnaires: function (callback) {
        databaseConfig.getSession().query('SELECT id, kid_id, status, updated_date FROM questionnaire q where q.status = 1', [], (err, result) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let parsedResult = [];
            result.forEach(rawResult => parsedResult.push({
                id: rawResult.id,
                kidId: rawResult.kid_id,
                status: rawResult.status,
                updatedDate: rawResult.updated_date
            }))
            return callback(parsedResult);
        });
        databaseConfig.closeConnection();
    },
    getEvaluations: function (callback) {
        databaseConfig.getSession().query('select e.id, TIMESTAMPDIFF(MONTH, k.birthdate, e.created_date) as month_test from evaluation e join questionnaire q on e.questionnaire_id = q.id join kid k on k.id = q.kid_id where q.status = 1', [], (err, result) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let parsedResult = [];
            result.forEach(rawResult => parsedResult.push({
                id: rawResult.id,
                month_test: rawResult.month_test
            }))
            return callback(parsedResult);
        });
        databaseConfig.closeConnection();
    },
    getQuestionnaireFromKid: function (kidId, callback) {
        databaseConfig.getSession().query('SELECT id, kid_id, status, updated_date FROM questionnaire q where q.kid_id = ? and q.status = 0', kidId, (err, result) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let parsedResult = [];
            result.forEach(rawResult => parsedResult.push({
                id: rawResult.id,
                kidId: rawResult.kid_id,
                status: rawResult.status,
                updatedDate: rawResult.updated_date
            }))
            return callback(parsedResult);
        });
        databaseConfig.closeConnection();
    },
    getEvaluationsFromQuestionnaire: function (questionnaireId, callback) {
        databaseConfig.getSession().query(`
        select 'communication' as type, count(e.id) as value from evaluation e where e.questionnaire_id = ? and e.type = 'communication' UNION 
        select 'fine_motor' as type, count(e.id) as value from evaluation e where e.questionnaire_id = ? and e.type = 'fine_motor' UNION
        select 'gross_motor' as type, count(e.id) as value from evaluation e where e.questionnaire_id = ? and e.type = 'gross_motor' UNION
        select 'individual_social' as type, count(e.id) as value from evaluation e where e.questionnaire_id = ? and e.type = 'individual_social' UNION
        select 'problem_solving' as type, count(e.id) as value from evaluation e where e.questionnaire_id = ? and e.type = 'problem_solving';
        `, [questionnaireId, questionnaireId, questionnaireId, questionnaireId, questionnaireId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            let parsedResult = [];
            result.forEach(rawResult => parsedResult.push({
                type: rawResult.type,
                value: rawResult.value,
            }));
            let questionnaireResult = {
                questionnaireId: questionnaireId,
                evaluations: parsedResult
            };
            return callback(questionnaireResult);
        });
        databaseConfig.closeConnection();
    },
    getCompletedQuestionnaireForKids: function (kids, callback) {

    },
    addQuestionnaire: function (kidId, callback) {
        let insertObject = {
            id: uuid.v4(),
            kid_id: kidId,
            status: 0,
            updated_date: LocalDate.LocalDate.now().toString(),
        }
        databaseConfig.getSession().query('INSERT INTO questionnaire SET ?', insertObject, (err, result) => {
            if (err) return callback(err);

            return this.getQuestionnaireFromKid(kidId, callback);
        });
        databaseConfig.closeConnection();
    },
    finishQuestionnaire: function (kidId, callback) {
        databaseConfig.getSession().query('UPDATE questionnaire SET status = 1, updated_date = DATE(NOW()) WHERE kid_id = ?', kidId, (err, result) => {
            if (err) return callback(err);

            return this.getQuestionnaireFromKid(kidId, callback);
        });
        databaseConfig.closeConnection();
    },
    addNewQuestionnaire: function (kidId, callback) {
        let insertObject = {
            id: uuid.v4(),
            kid_id: kidId,
            status: 0,
            updated_date: LocalDate.LocalDate.now().toString(),
        }
        databaseConfig.getSession().query('INSERT INTO questionnaire SET ?', insertObject, (err, result) => {
            if (err) return callback(err);

            return this.getQuestionnaireFromKid(kidId, callback);
        });
        databaseConfig.closeConnection();
    },
    addEvaluation: function (questionnaireId, evaluationData, callback) {
        let insertObject = {
            id: uuid.v4(),
            type: evaluationData.type,
            score: evaluationData.score,
            answers: JSON.stringify(evaluationData.answers),
            created_date: LocalDate.LocalDate.now().toString(),
            questionnaire_id: questionnaireId,
            rating: evaluationData.rating
        }
        databaseConfig.getSession().query('INSERT INTO evaluation SET ?', insertObject, (err, result) => {
            if (err) return callback(err);

            return this.getEvaluationCountFromQuestionnaire(questionnaireId, callback);
        });
        databaseConfig.closeConnection();
    },
    getEvaluationCountFromQuestionnaire: function (questionnaireId, callback) {
        databaseConfig.getSession().query('select count(*) as count from evaluation e where e.questionnaire_id = ?', questionnaireId, (err, rows) => {
            if (err) return callback(err);
            let rawResult = rows[0];
            return callback({
                count: rawResult.count
            })
        });
        databaseConfig.closeConnection();
    }
}
