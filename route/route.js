const express = require('express');
const app=express();

const AdminRoute=require("../Api/controller/admin");
const UserRoute=require("../Api/controller/user");
const MovieRoute=require("../Api/controller/movie");
const rentMovie=require("../Api/controller/rent");

var route = express.Router();

app.use('/admin',AdminRoute);
app.use('/user',UserRoute);
app.use('/movie',MovieRoute);
app.use('/rent',rentMovie);

module.exports = route;
