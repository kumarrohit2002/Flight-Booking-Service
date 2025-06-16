const cron=require('node-cron');

async function scheduleCrons(){
    cron.schedule('*/5 * * * * *',async()=>{
        console.log('cron Again start')
    })
}

module.exports=scheduleCrons;