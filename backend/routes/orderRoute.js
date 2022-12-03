const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {isAuthenicated,authorizedRoles} = require("../middleware/auth");

router.route("/order/new")
.post(isAuthenicated,authorizedRoles('admin'),orderController.placeorder);

router.route("/order/singleorder/:id")
.get(isAuthenicated,authorizedRoles('admin'),orderController.singleOrder);

router.route("/order/all")
.get(isAuthenicated,authorizedRoles('admin'),orderController.getAllOrders)

router.route("/order/me")
.get(isAuthenicated,authorizedRoles('user'),orderController.myOrders);

router.route("/order/:id")
.get(isAuthenicated,authorizedRoles('admin'),orderController.updateOrder);

// router.route("/getstock/:id").get(orderController.getstock)

module.exports = router;