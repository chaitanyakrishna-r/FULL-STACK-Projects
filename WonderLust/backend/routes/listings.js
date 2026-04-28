const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const { validateListing, isLoggedIn, isOwner } = require('../utils/middleware.js');

const listingsController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
// const uploads = multer({dest:'uploads/'})
const upload = multer({storage});


// =====================
// Listings Collection Routes
// =====================

// GET  /listing  → Show all listings
// POST /listing  → Create a new listing
router.route('/')
    .get(wrapAsync(listingsController.index))
    .post(
        isLoggedIn,
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingsController.createListing)
    );
    // .post(upload.single('listing[image]'),(req,res)=>res.send(req.file));

// =====================
// New Listing Form
// =====================


// GET /listing/new → Render form to create new listing
router.get(
    '/new',
    isLoggedIn,
    listingsController.renderNewListing
);


// =====================
// Single Listing Routes
// =====================

// GET    /listing/:id → Show a specific listing
// PATCH  /listing/:id → Update listing
// DELETE /listing/:id → Delete listing
router.route('/:id')
    .get(wrapAsync(listingsController.showListing))   
    .patch(
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingsController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingsController.destroyListing)  
    );

// =====================
// Edit Listing Form
// =====================

// GET /listing/:id/edit → Render edit form
router.get(
    '/:id/edit',
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditListing)
);


module.exports = router;