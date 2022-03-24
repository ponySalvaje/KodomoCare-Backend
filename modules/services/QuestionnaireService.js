const kidRepository = require('../repository/KidRepository.js');
const questionnaireRepository = require('../repository/QuestionnaireRepository.js');

module.exports = {
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