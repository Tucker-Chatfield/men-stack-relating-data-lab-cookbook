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

// Edit route
router.get('/:id/edit', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (ingredient.owner.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }
    res.render('ingredients/edit.ejs', { ingredient });
  } catch (error) {
    console.error(error);
    res.redirect('/ingredients');
  }
});

// Update route
router.put('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (ingredient.owner.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }
    await Ingredient.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      quantity: req.body.quantity
    });
    res.redirect('/ingredients');
  } catch (error) {
    console.error(error);
    res.redirect('/ingredients');
  }
});

// Delete route
router.delete('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (ingredient.owner.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }
    await Ingredient.findByIdAndDelete(req.params.id);
    res.redirect('/ingredients');
  } catch (error) {
    console.error(error);
    res.redirect('/ingredients');
  }
});

module.exports = router;