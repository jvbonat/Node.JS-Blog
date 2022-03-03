const Sequelize = require("sequelize");//IMPORTING SEQUELIZE MODULE INTO THE MODEL FILE
const Category = require("../categories/Category");//IMPORTING THE CATEGORY MODEL INTO THE ARTICLE MODEL FILE
//TO BUILD THE RELATION BETWEEN THE TWO TABLES
const connection = require("../database/database")//IMPORTIN THE CONNECTION WITH DB
//CREATING THE ARTICLE TABLE IN DB WITH JAVASCRIPT CODE
const Article = connection.define('articles',{
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    slug:{
        type:Sequelize.STRING,
        allowNull:false
    },
    body:{
        type:Sequelize.TEXT,
        allowNull:false
    }
})


//RELATIONAL DB
Article.belongsTo(Category)
Category.hasMany(Article)

module.exports = Article;//EXPORTING THE ARTICLE MODEL