import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const SearchRecipes = () => {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear expired cache entries on component mount
    clearExpiredCache();
  }, []);

  const clearExpiredCache = () => {
    const now = new Date().getTime();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('recipeSearch_')) {
        const item = JSON.parse(localStorage.getItem(key));
        if (now > item.expiry) {
          localStorage.removeItem(key);
        }
      }
    });
  };

  const getCacheKey = (query, difficulty, cuisineType) => {
    return `recipeSearch_${query}_${difficulty}_${cuisineType}`;
  };

  const getCachedResults = (cacheKey) => {
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
      const { results, expiry } = JSON.parse(cachedItem);
      if (new Date().getTime() < expiry) {
        return results;
      }
    }
    return null;
  };

  const setCachedResults = (cacheKey, results) => {
    const item = {
      results,
      expiry: new Date().getTime() + CACHE_EXPIRATION,
    };
    localStorage.setItem(cacheKey, JSON.stringify(item));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const cacheKey = getCacheKey(query, difficulty, cuisineType);
    const cachedResults = getCachedResults(cacheKey);

    if (cachedResults) {
      setResults(cachedResults);
      setIsLoading(false);
    } else {
      try {
        const response = await fetch(`/api/search?query=${query}&difficulty=${difficulty}&cuisineType=${cuisineType}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setCachedResults(cacheKey, data);
        }
      } catch (error) {
        console.error('Error searching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Search Recipes</h2>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or ingredient"
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="md:w-1/4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <input
            type="text"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            placeholder="Cuisine Type"
            className="md:w-1/4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Search Results:</h3>
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(recipe => (
              <div key={recipe._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2">
                    <Link to={`/recipe/${recipe._id}`} className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
                      {recipe.title}
                    </Link>
                  </h4>
                  <p className="text-gray-600 mb-2">By: {recipe.author.name}</p>
                  <p className="text-gray-600 mb-2">Difficulty: {recipe.difficulty}</p>
                  <p className="text-gray-600">Cuisine Type: {recipe.cuisineType}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && results.length === 0 && (
          <p className="text-center text-gray-600">No results found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchRecipes;

