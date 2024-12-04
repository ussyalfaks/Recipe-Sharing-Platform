import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      } else {
        throw new Error('Failed to fetch recipe');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  const handleRating = async () => {
    try {
      const response = await fetch(`/api/recipes/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating })
      });
      if (response.ok) {
        const data = await response.json();
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          averageRating: data.averageRating
        }));
        alert('Rating submitted successfully!');
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error rating recipe:', error);
    }
  };

  const handleComment = async () => {
    try {
      const response = await fetch(`/api/recipes/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: comment })
      });
      if (response.ok) {
        const data = await response.json();
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          comments: data.comments
        }));
        setComment('');
        alert('Comment added successfully!');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error commenting on recipe:', error);
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
      <p className="mb-2">By: {recipe.author.name}</p>
      <p className="mb-2">Difficulty: {recipe.difficulty}</p>
      <p className="mb-2">Cuisine Type: {recipe.cuisineType}</p>
      <p className="mb-4">Average Rating: {recipe.averageRating.toFixed(1)} / 5</p>
      
      <h3 className="text-2xl font-semibold mb-2">Ingredients:</h3>
      <ul className="list-disc pl-5 mb-4">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      
      <h3 className="text-2xl font-semibold mb-2">Instructions:</h3>
      <ol className="list-decimal pl-5 mb-6">
        {recipe.instructions.map((instruction, index) => (
          <li key={index} className="mb-2">{instruction}</li>
        ))}
      </ol>
      
      {user && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Rate this recipe:</h3>
          <select 
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))}
            className="mr-2 p-2 border rounded"
          >
            <option value="0">Select rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <button 
            onClick={handleRating}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Rating
          </button>
        </div>
      )}
      
      <h3 className="text-2xl font-semibold mb-2">Comments:</h3>
      {recipe.comments.map((comment, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
          <p className="mb-2">{comment.text}</p>
          <p className="text-sm text-gray-600">By: {comment.user.name}</p>
        </div>
      ))}
      
      {user && (
        <div className="mt-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="w-full p-2 border rounded mb-2"
            rows="3"
          />
          <button 
            onClick={handleComment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;

