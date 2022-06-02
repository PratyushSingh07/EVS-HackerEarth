const mongoose=require('mongoose')
const mogoURI='mongodb://localhost:27017'

const connectToLocalMongo= ()=>{
    mongoose.connect(mogoURI,()=>{
        console.log("Connected to my mongoDB successfully")
    }) 
}

module.exports=connectToLocalMongo;//cant write it as connectToLocalMongo()