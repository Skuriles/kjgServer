var express = require('express');
var router = express.Router();
var userRoutes = require('./users_routes');
var drinkRoutes = require('./drinks_routes');
var programRoutes = require('./program_routes');
var pushRoutes = require('./push_routes');
var rulesRoutes = require('./rules_routes');

router.route('/').get(userRoutes.start);
router.route('*').get(userRoutes.start);
router.route('/getUserList').post(userRoutes.getUserList);
router.route('/getRoles').post(userRoutes.getRoles);
router.route('/getUserOverview').post(userRoutes.getUserOverview);
router.route('/register').post(userRoutes.addNewUser);
router.route('/updateUser').post(userRoutes.updateUser);
router.route('/deleteUser').post(userRoutes.deleteUser);
router.route('/login').post(userRoutes.setUserLogin);
router.route('/loginWithToken').post(userRoutes.loginWithToken);

// drink routes
router.route('/getDailyLeaders').post(drinkRoutes.getDailyLeaders);
router.route('/getDrinks').post(drinkRoutes.getDrinks);
router.route('/getUserDrinks').post(drinkRoutes.getUserDrinks);
router.route('/updateDrink').post(drinkRoutes.saveDrink);
router.route('/addUserDrink').post(drinkRoutes.addUserDrink);
router.route('/deleteDrink').post(drinkRoutes.deleteDrink);

// program routes
router.route('/deleteDay').post(programRoutes.deleteDay);
router.route('/updateDay').post(programRoutes.updateDay);
router.route('/getDays').post(programRoutes.getDays);
router.route('/getProgramPoints').post(programRoutes.getProgramPoints);
router.route('/updateProgramPoint').post(programRoutes.updateProgramPoint);
router.route('/deleteProgramPoint').post(programRoutes.deleteProgramPoint);
router.route('/getJobs').post(programRoutes.getJobs);
router.route('/updateJob').post(programRoutes.updateJob);
router.route('/deleteJob').post(programRoutes.deleteJob);

// rules route
router.route('/deleteRule').post(rulesRoutes.deleteRule);
router.route('/updateRule').post(rulesRoutes.updateRule);
router.route('/getRules').post(rulesRoutes.getRules);
router.route('/deleteTeamRule').post(rulesRoutes.deleteTeamRule);
router.route('/updateTeamRule').post(rulesRoutes.updateTeamRule);
router.route('/getTeamRules').post(rulesRoutes.getTeamRules);


//upload
router.route('/upload').post(programRoutes.upload);

//download
router.route('/attachments/:id/:fileName').post(programRoutes.download);

// push routes
router.route('/webpush').post(pushRoutes.webpush);
router.route('/send').post(pushRoutes.send);

module.exports = router;
