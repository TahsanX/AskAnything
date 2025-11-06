function asyncwrap(fn) {
    return function(req,res,next){
        fn(req,res,next).catch((err)=> next(err))
    }
}
module.exports = asyncwrap