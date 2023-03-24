require('dotenv').config({path: '../weights.env'});
const express = require('express');
const router = new express.Router();
const { v4: uuidv4 } = require('uuid');

const { Client } = require('pg');
 
const client = new Client({
    host: process.env.STUB_DATABASE_HOST,
    port: process.env.STUB_DATABASE_PORT,
    database: process.env.STUB_DATABASE_NAME,
    user: process.env.STUB_DATABASE_USERNAME,
    password: process.env.STUB_DATABASE_PASSWORD
});

client
  .connect()
  .then(() => console.log('connected to pg'))
  .catch((err) => console.error('pg connection error', err.stack));

router.get('/members', async (req, res) => {
    res.send({ has_access: true });
});

router.post('/user/new_respondent', async (req, res) => {
    try {
        const token = uuidv4();
        const result = client.query(`INSERT INTO respondent.respondents (token) VALUES ('${token}')`);

        res.send({ token: token });
    } catch (e) {
        res.status(500).send({ error: e });
    }
});

router.get('/user/check_researcher', async (req, res) => {
    if (req.query.token != "qwertyRES") {
        return res.send({ is_researcher: false });
    }
    res.send({ is_researcher: true });
});

router.get('/user/:user_token', async (req, res) => {
    if (req.params.user_token == "qwertyRES") {
        return res.send({ id: 3});
    }
    if (req.params.user_token == "qwertyUSER") {
        return res.send({ id: 4});
    }

    try {
        const result = await client.query(`SELECT id FROM respondent.respondents WHERE token = '${req.params.user_token}'`);
        if (result.rows.length == 0) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send({ id: result.rows[0].id } );
    } catch (e) {
        res.status(500).send({ error: e });
    }
});

//Конец заглушки

module.exports = router;