const {StatusCodes}=require('http-status-codes');

const {BookingService} = require('../services');
const {ErrorResponse,SuccessResponse} =require('../utils/common');
 
const inMemDb={};

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

async function makePayment(req,res) {
     try {
        const idempotencyKey=req.headers['x-idempotency-key'];

        if(!idempotencyKey){
            res.status(StatusCodes.BAD_REQUEST).json({message:'idempotencyKey is missing'})
        }
        if(inMemDb[idempotencyKey]){
            res.status(StatusCodes.BAD_REQUEST).json({message:'can not retry on successful payment'})
        }

        const response=await BookingService.makePayment({
            totalCost:req.body.totalCost,
            userId:req.body.userId,
            bookingId:req.body.bookingId,
        })
        inMemDb[idempotencyKey]=idempotencyKey;
        SuccessResponse.data=response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


module.exports={
   createBooking,
   makePayment
}