import express from "express";
import {
    createPin,
    followController,
    getImages,
    getPinDetail,
    likeController,
} from "../controllers/pinCreateControllers";
import { verifyToken } from "../middlewares/jwt";
import { uploadSingle } from "../service/aws";
import { validateBody } from "../middlewares/validateBody";
import { createPinValidation } from "../middlewares/validations/pinValidations";

const router = express.Router();

router.post(
    "/create/pin",
    verifyToken,
    uploadSingle,
    validateBody(createPinValidation),
    createPin
);

// Get all images
router.get("/getimages", getImages);

// Get Pin Detail
router.get("/getimages/:id", verifyToken, getPinDetail);

// Like or Unlike Pin
router.post(
    "/pin/:id/like",
    verifyToken,

    likeController
);

// Follow or Unfollow User
router.post(
    "/users/:id/follow",
    verifyToken,

    followController
);

export default router;
