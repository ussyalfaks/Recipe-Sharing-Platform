import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';

const CreateRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [difficulty, setDifficulty] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (ingredients.some(i => !i.trim())) newErrors.ingredients = 'All ingredients must be filled';
    if (instructions.some(i => !i.trim())) newErrors.instructions = 'All instructions must be filled';
    if (!difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!cuisineType.trim()) newErrors.cuisineType = 'Cuisine type is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          ingredients: ingredients.filter(i => i.trim()),
          instructions: instructions.filter(i => i.trim()),
          difficulty,
          cuisineType,
          author: user._id
        })
      });
      if (response.ok) {
        const data = await response.json();
        history.push(`/recipe/${data._id}`);
      } else {
        throw new Error('Failed to create recipe');
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      setErrors({ submit: 'Failed to create recipe. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Create a New Recipe</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Ingredients:</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className={`flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ingredients ? 'border-red-500' : 'border-gray-300'}`}
              />
              {index === ingredients.length - 1 && (
                <button 
                  type="button" 
                  onClick={handleAddIngredient}
                  className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
                >
                  +
                </button>
              )}
            </div>
          ))}
          {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Instructions:</label>
          {instructions.map((instruction, index) => (
            <div key={index} className="flex mb-2">
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className={`flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.instructions ? 'border-red-500' : 'border-gray-300'}`}
                rows="3"
              />
              {index === instructions.length - 1 && (
                <button 
                  type="button" 
                  onClick={handleAddInstruction}
                  className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
                >
                  +
                </button>
              )}
            </div>
          ))}
          {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="difficulty" className="block text-gray-700 font-bold mb-2">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.difficulty ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="cuisineType" className="block text-gray-700 font-bold mb-2">Cuisine Type:</label>
          <input
            type="text"
            id="cuisineType"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cuisineType ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.cuisineType && <p className="text-red-500 text-sm mt-1">{errors.cuisineType}</p>}
        </div>
        {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
        <div className="text-center">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;

