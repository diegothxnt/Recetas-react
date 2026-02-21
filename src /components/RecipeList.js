import React, { useState } from 'react';
import './RecipeList.css';
import RecipeCardV1 from './recipe-versions/RecipeCardV1';
import RecipeCardV2 from './recipe-versions/RecipeCardV2';
import RecipeCardV3 from './recipe-versions/RecipeCardV3';
import RecipeCardV4 from './recipe-versions/RecipeCardV4';

const RecipeList = ({ recipes, onSelectRecipe, onEditRecipe, onDeleteRecipe }) => {
  const [viewMode, setViewMode] = useState('v1');

  const getRecipeComponent = (recipe) => {
    switch(viewMode) {
      case 'v1':
        return <RecipeCardV1 recipe={recipe} />;
      case 'v2':
        return <RecipeCardV2 recipe={recipe} />;
      case 'v3':
        return <RecipeCardV3 recipe={recipe} />;
      case 'v4':
        return <RecipeCardV4 recipe={recipe} />;
      default:
        return <RecipeCardV1 recipe={recipe} />;
    }
  };

  return (
    <div className="recipe-list-container">
      <div className="list-header">
        <h2>Mis Recetas <span className="recipe-count">({recipes.length})</span></h2>
        
        <div className="view-controls">
          <span className="view-label">Vista:</span>
          <button 
            className={`view-btn ${viewMode === 'v1' ? 'active' : ''}`}
            onClick={() => setViewMode('v1')}
            title="Versión 1 - Tarjeta con imagen"
          >
            V1
          </button>
          <button 
            className={`view-btn ${viewMode === 'v2' ? 'active' : ''}`}
            onClick={() => setViewMode('v2')}
            title="Versión 2 - Diseño horizontal"
          >
            V2
          </button>
          <button 
            className={`view-btn ${viewMode === 'v3' ? 'active' : ''}`}
            onClick={() => setViewMode('v3')}
            title="Versión 3 - Enfoque en detalles"
          >
            V3
          </button>
          <button 
            className={`view-btn ${viewMode === 'v4' ? 'active' : ''}`}
            onClick={() => setViewMode('v4')}
            title="Versión 4 - Con banner"
          >
            V4
          </button>
        </div>
      </div>
      
      {recipes.length === 0 ? (
        <div className="empty-list">
          <div className="empty-icon"></div>
          <h3>No hay recetas aún</h3>
          <p>¡Crea tu primera receta usando el formulario!</p>
        </div>
      ) : (
        <div className={`recipes-grid view-${viewMode}`}>
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-item-wrapper">
              <div onClick={() => onSelectRecipe(recipe)} className="recipe-clickable">
                {getRecipeComponent(recipe)}
              </div>
              
              <div className="recipe-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEditRecipe(recipe)}
                  title="Editar receta"
                >
                   Editar
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
                      onDeleteRecipe(recipe.id);
                    }
                  }}
                  title="Eliminar receta"
                >
                   Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;