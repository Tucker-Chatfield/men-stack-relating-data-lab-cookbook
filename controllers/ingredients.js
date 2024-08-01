const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Ingredient = require('../models/ingredient.js');

router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ owner: req.session.user._id });
    console.log(ingredients);
    res.render('ingredients/index.ejs', { ingredients });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.get('/new', (req, res) => {
  res.render('ingredients/new.ejs');
});

router.post('/', async (req, res) => {
  try {
    const newIngredient = new Ingredient({
      name: req.body.name,
      quantity: req.body.quantity, // Make sure this line is present
      owner: req.session.user._id
    });
    await newIngredient.save();
    res.redirect('/ingredients');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});


module.exports = router;