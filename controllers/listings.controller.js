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
    console.log(req.file)
    try {
        // req.body.owner = req.session.user._id
        req.body.imgUrl = {
            url: req.file.path, // Cloudinary URL
            cloudinary_id: req.file.filename, // Cloudinary public ID
        }
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
        
        const userHasFavorited = listing.favoritedByUsers.some((user) => user.equals(req.session.user._id))

        res.render('listings/show.ejs', {
            title: listing.streetAddress,
            listing,
            userHasFavorited
        })

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId) // find the listing

        if (listing.owner.equals(req.params.userId)) { // check if signed in user and listing owner are the same
            await listing.deleteOne() // delete the listing
            res.redirect('/listings')
        } else {
            res.send("You don't have permission to do that.") // if owner and signed in user are different - send message
        }

    } catch(error) {
        console.log(error)
        res.redirect('/')
    }
}

const edit = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId).populate('owner')
        if(listing.owner.equals(req.params.userId)) {
            res.render('listings/edit.ejs', {
                title: `Edit ${listing.streetAddress}`,
                listing
            })
        } else {
            res.send("You don't have permission to do that.") // if owner and signed in user are different - send message
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const update = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.listingId,
            req.body,
            { new: true }
        )
        res.redirect(`/listings/${listing._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const addFavorite = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.listingId, {
            $push: { favoritedByUsers: req.params.userId }
        })
        res.redirect(`/listings/${listing._id}`)
       
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const removeFavorite = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { favoritedByUsers: req.params.userId }
        })
        res.redirect(`/listings/${listing._id}`)
       
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
    deleteListing,
    edit,
    update,
    addFavorite,
    removeFavorite,
}