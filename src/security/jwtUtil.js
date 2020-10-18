const jwtUtil = require('jsonwebtoken')
const User = require('../models/User')

const createToken = ({email, username}) => {

    return jwtUtil.sign({email: email, username: username}, process.env.JWT_SECRET, {
        expiresIn: '23h',
        subject: 'Auth Token',
    });
}

const decodeToken = (token) => {
    try {
        return jwtUtil.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        throw new Error(e);
    }

}

const getUser = async (token) => {
    try {
        const decoded = decodeToken(token);
        let UserObject = undefined;
        await User.findOne({username: decoded.username, email: decoded.email}).then((user) => {
            UserObject = user._doc;
        }).catch((err) => {
            console.log(err)
            throw new Error(err);
        })

        return UserObject;
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = {
    createToken: createToken,
    decodeToken,
    getUser
}