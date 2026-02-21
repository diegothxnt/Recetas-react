import React from 'react';
import '../RecipeCard.css';
import { escapeHtml } from '../../utils/security';

const RecipeCardV2 = ({ recipe }) => {
  // Escapar datos para prevenir XSS
  const safeRecipe = {
    title: escapeHtml(recipe?.title || 'Sin título'),
    description: escapeHtml(recipe?.description || 'Sin descripción'),
    ingredients: recipe?.ingredients || [],
    steps: recipe?.steps || [],
    tags: (recipe?.tags || []).map(tag => escapeHtml(tag)),
    image: recipe?.image ? escapeHtml(recipe.image) : null
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const parent = e.target.parentNode;
    const placeholder = document.createElement('div');
    placeholder.className = 'recipe-image-placeholder';
    placeholder.innerHTML = '';
    parent.appendChild(placeholder);
  };

  return (
    <div className="recipe-card version-2">
      <div className="recipe-image-side">
        {safeRecipe.image ? (
          <img 
            src={safeRecipe.image} 
            alt={safeRecipe.title}
            className="recipe-image"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="recipe-image-placeholder">
            
          </div>
        )}
      </div>
      
      <div className="recipe-info-side">
        <h3 className="recipe-title" title={safeRecipe.title}>
          {truncateText(safeRecipe.title, 30)}
        </h3>
        <p className="recipe-description" title={safeRecipe.description}>
          {truncateText(safeRecipe.description, 80)}
        </p>
        
        <div className="ingredients-summary">
          <span title="Cantidad de ingredientes">
             {safeRecipe.ingredients.length} ingredientes
          </span>
          <span title="Cantidad de pasos">
             {safeRecipe.steps.length} pasos
          </span>
        </div>
        
        <div className="recipe-tags">
          {safeRecipe.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="tag" title={tag}>
              {truncateText(tag, 10)}
            </span>
          ))}
          {safeRecipe.tags.length > 3 && (
            <span className="tag" title={`+${safeRecipe.tags.length - 3} etiquetas más`}>
              +{safeRecipe.tags.length - 3}
            </span>
          )}
          {safeRecipe.tags.length === 0 && (
            <span className="tag">Sin etiquetas</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCardV2;