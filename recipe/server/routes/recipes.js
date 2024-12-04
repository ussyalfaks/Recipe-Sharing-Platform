import express from 'express';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new recipe
router.post('/recipes', auth, async (req, res) => {
  try {
    const recipe = new Recipe({ ...req.body, author: req.user.id });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

// Get all recipes
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// Get a specific recipe
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'name');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

// Update a recipe
router.put('/recipes/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe' });
  }
});

// Delete a recipe
router.delete('/recipes/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await recipe.remove();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

// Add a recipe to favorites
router.post('/recipes/:id/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(req.params.id)) {
      user.favorites.push(req.params.id);
      await user.save();
    }
    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding recipe to favorites' });
  }
});

// Rate a recipe
router.post('/recipes/:id/rate', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    const ratingIndex = recipe.ratings.findIndex(r => r.user.toString() === req.user.id);
    if (ratingIndex > -1) {
      recipe.ratings[ratingIndex].rating = req.body.rating;
    } else {
      recipe.ratings.push({ user: req.user.id, rating: req.body.rating });
    }
    
    await recipe.save();
    res.json({ message: 'Rating added successfully', averageRating: recipe.averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Error rating recipe' });
  }
});

// Add a comment to a recipe
router.post('/recipes/:id/comment', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    recipe.comments.push({ user: req.user.id, text: req.body.text });
    await recipe.save();
    
    const populatedRecipe = await Recipe.findById(req.params.id).populate('comments.user', 'name');
    res.json({ message: 'Comment added successfully', comments: populatedRecipe.comments });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Search recipes
router.get('/search', async (req, res) => {
  try {
    const { query, difficulty, cuisineType } = req.query;
    let searchQuery = {};
    if (query) searchQuery.$or = [
      { title: new RegExp(query, 'i') },
      { ingredients: new RegExp(query, 'i') }
    ];
    if (difficulty) searchQuery.difficulty = difficulty;
    if (cuisineType) searchQuery.cuisineType = cuisineType;
    const recipes = await Recipe.find(searchQuery).populate('author', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

// Get trending recipes
router.get('/trending', async (req, res) => {
  try {
    const recipes = await Recipe.aggregate([
      { $addFields: { ratingCount: { $size: "$ratings" }, commentCount: { $size: "$comments" } } },
      { $sort: { ratingCount: -1, commentCount: -1, createdAt: -1 } },
      { $limit: 10 }
    ]);
    await Recipe.populate(recipes, { path: 'author', select: 'name' });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending recipes' });
  }
});

export default router;

