var express = require('express');
var router = express.Router();
var userRoutes = require('./users_routes');
var drinkRoutes = require('./drinks_routes');

router.route('/').get(userRoutes.start);
router.route('/getUserList').post(userRoutes.getUserList);
router.route('/getRoles').post(userRoutes.getRoles);
router.route('/getUserOverview').post(userRoutes.getUserOverview);
router.route('/register').post(userRoutes.addNewUser);
router.route('/updateUser').post(userRoutes.updateUser);
router.route('/login').post(userRoutes.setUserLogin);
router.route('/loginWithToken').post(userRoutes.loginWithToken);
router.route('/getUserDetails').post(userRoutes.getUserDetails);

// drink routes
router.route('/getDailyWinners').post(drinkRoutes.getDailyWinners);
router.route('/getDrinks').post(drinkRoutes.getDrinks);
router.route('/getUserDrinks').post(drinkRoutes.getUserDrinks);
router.route('/updateDrink').post(drinkRoutes.saveDrink);
router.route('/addUserDrink').post(drinkRoutes.addUserDrink);
router.route('/deleteDrink').post(drinkRoutes.deleteDrink);
router.route('/updateUserDrinks').post(drinkRoutes.updateUserDrinks);

module.exports = router;