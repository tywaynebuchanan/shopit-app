const express = require('express');
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const router = express.Router();

router.route('/createproduct')
.post(auth.isAuthenicated,auth.authorizedRoles('admin'),productController.createProduct)

router.route('/products').get(productController.getProducts);

router.route('/product/:id').post(productController.getProductById);

router.route('/deleteproduct/:id').delete(auth.isAuthenicated,auth.authorizedRoles('admin'),
productController.deleteProduct);

router.route('/review/add/:id')
.put(auth.isAuthenicated,productController.addreview);

router.route('/reviews')
.get(auth.isAuthenicated,auth.authorizedRoles('admin'),productController.getallreviews)

// router.route('/reviews/delete')
// .delete(auth.isAuthenicated,auth.authorizedRoles('admin'),productController.deletereview);

module.exports = router;