const { validationResult } = require('express-validator');
const fs = require('fs');

const Property = require('../model/Property');
const User = require('../model/User');

exports.createProperty = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    if (req.file) {
      fs.unlink(req.file.path, err => {
        console.log(err);
      });
    }
    return res.status(400).json({ errors: error.array() });
  }
  const propertyFields = {};
  propertyFields.user = req.userId;
  propertyFields.tokenId = Math.floor(Math.random() * 10000000000) + 1;
  if (req.body.price) propertyFields.price = req.body.price;
  if (req.body.location) propertyFields.location = req.body.location;
  if (req.body.description) propertyFields.description = req.body.description;
  const image = req.file;
  if (!image) {
    return res.status(422).json({ msg: 'Attached file is not an image ' });
  }
  propertyFields.image = image.path;
  try {
    const property = new Property(propertyFields);
    await property.save();
    return res.json(property);
  } catch (error) {
    console.log(error.message);
    if (req.file) {
      fs.unlink(req.file.path, err => {
        console.log(err);
      });
    }
    res.status(500).send('Server error');
  }
};

exports.getAllProperty = async (req, res, next) => {
  try {
    const property = await Property.find().populate('user', ['name']);
    if (!property) {
      return res.status(400).json({ msg: 'No Property found ' });
    }
    return res.json(property);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.getSingleProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      _id: req.params.propId,
    }).populate('user', ['name']);
    if (!property) {
      return res.status(400).json({ msg: 'No Property found ' });
    }
    return res.json(property);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.updateProperty = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const propertyFields = {};
  if (req.body.price) propertyFields.price = req.body.price;
  if (req.body.location) propertyFields.location = req.body.location;
  if (req.body.description) propertyFields.description = req.body.description;

  try {
    let property = await Property.findOne({ user: req.userId });
    if (property) {
      //for updating property
      property = await Property.findOneAndUpdate(
        { _id: req.params.propId },
        { $set: propertyFields },
        { new: true }
      );
      return res.json(property);
    } else {
      return res.status(400).json({ msg: 'No Property found ' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};
//Set offer for property

exports.createOffer = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  try {
    const user = await User.findOne({ _id: req.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'user not found' });
    }
    const offer = {
      user: user._id,
      offerValue: req.body.offerValue,
      accept: false,
      account: req.params.userAcc,
    };
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    if (
      property.offers.filter(offer => offer.user.toString() === req.userId)
        .length > 0
    ) {
      property.offers = property.offers.filter(
        offer => offer.user.toString() !== req.userId
      );
    }
    property.offers.unshift(offer);
    await property.save();

    return res.json(property.offers);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'objectId') {
      return res.status(404).json({ msg: 'property not found' });
    }
    res.status(500).send('Server error');
  }
};

//Accept Property Offer

exports.acceptOffer = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propId);
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }

    const offer = property.offers.filter(
      offer => offer._id.toString() === req.params.offerId
    );
    if (!offer) {
      return res.status(404).json({ msg: 'offer not found' });
    }

    property.offers = property.offers.filter(
      offer => offer._id.toString() !== req.params.offerId
    );

    const [off] = offer;
    console.log(off);
    off.accept = req.params.offer;

    property.offers.unshift(off);

    await property.save();
    return res.json(property.offers);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'objectId') {
      return res.status(404).json({ msg: 'property not found' });
    }
    res.status(500).send('Server error');
  }
};

// sell Property

exports.sellProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      { _id: req.params.propId },
      { $set: { user: req.userId } },
      { new: true }
    );

    property.offers = property.offers.filter(
      offer => offer.user.toString() !== req.userId
    );
    await property.save();
    res.json(property);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

//Delete the Property of the  goof USER

exports.deleteProperty = async (req, res, next) => {
  try {
    await Property.findOneAndDelete({ _id: req.params.propId });

    return res.json({ msg: 'Property Deleted SuccessFully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};
