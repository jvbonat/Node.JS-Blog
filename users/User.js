//CREATING THE MODEL FOR USER
const Sequelize = require('sequelize');//IMPORTING SEQUELIZE
const connection = require("../database/database")//IMPORTING THE CONNECTION WITH DATABASE

//CREATING THE TABLE CATEGORY IN DB THROUGH JAVASCRIPT CODE
const User = connection.define('users',{
   email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

//User.sync({force:true})

module.exports = User;
