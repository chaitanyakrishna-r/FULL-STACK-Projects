const User = require('../models/user');

//signUp
module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req,res,next)=>{
    try{
        const {username, email, password} = req.body;
        const newUser = new User({email,username})
        const regsiteredUser = await User.register(newUser,password);
        // console.log(regsiteredUser);
       req.login(regsiteredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","welcome to WonderLust!");
         res.redirect("/listing")
       })
       ;
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
}

//logIn
module.exports.renderLogIn = (req,res)=>{
    res.render("users/login");
}

module.exports.logIn = async(req,res)=>{ 
   req.flash("success","Welcome back to WonderLust");
    let redirectUrl = res.locals.redirectUrl || "/listing";//fall back to listings
   res.redirect(redirectUrl);
     
}

//logOut
module.exports.logOut = (req,res,next)=>{
    //req.logout is methods added by passport
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/");
    });
    
}