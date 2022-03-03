function adminAuth(req,res,next){
    if(req.session.user!==undefined){//USER LOGIN SUCCEED
        next();
    }else{//USER LOGIN DIDN'T SUCCEED()
        res.redirect("/login")
    }
}

module.exports = adminAuth