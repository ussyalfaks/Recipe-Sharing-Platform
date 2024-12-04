import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
});

export default mongoose.model('User', UserSchema);

