const CrudRepository =require('./curd-repository');
const {Booking}=require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const {Enums}=require('../utils/common')
const {BOOKED,CANCELLED}=Enums.BOOKING_STATUS;
const {Op}=require('sequelize')

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data,transaction){
        const response=await Booking.create(data,{transaction:transaction});
        return response;
    }

    async get(data,transaction){
        const response=await Booking.findByPk(data,{transaction:transaction});
        if(!response){
            throw new AppError('Not able to find the resorce',StatusCodes.NOT_FOUND)
        }
        return response;
    }

     async update(id,data,transaction){ //data:{col:val,.....}
        const response=await Booking.update(data,{
            where:{
                id:id
            }
        },{transaction:transaction});
        return response;
    }

    async cancelOldBooking(timeStramp){
        const response=await Booking.update({status:CANCELLED},{
                where:{
                    [Op.and]:[
                        {
                            createdAt:{
                                [Op.lt]:timeStramp
                            }
                        },
                        {
                            status:{
                                [Op.ne]:BOOKED
                            }
                        },
                        {
                            status:{
                                [Op.ne]:CANCELLED
                            }
                        },
                    ]
                }
            }
        )

        return response;
    }

   
}

module.exports=BookingRepository;