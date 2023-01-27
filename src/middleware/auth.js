const jwt = require('jsonwebtoken');
const registermodel = require('../models/regisschema');
require('../models/regisschema');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        //varify token after particular page click
        const varifyuser = jwt.verify(token, "mynameiskevalrabadiyafrombhavnagar")
        console.log(varifyuser);
        const user = await registermodel.findOne({ _id: varifyuser._id })
        console.log(user);

        req.token
        next()

    } catch (error) {
        res.send(error)
    }
}
module.exports = auth;