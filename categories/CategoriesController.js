const express = require("express");
const router = express.Router();//USING ROUTERS TO BUILD THE CATEGORIES ROUTES
const Category = require("./Category");
const slugify = require("slugify");//IMPORTING SLUGIFY
const res = require("express/lib/response");

//ROUTE FOR CATEGORIES CREATION
router.get("/admin/categories/new",(req, res) => {
    res.render("admin/categories/new");
});

//POST ROUTE FOR CATEGORIES => IT SAVES THE DATA FROM THE FORM INTO THE CATEGORY TABLE
router.post("/categories/save",(req,res)=>{
    let title = req.body.title; //SAVING THE VALUE FROM THE FIELD TITLE FROM THE FORM INTO THE TITLE VARIABLE
    if(title!=undefined){//VALID TITLE/NOT NULL TITLE
        //METHOD CREATE FROM SEQUELIZE => RESPONSIBLE FOR INSERTING DATA INTO THE FIELDS FROM THE TABLE
        Category.create({
            title:title,
            slug:slugify(title)
        }).then(()=>{//AFTER INSERTING THE DATA INTO THE TABLE
            res.redirect("/admin/categories")//REDIRECT USER FOR ROUTE ADMIN CATEGORIES
        })
    }else{//UNVALID TITLE/NULL TITLE
        res.redirect("/admin/categories/new")//REDIRECT USER FOR THE ROUTE OF CATEGORIES CREATION
    }
})

//ROUTE FOR CATEGORIES DELETION
router.post("/categories/delete",(req,res)=>{
    let id = req.body.id //GETTING THE VALUE FROM THE ID FIELD FROM THE FORM
    //DESTROY METHOD FROM SEQUELIZE => RESPONSIBLE FOR THE DELETION OF DATA BOTH IN FRONT AND BACK-END
    if(id!=undefined){//VALID ID/NOT NULL ID
        if(!isNaN(id)){//CHECKING IF THE ID IS A NUMBER
            Category.destroy({
                where:{id:id}//CONDITION FOR THE DELETION(ID ON DB = ID FROM THE FORM)
            }).then(()=>{//AFTER DELETION
                res.redirect("/admin/categories")//REDIRECTS USER TO ROUTE ADMIN/CATEGORIES
            })
        }else{
            res.redirect("/admin/categories")//REDIRECTS USER TO ROUTE ADMIN/CATEGORIES
        }
    }else{
        res.redirect("/admin/categories")//REDIRECTS USER TO ROUTE ADMIN/CATEGORIES
    }
})

//ROUTE RESPONSIBLE FOR CATEGORIES DISPLAY
router.get("/admin/categories",(req,res)=>{
    //METHOD RESPONSIBLE FOR LISTING THE CATEGORIES FIELDS VALUE IN DB AND SHOWING THEM IN FRONT-END
    //SAVING THE DATA FILTERED INTO THE CATEGORIES VARIABLE
    Category.findAll({}).then(categories=>{res.render("admin/categories/index",{categories:categories})})
})

//ROUTER RESPONSIBLE FOR LISTING THE CATEGORIES TO BE EDITED
router.get("/admin/categories/edit/:id",(req,res)=>{
    let id = req.params.id //SAVING THE VALUE OF THE ID PARAMETER IN THE VARIABLE ID
    if(isNaN(id)){//IN CASE ID IS NOT A NUMBER(IsNaN)
        res.redirect("/admin/categories")//REDIRECT USER FOR CATEGORIES ROUTE
    }
    Category.findByPk(id).then(category=>{
        if(id!==undefined){
            res.render("admin/categories/edit",{category:category})
        }
        else{
            res.redirect("/admin/categories")
        }
    }).catch(err=>{
        res.redirect("/admin/categories")
    })
})

//ROUTER RESPONSIBLE FOR UPDATING THE CATEGORIES DATA BOTH IN FRONT-END AND BACK-END
router.post("/categories/update",(req,res)=>{
    let title = req.body.title;
    let id = req.body.id
    //METHOD UPDATE => RESPONSIBLE FOR EDITING DATA IN THE FRONT-END SO DOES IN THE BACK-END
    Category.update({
        where:{//UPDATING CONDITIONS
            title:title,
            id:id,
            slug:slugify(title)
        }
    }).catch(error=>{
        res.redirect("/admin/categories")
    })
})


module.exports = router;