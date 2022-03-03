const express = require("express");//IMPORTING EXPRESS
const app = express();//USING EXPRESS THROUGH THE APP VARIABLE
const bodyParser = require("body-parser");//IMPORTING BODY-PARSER
const connection = require("./database/database");//IMPORTING CONNECTION WITH DB

const categoriesController = require("./categories/CategoriesController");//IMPORTING CATEGORIES CONTROLLERS
const articlesController = require("./articles/ArticlesController");//IMPORTING ARTICLES CONTROLLERS
const usersController = require("./users/UsersController")//IMPORTING USERS CONTROLLERS
const Article = require("./articles/Article");//IMPORTING THE ARTICLE MODEL
const Category = require("./categories/Category");//IMPORTING THE CATEGORY MODEL
const User = require("./users/User")//IMPORTING THE USER MODEL
const res = require("express/lib/response");
const session = require("express-session")//IMPORTING EXPRESS SESSION TO BUILD LOGIN SYSTEM


//SESSIONS

app.use(session({
    secret: 'qualquercoisa',
    cookie: { maxAge: 30000 },
    resave: false,
    saveUninitialized: false
  }));

// View engine
app.set('view engine','ejs');//SETTING THE VIEW ENGINE AS EJS

// Static
app.use(express.static('public'));//SETTING PUBLIC AS THE FOLDER TO SAVE STATIC FILES(CSS,IMAGES,JS)

//Body parser
//BODY PARSER IS RESPONSIBLE FOR DECODIFICATING THE DATA THAT COMES FROM FORMS INTO A READABLE JAVASCRIPT STRUCTURE FOR THE BACK-END

app.use(bodyParser.urlencoded({extended: false}));//USING BODY-PARSER
app.use(bodyParser.json());//BODY-PARSER FOR API'S

// Database(PROMISE STRUCTURE TO VALIDATE CONNECTION WITH DATABASE)
connection
    .authenticate()
    .then(() => {
        console.log("");
    }).catch((error) => {
        console.log(error);
    })


app.use("/",categoriesController);//USING THE CATEGORIES CONTROLLERS    
app.use("/",articlesController);//USING THE ARTICLES CONTROLLERS
app.use("/",usersController)//USING THE USERS CONTROLLERS


//ROUTE(/)=>INITAL ROUTE FROM THE APPLICATION
app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ]
    }).then(articles=>{
        Category.findAll({
        }).then(categories=>{
            res.render("index",{articles:articles,categories:categories})
        })
    })
})

//SEARCHING AN ARTICLE THROUGH THE SLUG PARAMETER
app.get("/:slug",(req,res)=>{
    let slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article=>{
        if(article!=undefined){
            Category.findAll({
            }).then(categories=>{
                res.render("article",{article:article,categories:categories})
            })
        }
        else{
            res.redirect("/")
        }
    }).catch(err=>{
        res.redirect("/")
    })
})

//DINAMIC NAVBAR
app.get("/category/:slug",(req,res)=>{
    let slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]
    }).then(category=>{
        if(category!=undefined){
            Category.findAll().then(categories=>{
                res.render("index",{articles:category.articles,categories:categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err=>{
        res.redirect("/")
    })
})

//INITIALIZING THE SERVER IN THE 1700 PORT
app.listen(1700,() => {
    console.log("O servidor está rodando!")
})