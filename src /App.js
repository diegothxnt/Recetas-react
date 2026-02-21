import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import RecipePopup from './components/RecipePopup';
import Header from './components/Header';
import { sanitizeText } from './utils/security';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [error, setError] = useState('');

  // CONSTANTES DE SEGURIDAD
  const MAX_RECIPES = 50;
  const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB

  useEffect(() => {
    // Limpiar sesiones anteriores si existen problemas
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
    
    // Cargar recetas con validación
    try {
      const savedRecipes = localStorage.getItem('recipes');
      if (savedRecipes) {
        const parsed = JSON.parse(savedRecipes);
        if (Array.isArray(parsed)) {
          // Sanitizar datos al cargar
          const sanitized = parsed.map(recipe => ({
            ...recipe,
            title: sanitizeText(recipe.title, 100),
            description: sanitizeText(recipe.description, 500),
            comments: sanitizeText(recipe.comments, 1000),
            ingredients: (recipe.ingredients || []).map(ing => ({
              name: sanitizeText(ing.name, 50),
              quantity: sanitizeText(ing.quantity, 30)
            })),
            steps: (recipe.steps || []).map(step => sanitizeText(step, 500)),
            tags: (recipe.tags || []).map(tag => sanitizeText(tag, 30))
          }));
          setRecipes(sanitized);
        }
      }
    } catch (error) {
      console.error('Error al cargar recetas:', error);
      localStorage.removeItem('recipes'); // Limpiar datos corruptos
    }
  }, []);

  // Guardar recetas con límite de tamaño
  useEffect(() => {
    try {
      const recipesString = JSON.stringify(recipes);
      if (recipesString.length > MAX_STORAGE_SIZE) {
        setError('Las recetas ocupan demasiado espacio. Elimina algunas.');
        return;
      }
      localStorage.setItem('recipes', recipesString);
      setError('');
    } catch (error) {
      console.error('Error al guardar:', error);
      setError('Error al guardar. Limita el tamaño de las recetas.');
    }
  }, [recipes]);

  const handleLogin = (credentials) => {
    const username = credentials.username.trim().toLowerCase();
    const password = credentials.password.trim();
    
    if (username === 'admin' && password === '1234') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const addRecipe = (recipe) => {
    // Verificar límite de recetas
    if (recipes.length >= MAX_RECIPES) {
      alert(` No puedes tener más de ${MAX_RECIPES} recetas. Elimina algunas para continuar.`);
      return;
    }

    // Sanitizar antes de guardar
    const sanitizedRecipe = {
      ...recipe,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      title: sanitizeText(recipe.title, 100),
      description: sanitizeText(recipe.description, 500),
      comments: sanitizeText(recipe.comments, 1000),
      ingredients: (recipe.ingredients || []).map(ing => ({
        name: sanitizeText(ing.name, 50),
        quantity: sanitizeText(ing.quantity, 30)
      })),
      steps: (recipe.steps || []).map(step => sanitizeText(step, 500)),
      tags: (recipe.tags || []).map(tag => sanitizeText(tag, 30))
    };

    setRecipes([...recipes, sanitizedRecipe]);
    alert(' Receta creada con éxito');
  };

  const updateRecipe = (updatedRecipe) => {
    // Sanitizar antes de actualizar
    const sanitizedRecipe = {
      ...updatedRecipe,
      title: sanitizeText(updatedRecipe.title, 100),
      description: sanitizeText(updatedRecipe.description, 500),
      comments: sanitizeText(updatedRecipe.comments, 1000),
      ingredients: (updatedRecipe.ingredients || []).map(ing => ({
        name: sanitizeText(ing.name, 50),
        quantity: sanitizeText(ing.quantity, 30)
      })),
      steps: (updatedRecipe.steps || []).map(step => sanitizeText(step, 500)),
      tags: (updatedRecipe.tags || []).map(tag => sanitizeText(tag, 30))
    };

    setRecipes(recipes.map(recipe => 
      recipe.id === updatedRecipe.id ? sanitizedRecipe : recipe
    ));
    setEditingRecipe(null);
    alert(' Receta actualizada con éxito');
  };

  const deleteRecipe = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta receta? Esta acción no se puede deshacer.')) {
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      alert(' Receta eliminada');
    }
  };

  const openRecipePopup = (recipe) => {
    setSelectedRecipe(recipe);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedRecipe(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Header onLogout={handleLogout} />
      
      {error && (
        <div className="global-error">
           {error}
        </div>
      )}
      
      <main className="app-container">
        <div className="content-wrapper">
          <RecipeForm 
            onAddRecipe={addRecipe} 
            onUpdateRecipe={updateRecipe}
            editingRecipe={editingRecipe}
            setEditingRecipe={setEditingRecipe}
          />
          
          <RecipeList 
            recipes={recipes}
            onSelectRecipe={openRecipePopup}
            onEditRecipe={setEditingRecipe}
            onDeleteRecipe={deleteRecipe}
          />
        </div>
      </main>
      
      {showPopup && selectedRecipe && (
        <RecipePopup 
          recipe={selectedRecipe} 
          onClose={closePopup} 
        />
      )}
    </div>
  );
}

export default App;