import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import Header from './Components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetails from './pages/RecipeDetails';
import SearchRecipes from './pages/SearchRecipes';
import Favorites from './pages/Favorites';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/create-recipe" component={CreateRecipe} />
          <Route path="/recipe/:id" component={RecipeDetails} />
          <Route path="/search" component={SearchRecipes} />
          <Route path="/favorites" component={Favorites} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;


