const kidRepository = require('../repository/KidRepository.js');
const questionnaireRepository = require('../repository/QuestionnaireRepository.js');

module.exports = {
    getQuestionnaires: function (response) {
        questionnaireRepository.getQuestionnaires(function (result) {
            return response(result);
        });
    },
    getEvaluations: function (response) {
        questionnaireRepository.getEvaluations(function (result) {
            return response(result);
        });
    },
    addEvaluation: function (questionnaireId, evaluationData, kidId, response) {
        questionnaireRepository.addEvaluation(questionnaireId, evaluationData, function (evaluationsFromQuestionnaire) {
            if (evaluationsFromQuestionnaire.count == 5) {
                questionnaireRepository.finishQuestionnaire(kidId, function (result) {
                    questionnaireRepository.addNewQuestionnaire(kidId, function (questionnaire) {
                        return response(questionnaire);
                    });
                });
            } else {
                return response(evaluationsFromQuestionnaire);
            }
        })
    }
}