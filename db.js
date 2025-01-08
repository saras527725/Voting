const mongoose=require('mongoose')
require('dotenv').config();
const mongourl= process.env.MONGODB_URL_LOCAL
// const mongourl= mongodb+srv://Saras:<db_527725>@cluster0.x4oza.mongodb.net/
console.log("MongoDB URL:", mongourl);
mongoose.connect( mongourl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});
// mongoose mantain a default connection object represented the mongoDB connection
const db=mongoose.connection;
 
// event listner (optional) , also these words are prefixed (connected,diconnected,error)
db.on('connected',()=>{
    console.log('connected to mongoDB server')
})
 
db.on('error',(err)=>{
    console.log('error occur',err)
})
 
db.on('disconnected',()=>{
    console.log('disconnected to mongoDB server')
})

module.exports =db;