const mongoose=require('mongoose');
const connectDB=async(env)=>{
    mongoose.connect(env.parsed.MONGODB_URI,{
        useUnifiedTopology:true,
        useNewUrlParser:true,
        dbName: 'DORA'
    }).then(function success(oData){
        console.log("DB connected");
        // console.log(oData);
    }).catch(err => console.log(err)); 

}
module.exports=connectDB;