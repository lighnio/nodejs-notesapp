const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password} = req.body;
    const errors = [];
    if(password != confirm_password){
        errors.push({text: 'Password do not match'});
    }

    if(name.length <= 0){
        errors.push({text: 'Please insert a valid name'});
    }

    if(password.length < 4){
        errors.push({text: 'Password must beat least 4 characters'});
    }

    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else{
        const emailUser = await User.findOne({email: email});

        console.log("valor de email user:", emailUser);

        if(emailUser){
            req.flash('error_msg', 'The email is already in use.');
            //  console.log("REDIRECCIONANDO");
            res.redirect('/users/signup');
        }else{
            const newUser = new User({name, email, password});
            //console.log("newUser:::", newUser);
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Youre  registered.');
            res.redirect('/users/signin');
        }
        
    }

});

module.exports = router;