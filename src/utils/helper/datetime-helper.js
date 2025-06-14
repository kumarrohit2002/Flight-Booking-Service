function compareTime(timeString1,timeString2){
    let dateTime1=new Date(timeString1);
    let dateTime2=new Date(timeString2);
    if (isNaN(dateTime1) || isNaN(dateTime2)) {
        throw new AppError(['Invalid datetime format'], StatusCodes.BAD_REQUEST);
    }
    return dateTime1.getTime()>dateTime2.getTime();
}

module.exports={
    compareTime
}