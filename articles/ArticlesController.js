const express = require('express');
const Article = require('./Article');
const Category = require('../categories/Category');
const slugify = require("slugify")
const router = express.Router();
const adminAuth = require("../middleware/adminAuth")//IMPORTING MIDDLEWARE FUNCTIONALITY

//LISTING THE ARTICLES BY USING THE JOIN QUERY FOR DB TABLES TO ALSO GET THE CATEGORY NAME
router.get("/admin/articles",(req,res)=>{
    Article.findAll({include:[{model:Category,required:true}]}).then(articles=>{
        res.render("admin/articles/index",{articles:articles})
    })
})

router.get("/admin/articles/new",(req,res)=>{
    //LISTING THE CATEGORIES TO SELECT IT IN THE ARTICLES PAGE THROUGH A DROPDOWN
    Category.findAll({}).then(categories=>{
        res.render("admin/articles/new",{categories:categories})
    })
})

//ROUTE RESPONSIBLE FOR INSERTING DATA INTO THE ARTICLES TABLE FROM DATABASE
router.post("/articles/save",(req,res)=>{
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.category;
    Article.create({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:categoryId
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})

//ROUTE RESPONSIBLE FOR ARTICLE DELETION BOTH IN BACK AND FRONT-END
router.post("/articles/delete",(req,res)=>{
    let id = req.body.id
    Article.destroy({
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles")
    }).catch(err=>{
        res.redirect("/admin/articles")
    })
})

//ROUTE RESPONSIBLE FOR LISTING THE ARTICLES TO BE EDITED
router.get("/admin/articles/edit/:id",(req,res)=>{
    let id = req.params.id;
    Article.findByPk(id).then(article=>{
        if(article!==undefined){
            Category.findAll({}).then(categories=>{
                res.render("admin/articles/edit",{categories:categories,article:article})
            })
        }
        else{
            res.redirect("/")
        }
    }).catch(err=>{
        res.redirect("/")
    })
})

//ROUTER RESPONSIBLE FOR UPDATING THE DATA BOTH IN BACK AND FRONT-END
router.post("/articles/update",(req,res)=>{
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;
    Article.update({id:id,title:title,body:body,categoryId:category,slug:slugify(title)},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles")
    }).catch(err=>{
        res.redirect("/")
    })
})

//PAGE MAKE-UP
router.get("/articles/page/:num",(req,res)=>{

    let page = req.params.num;
    if(isNaN(page) || page==1){
        offset = 0;
    }else{
        offset = parseInt(page)*4;
    }

    Article.findAndCountAll({
        limit:4,
        offset:offset
    }).then(articles=>{
        let next;
        if(offset+4>=articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            next:next,
            articles:articles
        }

        Category.findAll().then(categories=>{
            res.render("admin/articles/page",{result:result,categories:categories})
        })

        res.json(articles);
    })
})

module.exports = router;