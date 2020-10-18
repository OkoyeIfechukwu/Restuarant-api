const jwtUtil = require('../security/jwtUtil')
const user = require('../models/User')

const auth = async (req,res,next) => {

    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwtUtil.decodeToken(token);
    await user.findOne({ username: decoded.username }).then(() => {
        next()
    }).catch((err) => {
        console.log(err)
        res.status(401).json({status:'UnAuthorized', message: 'Request Not permitted', data:err.message})
    })
}

module.exports = auth