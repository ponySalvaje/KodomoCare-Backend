const kidRepository = require('../repository/KidRepository.js');
const questionnaireRepository = require('../repository/QuestionnaireRepository.js');

module.exports = {
    addKid: function (kidData, response) {
        kidRepository.addKid(kidData, function (kidResult) {
            questionnaireRepository.addQuestionnaire(kidResult.id, function (questionnaire) {
                return response(questionnaire);
            });
        });
    },
    getKidsFromUser: function (userId, response) {
        kidRepository.getKidsFromUser(userId, function (result) {
            if (result === undefined) {
                return response({ "error": "No se encontraron niños" })
            } else {
                return response(result);
            }
        })
    },
    getKidsWithQuestionnairesCompleted: function (userId, response) {
        kidRepository.getKidsWithQuestionnairesCompletedFromUser(userId, function (kids) {
            if (kids === undefined) {
                return response({ "error": "No se encontraron niños" })
            } else {
                return response(kids);
            }
        })
    },
    getCurrentQuestionnaire: function (kidId, response) {
        kidRepository.getActiveQuestionnaireFromKid(kidId, function (questionnaireResult) {
            questionnaireRepository.getEvaluationsFromQuestionnaire(questionnaireResult.id, function (evaluations) {
                return response(evaluations);
            })
        })
    }
}