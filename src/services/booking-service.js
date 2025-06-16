const axios = require('axios');
const { BookingRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const {Enums}=require('../utils/common')
const {BOOKED,CANCELLED,INITIATED,PENDING}=Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

const { ServerConfig } = require('../config');
const db = require('../models')

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {

        let flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);

        flight = flight.data.data;
        if (data.noOfSeats > flight.totalSeats) {
            throw new AppError(['Required no of Seats no available'], StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = data.noOfSeats * flight.price;

        const bookingPayload = { ...data, totalCost:totalBillingAmount }
        const booking = await bookingRepository.createBooking(bookingPayload,transaction);

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{seats:data.noOfSeats,dec:true}); 

        await transaction.commit();
        return booking;
 
    } catch (error) {
        await transaction.rollback();
        throw error;
        // throw new AppError(['Something went wrong Can not make Booking'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function makePayment(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetals=await bookingRepository.get(data.bookingId,transaction);
        const bookingTime=new Date(bookingDetals.createdAt);
        const currentTime=new Date();

        if(currentTime-bookingTime > 300000){ // 5 min
                await bookingRepository.update(data.bookingId,{status:CANCELLED},transaction);
            throw new AppError('booking has expire',StatusCodes.BAD_REQUEST)
        }

        if(bookingDetals.totalCost != data.totalCost){
            throw new AppError('the amount of the payment does not match',StatusCodes.BAD_REQUEST)
        }
        if(bookingDetals.userId != data.userId){
            throw new AppError('the User corresponding to the booking  does not match',StatusCodes.BAD_REQUEST)
        }
        await bookingRepository.update(data.bookingId,{status:BOOKED},transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment
}