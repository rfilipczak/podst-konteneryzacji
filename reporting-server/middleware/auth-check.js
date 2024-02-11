const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, `${process.env.SK}`);
        const userData = { email: decodedToken.email, userId: decodedToken.userId };
        console.log(token);
        console.log(decodedToken);
        console.log(userData);
        req.userData = userData;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "Authorization failed"
        });
    }
};

module.exports = authCheck;