import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [trendingRecipes, setTrendingRecipes] = useState([]);

  useEffect(() => {
    fetchTrendingRecipes();
  }, []);

  const fetchTrendingRecipes = async () => {
    try {
      const response = await fetch('/api/trending');
      if (response.ok) {
        const data = await response.json();
        setTrendingRecipes(data);
      } else {
        throw new Error('Failed to fetch trending recipes');
      }
    } catch (error) {
      console.error('Error fetching trending recipes:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Recipe Sharing Platform</h1>
      <h2 className="text-2xl font-semibold mb-4">Trending Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingRecipes.map(recipe => (
          <div key={recipe._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                <Link to={`/recipe/${recipe._id}`} className="text-blue-600 hover:text-blue-800">
                  {recipe.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-2">By: {recipe.author.name}</p>
              <p className="text-gray-600 mb-2">Difficulty: {recipe.difficulty}</p>
              <p className="text-gray-600 mb-2">Cuisine: {recipe.cuisineType}</p>
              <p className="text-gray-600">
                Average Rating: {recipe.averageRating ? recipe.averageRating.toFixed(1) : 'N/A'} / 5
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

