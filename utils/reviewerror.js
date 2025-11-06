const joi = require("../validation/reviewjoi")
const validate = (req,res,next)=>{
    if (joi.validate(req.body).error) {
        return next(joi.validate(req.body).error)
    }
    next()
}
module.exports = validate