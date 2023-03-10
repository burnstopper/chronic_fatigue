require('dotenv').config({path: '../weights.env'});
const userMicroserviceHost = process.env.USER_MICROSERVICE_HOST;
const axios = require('axios');

const auth = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token || token.length == 0) {
            const responseToken = await axios.post(`${userMicroserviceHost}/user/new_respondent`);
            if (responseToken == undefined) {
                throw new Error('User service is unavailable');
            } else {
                req.token = responseToken.data.token;
                const responseId = await axios.get(`${userMicroserviceHost}/user/${req.token}`);
                if (responseId == undefined) {
                    throw new Error('User service is unavailable');
                } else {
                    req.id = responseId.data.id;
                    res.setHeader('Authorization', `Bearer ${req.token}`);
                    next();
                }
            }
        } else {
            token = token.replace('Bearer ', '');
            const responseId = await axios.get(`${userMicroserviceHost}/user/${token}`);
            if (responseId.status == 200) {
                req.token = token;
                req.id = responseId.data.id;
                next();
            } else {
                throw new Error('Invalid token');
            }
        }

    } catch (e) {
        if (e.message == 'Invalid token' || e.message == 'Request failed with status code 404' || e.message == 'Request failed with status code 401') {
            res.status(401).send({error: "Invalid token"});
        } else {
            res.status(500).send({error: e.message});
        }
    }
};

module.exports = auth;