const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.route('/') 
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(upload.single('image'), (req, res) => {
        console.log(req.body, req.files)
        res.send('It worked!')
    })

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;