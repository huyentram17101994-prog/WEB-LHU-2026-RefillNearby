const express = require("express");

const router = express.Router();

const {

    registerNotification

} = require("../controllers/productNotification.controller");

const {

    verifyToken

} = require("../middlewares/auth.middleware");

router.post(

    "/register",

    verifyToken,

    registerNotification

);

module.exports = router;