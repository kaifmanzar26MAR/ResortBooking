import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
  doneBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  date_of_event:{
    type:Number,
    required:true
  },
  time_of_event:{
    type:Number,
    required:true
  },
  number_of_member:{
    type:Number,
    required:true,
    default:1
  }
},{timestamps:true});

export const Reservation = mongoose.model("Reservation", reservationSchema);
