const Sequelize = require('sequelize');//IMPORTING THE SEQUELIZE MODULE
//SEQUELIZE IS RESPONSIBLE FOR THE INTEGRATION BETWEEN NODE.JS AND DATABASE
//USING SEQUELIZE WE CAN MANIPULATE OUR DATABASE USING JAVASCRIPT CODE

//CREATING THE CONNECTION WITH THE DB
const connection = new Sequelize('nodejsblog','root','Gremiogaia@1234',{
    host:'localhost',
    dialect:'mysql',
    timezone:"-03:00"
})
module.exports = connection;//EXPORTING THE CONNECTION

