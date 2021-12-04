const express = require('express');
const app=express();


const AdminRoute=require("./Api/controller/admin");
const UserRoute=require("./Api/controller/user");
const MovieRoute=require("./Api/controller/movie");
const rentMovie=require("./Api/controller/rent");


const mongoose=require("mongoose");
const bodyParser=require("body-parser");

mongoose.connect("mongodb+srv://admin:admin@cluster0.o6dld.mongodb.net/adminInfo?retryWrites=true&w=majority");

mongoose.connection.on('error',err=>{
    console.log("connection failed...");
});
mongoose.connection.on("connected",connected=>{
    console.log("Connected Database!");
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.json());

const route=require("./route/route")
app.use('/admin',AdminRoute);
app.use('/user',UserRoute);
app.use('/movie',MovieRoute);
app.use('/rent',rentMovie);



app.use((req,res,next)=>{
    res.status(404).json({
        message:"Url Not Found"
    })
})


module.exports=app;