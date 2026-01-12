import express from 'express'

const app=express()

app.get("/",(req,res,next)=>{
    res.send("at /")
})

app.listen(3000,()=>{
    console.log("server started");
    
})