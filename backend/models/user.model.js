import mongoose, { Schema } from "mongoose";
// import pkg from 'jsonwebtoken';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'
dotenv.config({
  path:"server/.env"
})
// const { Jwt } = pkg;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    refreshToken: {
      type: String,
    },
    reservations:[
      {
        type:Schema.Types.ObjectId,
        ref:"Reservation"
      }
    ]
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  // const exin=process.env.ACCESS_TOKEN_EXPIREY;
  // console.log(exin, process.env.ACCESS_TOKEN_EXPIREY);

  return jwt.sign(
    {
      //  data to add in token
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIREY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      //  data to add in token
      _id: this._id,
    },
    process.env.REFERSH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFERSH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
