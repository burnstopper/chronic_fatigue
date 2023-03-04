require('dotenv').config({path: '../weights.env'});
const config = JSON.parse(process.env.WEIGHTS);

const auth = async (req, res, next) => {
    try {
        /*const authHeader = req.headers.authorization;
        if (authHeader == undefined) {
        }
        const token = authHeader.split(' ')[1];

        if (token == null || token.length == 0) {
            throw new Error("No token provided");
        } */
        //Request to User microservice to validate token

        //Case where token is valid
        req.token = 12345;
        req.id = 123;
        next();

        //Case where token is not valid
        //throw new Error("Token is invalid");

    } catch (e) {
        res.status(401).send({error: e.message});
    }
};

module.exports = auth;