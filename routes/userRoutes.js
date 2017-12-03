var express = require('express');
var router = express.Router();
var userRoutes = require('./users');

router.route('/').get(userRoutes.start);
router.route('/getUserList').post(userRoutes.getUserList);
router.route('/getUserOverview').post(userRoutes.getUserOverview);
router.route('/register').post(userRoutes.addNewUser);
router.route('/updateUserPw').post(userRoutes.updateUserPw);
router.route('/getDrinks').post(userRoutes.getDrinks);
router.route('/getUserDrinks').post(userRoutes.getUserDrinks);
router.route('/updateDrink').post(userRoutes.saveDrink);
router.route('/deleteDrink').post(userRoutes.deleteDrink);
router.route('/updateUserDrinks').post(userRoutes.updateUserDrinks);
router.route('/login').post(userRoutes.setUserLogin);
router.route('/loginWithToken').post(userRoutes.loginWithToken);
router.route('/checkAdmin').post(userRoutes.checkAdmin);
router.route('/getUserDetails').post(userRoutes.getUserDetails);
router.route('/getDailyWinners').post(userRoutes.getDailyWinners);

module.exports = router;