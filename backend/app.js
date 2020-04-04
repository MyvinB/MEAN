const express =require('express');
const bodyParser= require('body-parser');
const app=express();
const path=require("path");
const postRoutes=require("./routes/posts")

const mongoose =require('mongoose');
mongoose.connect("mongodb+srv://myvin:myvin@cluster0-5ukgb.mongodb.net/post?retryWrites=true&w=majority")
.then(()=>{
  console.log("Connected to database");
})
.catch(()=>{
  console.log("Connection Failed");
});

app.use(bodyParser.json());
app.use("/images",express.static(path.join("backend/images")));


app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With,Content-Type,Accept");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
})

app.use("/posts",postRoutes);

module.exports =app;
