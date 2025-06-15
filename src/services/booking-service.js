const axios = require('axios');
const { BookingRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

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
        console.log(totalBillingAmount);

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

module.exports = {
    createBooking
}