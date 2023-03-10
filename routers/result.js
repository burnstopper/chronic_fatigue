const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const resultController = require('../controllers/resultController');

router.get('/api/ihru', auth, resultController.findConcreteById);
router.get('/api/ihru/results/resp', auth, resultController.findAllByRespId);
router.get('/api/ihru/results', auth, resultController.findByTimestamp);
//router.get('/api/ihru/result/quiz/:id', auth, resultController.findAllByQuizId);

//Заглушка

router.get('/members', async (req, res) => {
    res.send({ has_access: true });
});

router.post('/user/new_respondent', async (req, res) => {
    res.send({ token: "qwerty" });
});

router.get('/user/check_researcher', async (req, res) => {
    if (req.query.token != "qwertyRES") {
        return res.send({ is_researcher: false });
    }
    res.send({ is_researcher: true });
});

router.get('/user/:user_token', async (req, res) => {
    if (req.params.user_token == "qwerty") {
        return res.send({ id: 1});
    }
    if (req.params.user_token == "qwerty2") {
        return res.send({ id: 2});
    }
    if (req.params.user_token == "qwertyRES") {
        return res.send({ id: 3});
    }
    if (req.params.user_token == "qwertyUSER") {
        return res.send({ id: 4});
    }
    res.status(404).send({error : 'User not found'});
});

//Конец заглушки

module.exports = router;