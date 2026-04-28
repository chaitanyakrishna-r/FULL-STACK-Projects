const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../utils/middleware');
const userController = require('../controllers/auth');


//signup
router.route('/signup')
.get(userController.renderSignUp)
.post(wrapAsync(userController.signUp));

//login
router.route("/login")
.get(userController.renderLogIn)
.post(saveRedirectUrl,
passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login",
}),userController.logIn);


//logout
router.get("/logout",userController.logOut)
module.exports = router;