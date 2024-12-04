import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: [String],
  difficulty: String,
  cuisineType: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }],
  comments: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    text: String, 
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

RecipeSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
  return sum / this.ratings.length;
});

export default mongoose.model('Recipe', RecipeSchema);

