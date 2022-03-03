const express = require("express");
const router = express.Router();
const User = require("./User")
const bcrypt = require('bcryptjs');//MODULE USED TO CREATE A PASSWORD HASH

//AUTHORIZATION IN A ROUTE => USE MIDDLEWARE
router.get("/admin/users",(req,res)=>{
    User.findAll().then(users=>{
        res.render("admin/users/index",{users:users})
    })
})

router.post("/users/update",(req,res)=>{
    let id = req.body.id;
    let email = req.body.email;
    let password = req.body.password;
    User.update({
        where:{
            id:id,
            email:email,
            password:password
        }
    }).catch(err=>{
        res.redirect("/admin/users")
    })
})

router.get("/admin/users/edit/:id",(req,res)=>{
    let id = req.params.id
    User.findByPk(id).then(user=>{
        res.render("admin/users/edit",{user:user})
    }).catch(err=>{
        res.redirect("/admin/users")
    })
})

router.post("/users/delete",(req,res)=>{
    let id = req.body.id
    User.destroy({
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/users")
    }).catch(err=>{
        res.redirect("/admin/users")
    })
})

router.get("/admin/users/create",(req,res)=>{
    res.render("admin/users/create");
})


router.get("/login",(req,res)=>{
    res.render("admin/users/login")
})

//AUTHENTICATING USER
router.post("/authenticate",(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({where:{email:email}}).then(user=>{
        if(user!=undefined){//THERE IS AN USER REGISTERED WITH THIS E-MAIL FOUND ON DB
            let correct = bcrypt.compareSync(password,user.password)//COMPARING PASSWORD HASH FROM DB WITH PASSWORD LOGIN
            if(correct){//LOGIN SESSION CONSIDERING THAT THE DATA TYPED FROM THE USER MATCHED THE DATA FROM DB
                req.session.user = {
                    id:user.id,
                    email:user.email
                }
            }else{//IF THE DATA IN DB DOESN'T MATCH THE DATA TYPED BY THE USER
                res.redirect("/admin/articles")
            }
        }else{//IF THE USER IS NOT REGISTERED IN THE SYSTEM WHETHER TYPED THE PASSWORD OR EMAIL NOT CORRECTLLY
            res.redirect("/login")
        }
    })
})

//LOGOUT
router.get("/logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/")
})

//SISTEMA DE CADASTRO DE USUÁRIOS COM BANCO DE DADOS
//NPM INSTALL --SAVE BCRYPT
router.post("/users/create",(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    //PREVENTING DUPLICATED E-MAIL TO BE REGISTERED
    User.findOne({where:{email:email}}).then(user=>{
        if(user==undefined){//IT MEANS THAT THIS EMAIL HAS NOT BEEN REGISTERED YET
            let salt = bcrypt.genSaltSync(10);//SECURITY
            let hash = bcrypt.hashSync(password,salt);//RETURNS THE PASSWORD HASH TO BE SAVED IN DATABASE
            //CREATING AN USER IN DATABASE
            User.create({
                email:email,
                password:hash
            }).then(()=>{
                res.redirect("/")
            }).catch(err=>{
                res.redirect("/")
            })
            //SHOWING DATA IN THE SCREEN TO SEE IF EVERYTHING IS CORRECT USING THE RES.JSON METHOD
            //res.json({email,password});
        }else{
            res.redirect("/admin/users/create")
        }
    })

})

module.exports = router;