import express from 'express'

const app=express()

app.get("/",(req,res,next)=>{
    res.send("at /")
})

app.listen(3000,'0.0.0.0',()=>{
    console.log("server started");
    
})