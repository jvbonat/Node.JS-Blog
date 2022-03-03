//CREATING THE MODEL FOR CATEGORY
const Sequelize = require('sequelize');//IMPORTING SEQUELIZE
const connection = require("../database/database")//IMPORTING THE CONNECTION WITH DATABASE

//CREATING THE TABLE CATEGORY IN DB THROUGH JAVASCRIPT CODE
const Category = connection.define('categories',{
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    slug:{
        type:Sequelize.STRING,
        allowNull:false
    }
})



module.exports = Category;
