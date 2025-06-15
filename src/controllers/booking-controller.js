const {StatusCodes}=require('http-status-codes');

const {BookingService} = require('../services');
const {ErrorResponse,SuccessResponse} =require('../utils/common');

/*
#post: /flights
#req.body={flightId}

*/
async function createBooking(req,res) {
     try {
        const response=await BookingService.createBooking({
            flightId:req.body.flightId,
            userId:req.body.userId,
            noOfSeats:req.body.noOfSeats,
        })

        SuccessResponse.data=response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


module.exports={
   createBooking
}