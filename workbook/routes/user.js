const express = require('express')
const router = express.Router();
const {
    ensureAuthenticated
} = require("../middleware/auth.js")
const User = require('../models/User.js')
const multer = require("multer");
const path = require('path')
const sharp = require('sharp');
const fs = require('fs')

// Setup Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    },
    fileFilter: function (req, file, cb) {

        if (file.mimetype !== 'jpeg') {
            cb(new Error(`Forbidden file type`));
        } else {
            cb(null, true);
        }
    },
})

// Setup multer
const upload = multer({
    storage: storage
}).single('image')

router.get('/add', ensureAuthenticated, async (req, res) => {
    try {
        res.render('user/add', {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            school: req.user.school,
            country: req.user.country,
            educationLevel: req.user.educationLevel,
            studyArea: req.user.studyArea,
            language: req.user.language,
            proficiency: req.user.proficiency,
        })
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

router.post('/add', upload, ensureAuthenticated, async (req, res) => {
    try {
        let imgName = req.body.imgName
        if (imgName != 'Change image') {
            await sharp("./public/uploads/" + req.file.filename).resize(300, 300, {
                fit: "cover",
                background: {
                    r: 250,
                    g: 250,
                    b: 250,
                }
            }).toFile("./public/uploads/avatar_" + req.file.filename)
            fs.unlinkSync("./public/uploads/" + req.file.filename)
            req.file.filename = 'avatar_' + req.file.filename
            await User.findOneAndUpdate({
                '_id': req.user.id
            }, {
                'image': req.file.filename
            })
        }

        req.body.user = req.user.id
        await User.findOneAndUpdate({
            '_id': req.user.id
        }, req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        let users = await User.find({
            '_id': req.params.id
        }).lean()

        res.render('user/profil', {
            users,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.find()
            .populate('user')
            .sort({
                createAt: 'desc'
            })
            .lean()

        res.render('user/index', {
            user,
        })

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.post('/', ensureAuthenticated, async (req, res) => {
    try {

        if (req.body.country && !req.body.language && !req.body.studyArea && !req.body.educationLevel) {
            user = await User.find({
                "country": req.body.country
            }).lean()
        } else if (req.body.language && !req.body.country && !req.body.studyArea && !req.body.educationLevel) {
            user = await User.find({
                "language": req.body.language
            }).lean()
        } else if (!req.body.language && !req.body.country && req.body.studyArea && !req.body.educationLevel) {
            user = await User.find({
                "studyArea": req.body.studyArea
            }).lean()
        } else if (!req.body.language && !req.body.country && !req.body.studyArea && req.body.educationLevel) {
            user = await User.find({
                "educationLevel": req.body.educationLevel
            }).lean()
        } else if (req.body.language && req.body.country && !req.body.studyArea && !req.body.educationLevel) {
            user = await User.find({
                "language": req.body.language,
                "country": req.body.country
            }).lean()
        } else if (req.body.language && !req.body.country && req.body.studyArea && !req.body.educationLevel) {
            user = await User.find({
                "language": req.body.language,
                "studyArea": req.body.studyArea
            }).lean()
        } else if (req.body.language && !req.body.country && !req.body.studyArea && req.body.educationLevel) {
            user = await User.find({
                "language": req.body.language,
                "educationLevel": educationLevel
            }).lean()
        } else if (!req.body.language && req.body.country && req.body.studyArea && !req.body.educationLevel) {
            user = await User.find({
                "country": req.body.country,
                "studyArea": req.body.studyArea
            }).lean()
        } else if (!req.body.language && req.body.country && !req.body.studyArea && req.body.educationLevel) {
            user = await User.find({
                "country": req.body.country,
                "educationLevel": req.body.educationLevel
            }).lean()
        } else if (!req.body.language && !req.body.country && req.body.studyArea && req.body.educationLevel) {
            user = await User.find({
                "studyArea": req.body.studyArea,
                "educationLevel": req.body.educationLevel
            }).lean()
        } else if (req.body.language && req.body.country && req.body.studyArea && !req.body.educationLevel) {
            user = await User.find({
                "language": req.body.language,
                "studyArea": req.body.studyArea,
                "country": req.body.country
            }).lean()
        } else if (req.body.language && req.body.country && !req.body.studyArea && req.body.educationLevel) {
            user = await User.find({
                "language": req.body.language,
                "educationLevel": req.body.educationLevel,
                "country": req.body.country
            }).lean()
        } else if (req.body.language && !req.body.country && req.body.studyArea && req.body.educationLevel) {
            user = await User.find({
                "language": req.body.language,
                "educationLevel": req.body.educationLevel,
                "studyArea": req.body.studyArea
            }).lean()
        } else if (!req.body.language && req.body.country && req.body.studyArea && req.body.educationLevel) {
            user = await User.find({
                "country": req.body.country,
                "educationLevel": req.body.educationLevel,
                "studyArea": req.body.studyArea
            }).lean()
        } else {
            user = await User.find({
                "country": req.body.country,
                "language": req.body.language,
                "studyArea": req.body.studyArea,
                "educationLevel": req.body.educationLevel,
            }).lean()
        }

        res.render("user/index", {
            user,
        });

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router