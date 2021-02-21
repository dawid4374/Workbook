const express = require('express')
const router = express.Router();
const passport = require('passport')
const bcrypr = require('bcryptjs')
const {
    ensureAuthenticated,
    forwardAuthenticated
} = require("../middleware/auth.js")
const User = require('../models/User')

router.get('/', forwardAuthenticated, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const users = await User.find({
            '_id': req.user.id
        }).lean()
        res.render('dashboard', {
            users,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register', {
        layout: 'login'
    })

})

router.all('/register', (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    } = req.body
    let errors = [];

    //Check required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        errors.push({
            msg: 'Please fill in all fields'
        })
    }

    //Check password match
    if (password !== confirmPassword) {
        errors.push({
            msg: 'Passwords do not match'
        })
    }

    //Check password length
    if (password.length < 6) {
        errors.push({
            msg: 'Password should be at least 6 characters'
        })
    }

    if (errors.length > 0) {
        res.render('register', {
            layout: 'login',
            errors,
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        })
    } else {
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    //user exists
                    errors.push({
                        msg: 'Email is already registered'
                    })
                    res.render('register', {
                        layout: 'login',
                        errors,
                        firstName,
                        lastName,
                        email,
                        password,
                        confirmPassword
                    })
                } else {
                    const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        password
                    })

                    //hash password
                    bcrypr.genSalt(10, (err, salt) => bcrypr.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        //set password to hashed
                        newUser.password = hash
                        //save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are registered, please log in')
                                res.redirect('/')
                            })
                            .catch(err => console.log(err))
                    }))
                }
            })
    }

})

//Login handle
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next)
})

//Logout handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are loged out')
    res.redirect('/')
})

module.exports = router