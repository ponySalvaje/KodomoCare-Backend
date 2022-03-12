const kidRepository = require('../repository/KidRepository.js');

module.exports = {
    addKid: function (kidData, response) {
        kidRepository.addKid(kidData, function (insertResult) {
            return response(insertResult);
        })
    },
    getKidsFromUser: function (userId, response) {
        kidRepository.getKidsFromUser(userId, function (result) {
            if (result === undefined) {
                return response({ "error": "No se encontraron niños" })
            } else {
                return response(result);
            }
        })
    }
}