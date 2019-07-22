const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
    if (req.headers.hasOwnProperty('token')) {
        try {
            const decoded = jwt.verify(req.headers.token, process.env.SECRET)
            req.decoded = decoded.payload
            next()
        } catch (err) {
            res.status(401).send({ error: err, message: 'unauthorized access' })
        }
    }
    else {
        res.status(401).send({ message: 'unauthorized access' })
    }
}