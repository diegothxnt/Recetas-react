import React from 'react';
import '../RecipeCard.css';
import { escapeHtml } from '../../utils/security';

const RecipeCardV3 = ({ recipe }) => {
  // Escapar datos para prevenir XSS
  const safeRecipe = {
    title: escapeHtml(recipe?.title || 'Sin título'),
    author: escapeHtml(recipe?.author || 'Anónimo'),
    createdAt: recipe?.createdAt || new Date().toISOString(),
    difficulty: escapeHtml(recipe?.difficulty || 'No especificado'),
    prepTime: recipe?.prepTime || 0,
    servings: recipe?.servings || 0,
    ingredients: (recipe?.ingredients || []).map(ing => ({
      name: escapeHtml(ing.name),
      quantity: escapeHtml(ing.quantity)
    })),
    rating: recipe?.rating || 3
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Fecha desconocida';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha desconocida';
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Fecha desconocida';
    }
  };

  return (
    <div className="recipe-card version-3">
      <div className="recipe-header-v3">
        <div className="recipe-icon"></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="recipe-title" title={safeRecipe.title}>
            {truncateText(safeRecipe.title, 28)}
          </h3>
          <div className="recipe-meta">
            <span title="Autor">Por: {truncateText(safeRecipe.author, 15)}</span>
            <span>•</span>
            <span title="Fecha de creación">{formatDate(safeRecipe.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="recipe-details">
        <div className="detail-item">
          <span className="detail-label">Dificultad</span>
          <span className="detail-value" title={safeRecipe.difficulty}>
            {truncateText(safeRecipe.difficulty, 8)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Tiempo</span>
          <span className="detail-value" title={`${safeRecipe.prepTime} minutos`}>
            {safeRecipe.prepTime} min
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Porciones</span>
          <span className="detail-value" title={`${safeRecipe.servings} porciones`}>
            {safeRecipe.servings}
          </span>
        </div>
      </div>
      
      <div className="recipe-ingredients-preview">
        <h4> Ingredientes principales:</h4>
        <div className="ingredients-list">
          {safeRecipe.ingredients.slice(0, 4).map((ingredient, idx) => (
            <div key={idx} className="ingredient-item">
              <span className="ingredient-name" title={ingredient.name}>
                {truncateText(ingredient.name, 15)}
              </span>
              <span className="ingredient-quantity" title={ingredient.quantity}>
                {truncateText(ingredient.quantity, 10)}
              </span>
            </div>
          ))}
          {safeRecipe.ingredients.length > 4 && (
            <div className="ingredient-more" title={`Ver los ${safeRecipe.ingredients.length - 4} ingredientes restantes`}>
              +{safeRecipe.ingredients.length - 4} más
            </div>
          )}
          {safeRecipe.ingredients.length === 0 && (
            <div className="ingredient-item">
              <span className="ingredient-name">No hay ingredientes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCardV3;