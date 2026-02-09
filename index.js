import express from 'express'
import dotenv from 'dotenv'
import dbconnect from './database/dbconnect.js'
import customersaveroute from './routes/savecustomer.route.js'
import sendEmail from './utils/sendmail.js'

dotenv.config()



const app=express()

app.use(express.json())
app.use(customersaveroute)
//create middle ware that execute for every request and log the request method and url and time of request
app.use((req,res,next)=>{
    
    sendEmail("tvhkc123@gmail.com","Manav","testingemail",`<h1>Testing Email</h1><p>This is a test email sent from the ApnaBazar backend.✅</p>`).then(()=>{
        console.log("done we sent email....");
        
    })
    next()
})
app.get("/",(req,res,next)=>{
    res.send("hello world")
})
app.listen(process.env.PORT,()=>{
    dbconnect();
    console.log("http://localhost:"+process.env.PORT);
    
})