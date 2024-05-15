import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const send_reservation = asyncHandler(async (req, res)=> {
  const { date_of_event, time_of_event, number_of_member } = req.body;
// console.log(req.body)

  if (!date_of_event || !time_of_event || !number_of_member) {
    throw new ApiError(500, "Please Fill Full Reservation Form!");
  }

   const reservationInstance= await Reservation.create({
      doneBy:req.user._id,
      date_of_event,
      time_of_event,
      number_of_member,
    });

    if(!reservationInstance) throw new ApiError(500, "Something went worng in the creation of Reservation!!")

    req.user.reservations.push(reservationInstance._id);

    await req.user.save();

    // console.log(req.user)

    res.status(201).json(new ApiResponse(200,reservationInstance, "Reservtion done successfully!!" ));
 
});

export default send_reservation;
