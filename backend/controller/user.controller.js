import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";

function containsHTMLTags(args) {
  const htmlRegex = /<[^>]*>/; // Regular expression to match HTML tags
  return htmlRegex.test(args);
}

const registerUser = asyncHandler(async (req, res) => {
  //get user details form frontend
  const { username, email, fullname, password } = req.body;

  // vlaidation - not emapty
  if (
    [username, email, fullname, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(500, "All fields are required");
  }

  if(containsHTMLTags(username) || containsHTMLTags(email) || containsHTMLTags(fullname)){
    throw new ApiError(400, "Invalid input!!")
  }


  // console.log("email", email);
  // console.log("body", req.body)
  // is user exists alerady
  const isuserpresent = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isuserpresent) {
    throw new ApiError(500, "User exists with this email");
  }

  //getting localpath of the files //check for images and avtars
  // console.log(req.files);
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // let coverImageLocalPath;

  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }
  // if (!avatarLocalPath) {
  //   throw new ApiError(500, "Not found Avatar");
  // }

  // //upload image and avatar in cloudinary
  // console.log(avatarLocalPath, coverImageLocalPath)
  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // // let coverImage=null;
  // // if(coverImageLocalPath)
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //  console.log("cv",coverImage, "av", avatar)
  // if (!avatar) {
  //   throw new ApiError(500, "Avtar not found");
  // }

  //create user object entry in mongodb

  const newUser = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    password
  });

  //removing password and refersh token from response
  const user = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  //check for user creation
  console.log(user);
  if (!user) {
    throw new ApiError(
      500,
      "Something went worng while registering the user!!"
    );
  }

  //return res
  return res
    .status(201)
    .json(new ApiResponse(200, user, "User Registerd Successfully"));
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findOne({_id:userId});
    // console.log(user)
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    // console.log(accessToken, refreshToken)
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error)
    throw new ApiError(
      500,
      "Something went wrong while generation refersh and access token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  // console.log(email,username)
  if (!username && !email) {
    throw new ApiError(400, "username or eamil is required!!");
  }


  if(containsHTMLTags(username) || containsHTMLTags(email)){
    throw new ApiError(500, "Invalid Input!!");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(500, "User does not exist!!");
  }

  const passwordCheck = await user.isPasswordCorrect(password);

  if (!passwordCheck) {
    throw new ApiError(500, "Invalid user credential");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInuser = await User
    .findOne({_id:user._id})
    .select("-password -refreshToken");

  //sending cookies

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInuser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});


const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req?.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async(req, res) => {
  const user= await User.findOne({_id:req.user._id}).populate('reservations')
  // console.log(user)
  return res.status(200).json(new ApiResponse(200, user, "current user fetched successfully"))
})
const getAllUsers = asyncHandler(async(req, res) => {
  const allUsers = await User.find();
  if (!allUsers) {
    throw new ApiError(
      500,
      "Something Went wrong while getting users"
    );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        allUsers,
        "User request get successfully"
      )
    );
});
const getUserById = asyncHandler(async (req, res) => {
  // console.log("func arrive")
  const { user_id } = req.body;
  // console.log(user_id)

  if ([user_id].some((field) => field.trim() === "")) {
    throw new ApiError(500, "Provided id is not in proper format!");
  }
  // console.log("reached here");

  const user = await User.findOne({ _id: user_id }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(500, "Enter a valid User ID");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, user, "Got the user Successfully"));
});

export { registerUser, loginUser,logoutUser,refreshAccessToken, changeCurrentPassword,getCurrentUser,getAllUsers,getUserById};
