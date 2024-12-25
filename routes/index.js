let express = require("express");
let router = express.Router();

const auth = require("../middlewares/auth.js");
const multer = require("multer");

const rateLimit = require('express-rate-limit');
const { verifyTokenn } = require('../middlewares/auth.js'); 
// Multer storage setup for images (using memory storage)
const storageForImages = multer.memoryStorage(); 
const uploadImage = multer({ storage: storageForImages });

const storageForExcel = multer.memoryStorage(); 
const uploadExcel = multer({ storage: storageForExcel });
const upload = multer(); //
const storageForCSV = multer.memoryStorage(); 
const uploadCSV = multer({
  storage: storageForCSV,
  limits: { fileSize: 800 * 1024 * 1024 } 
});

let ctrlUsers = require("../controllers/users.controller.js");
let ctrlBooks = require("../controllers/book.controller.js");
let ctrlAdmin = require("../controllers/admin.controller.js")
const cartController = require('../controllers/addtocart.controller.js');
let ctrlOrder = require('../controllers/order.controller.js')
let ctrlReview = require ('../controllers/review.controller.js')
let ctrlCoupon = require ('../controllers/coupon.controller.js')
const limiter2 = rateLimit({
  windowMs: 1000, 
  max: 2, 
  message: 'Too many requests, please try again later.',
});

const limiter5 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: 'Too many requests, please try again later.',
});



// User authentication routes
router.route("/signup").post(ctrlUsers.SignUp);
router.route("/login").post(ctrlUsers.Login);

// Admin routes
router.route('/admin/register').post(ctrlAdmin.register) ;
// POST /api/admin/login
router.route('/admin/login').post(ctrlAdmin.login) ;

router.route("/admin/usersGetAll").get( ctrlUsers.usersGetAll);

// Book routes
// Add book route with image upload
router.route("/admin/addbook")
  .post( uploadImage.single('coverImage'), ctrlBooks.addBook);

// Update book route
router.route("/admin/updatebook/:id").put(upload.single('coverImage'), ctrlBooks.updateBook); 


router.route("/admin/deletebook/:id").delete(ctrlBooks.deleteBook);

// Get all books route (for testing purposes)
router.route("/books").post(ctrlBooks.getAllBooks);
router.route('/admin/book/:id').get( ctrlBooks.getBookById);
router.route("/category/:category").get(ctrlBooks.getAllBooksByCategory);
router.route("/books-on-sale").get(ctrlBooks.getBooksOnSale);
router.route('/best-sellers').get(ctrlBooks.getBestSellers);


//Cart Routes
router.route('/add').post(cartController.addToCart);
router.route('/removeFromCart/:bookId').delete(cartController.removeFromCart);
router.route('/getCart').get(cartController.getCart);
router.route('/saveAddress').post(cartController.saveAddressToCart);


//Review Routes
router.route('/addReview').post(verifyTokenn, ctrlReview.addReview);
router.route('/approveReview/:id').post(ctrlReview.approveReview);
router.route('/unapproveReview/:id').post(ctrlReview.unApproveReview);
router.route('/getAllReviews').get(ctrlReview.getAllReviews)


//Order Routes
router.route('/createOrder').post(ctrlOrder.createOrder);
router.route('/create-payment-intent').post(ctrlOrder.createIntent);
router.route('/admin/getAllOrders').get(ctrlOrder.getAllOrders)
router.route('/getOrderById/:id').get( ctrlOrder.getOrderById);
router.route('/deleteOrder/:id').delete( ctrlOrder.deleteOrderById);
router.route('/admin/orders/:id/status').put(ctrlOrder.updateOrderStatus);

//Coupon Routes
router.route('/admin/addCoupon').post(ctrlCoupon.Addcoupon);
router.route('/admin/deletecoupon/:code').delete( ctrlCoupon.DeleteCoupon);
router.route('/user/applydiscount').post(ctrlCoupon.ApplyDiscount);
router.route('/admin/getAllCoupons').get(ctrlCoupon.GetAllCoupons);




// Export the router
module.exports = router;
