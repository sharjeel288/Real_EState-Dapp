const express = require('express');
const { check } = require('express-validator');

const auth = require('../middleware/is-auth');
const fileUpload = require('../middleware/file-upload');
const propertyController = require('../controllers/property');

const router = express.Router();
//POST::
//api/property/  to post the property in DB
router.post(
  '/',
  [
    auth,
    fileUpload.single('image'),
    [
      check('price', 'price is required or price is in Decimal number !!! !')
        .isNumeric({ no_symbols: true })
        .not()
        .isEmpty(),
      check('location', 'location is required or too long !')
        .isLength({ max: 50 })
        .not()
        .isEmpty(),
    ],
  ],
  propertyController.createProperty
);
//GET::
//api/property to get all the posts
router.get('/', auth, propertyController.getAllProperty);

//POST::
//api/property/offer/:id to set the offer for property

router.post(
  '/offer/:id',
  [
    auth,
    [
      check(
        'offerValue',
        'offer value is Required or Offer value is in Decimal number !!! !'
      )
        .isNumeric({ no_symbols: true })
        .not()
        .isEmpty(),
    ],
  ],
  propertyController.createOffer
);

//GET::
//api/property/:propId to get the single Property
router.get('/:propId', auth, propertyController.getSingleProperty);

//PUT::
//api/property/:propId to edti the single Property
router.put(
  '/:propId',
  [
    auth,
    [
      check('price', 'price is required or price is in Decimal number !!!')
        .isNumeric({ no_symbols: true })
        .not()
        .isEmpty(),
      check('location', 'location is required or too long !')
        .isLength({ max: 50 })
        .not()
        .isEmpty(),
    ],
  ],
  propertyController.updateProperty
);

//GET::
//api/property/sell/:propId to sell the property

router.get('/sell/:propId', auth, propertyController.sellProperty);

//Delete::
//api/property/delete/:propId to delete the property

router.delete('/delete/:propId', auth, propertyController.deleteProperty);

module.exports = router;
