const express=require('express');
const apiRoutes=require('./routes');
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const {ServerConfig,Logger}=require('./config');

app.use('/api',apiRoutes);



app.get('/',(req,res)=>{
    res.status(200).json({message:'Server is running succesfully!!!'});
})

app.listen(ServerConfig.PORT,()=>{
    console.log(`Server is Runing Successfully on Url:http://localhost:${ServerConfig.PORT}`);
})

