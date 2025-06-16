const CrudRepository =require('./curd-repository');
const {Booking}=require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data,transaction){
        const response=await Booking.create(data,{transaction:transaction});
        return response;
    }

    async get(data,transaction){
        const response=await this.model.findByPk(data,{transaction:transaction});
        if(!response){
            throw new AppError('Not able to find the resorce',StatusCodes.NOT_FOUND)
        }
        return response;
    }


   
}

module.exports=BookingRepository;