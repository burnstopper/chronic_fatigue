const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const resultController = require('../controllers/resultController');

router.get('/api/ihru', auth, resultController.findConcreteById);
router.get('/api/ihru/results/resp', auth, resultController.findAllByRespId);
router.get('/api/ihru/results', auth, resultController.findByTimestamp);
//router.get('/api/ihru/result/quiz/:id', auth, resultController.findAllByQuizId);

//Заглушка
router.post('/user/new_respondent', async (req, res) => {
    res.send("qwertyuiop");
});

//Заглушка
router.get('/user/:user_token', async (req, res) => {
    if (req.params.user_token == "qwertyuiop") {
        res.send("123");
    }
    res.status(403).send({error: "qwe"})
});

module.exports = router;