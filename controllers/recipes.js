const express = require('express');
const router = express.Router();

const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// Index route
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.render('recipes/index.ejs', { recipes });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// New route
router.get('/new', async (req, res) => {
  try {
    // Fetch all ingredients to populate the select dropdown
    const ingredients = await Ingredient.find({});
    res.render('recipes/new.ejs', { ingredients });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create route
router.post('/', async (req, res) => {
  try {
    // Create the new recipe with selected ingredients
    await Recipe.create({
      name: req.body.name,
      instructions: req.body.instructions,
      ingredients: req.body.ingredients, 
      user: req.session.user._id 
    });
    res.redirect('/recipes');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Show route
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user').populate('ingredients');
    res.render('recipes/show.ejs', { recipe });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit route
router.get('/:id/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const ingredients = await Ingredient.find({});
    res.render('recipes/edit.ejs', { recipe, ingredients });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update route
router.put('/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/recipes/${req.params.id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete route
router.delete('/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndRemove(req.params.id);
    res.redirect('/recipes');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;