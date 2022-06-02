const connectToLocalMongo=require('./db');//importing the db.js file
const express = require('express')
connectToLocalMongo();//calling the function from db.js 
const app = express()
const port=3000

app.use(express.json())
// Available routes
app.use('/api/auth',require('./routes/auth'))


app.listen(port,()=>{
    console.log("Port listening at 3000")
})