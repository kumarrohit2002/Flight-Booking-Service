const express=require('express');
const apiRoutes=require('./routes');
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const {ServerConfig,Logger}=require('./config');

const cron=require('node-cron');
const {BookingService}=require('./services')
// const CRON=require('./utils/common/cron-jobs')

app.use('/api',apiRoutes);


async function scheduleCrons(){
    cron.schedule('*/10 * * * *',async()=>{ // 10 min
        await BookingService.cancelOldBooking();
        console.log('cron Again start')
    })
}

app.get('/',(req,res)=>{
    res.status(200).json({message:'Server is running succesfully!!!'});
})

app.listen(ServerConfig.PORT,()=>{
    console.log(`Server is Runing Successfully on Url:http://localhost:${ServerConfig.PORT}`);
    // CRON();
    scheduleCrons()
})

