import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-indigo-600">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="text-white font-medium text-lg">
              Recipe Sharing Platform
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link to="/" className="text-base font-medium text-white hover:text-indigo-50">
                Home
              </Link>
              <Link to="/search" className="text-base font-medium text-white hover:text-indigo-50">
                Search
              </Link>
              {user && (
                <>
                  <Link to="/create-recipe" className="text-base font-medium text-white hover:text-indigo-50">
                    Create Recipe
                  </Link>
                  <Link to="/favorites" className="text-base font-medium text-white hover:text-indigo-50">
                    Favorites
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="ml-10 space-x-4">
            {user ? (
              <button
                onClick={logout}
                className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

