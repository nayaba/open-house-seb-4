const Listing = require('../models/listing')

const index = async (req, res) => {
    try {
        const listings = await Listing.find().populate('owner')
        res.render('listings/index.ejs', {
            title: 'Listings',
            listings: listings,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const newListing = (req, res) => {
    res.render('listings/new.ejs', {
        title: 'Add a Listing'
    })
}

const createListing = async (req, res) => {
    try {
        // req.body.owner = req.session.user._id
        req.body.owner = req.params.userId
        await Listing.create(req.body)
        res.redirect('/listings')
    } catch (error) {
        console.log(error)

    }
}

const show = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId).populate('owner')
        console.log(listing)
        res.render('listings/show.ejs', {
            title: listing.streetAddress,
            listing
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

module.exports = {
    index,
    newListing,
    createListing,
    show,
}