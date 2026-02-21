import React from 'react';
import '../RecipeCard.css';
import { escapeHtml } from '../../utils/security';

const RecipeCardV4 = ({ recipe }) => {
  // Escapar datos para prevenir XSS
  const safeRecipe = {
    title: escapeHtml(recipe?.title || 'Sin título'),
    description: escapeHtml(recipe?.description || ''),
    prepTime: recipe?.prepTime || 0,
    servings: recipe?.servings || 0,
    difficulty: escapeHtml(recipe?.difficulty || 'No especificada'),
    rating: recipe?.rating || 3,
    image: recipe?.image ? escapeHtml(recipe.image) : null
  };

  const truncateText = (text, maxLength = 25) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const parent = e.target.parentNode;
    const placeholder = document.createElement('div');
    placeholder.className = 'recipe-image-placeholder-v4';
    placeholder.innerHTML = ' Sin imagen';
    parent.appendChild(placeholder);
  };

  return (
    <div className="recipe-card version-4">
      <div className="recipe-banner">
        <h3 className="recipe-title" title={safeRecipe.title}>
          {truncateText(safeRecipe.title, 22)}
        </h3>
        <div className="recipe-rating" title={`Calificación: ${safeRecipe.rating}/5`}>
          {renderStars(safeRecipe.rating)}
        </div>
      </div>
      
      <div className="recipe-content-v4">
        <div className="recipe-image-container-v4">
          {safeRecipe.image ? (
            <img 
              src={safeRecipe.image} 
              alt={safeRecipe.title}
              className="recipe-image-v4"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="recipe-image-placeholder-v4">
              <span> Sin imagen</span>
            </div>
          )}
        </div>
        
        <div className="recipe-summary">
          <div className="summary-item">
            <div className="summary-icon"></div>
            <div className="summary-text">
              <div className="summary-label">Preparación</div>
              <div className="summary-value" title={`${safeRecipe.prepTime} minutos`}>
                {safeRecipe.prepTime} min
              </div>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-icon"></div>
            <div className="summary-text">
              <div className="summary-label">Porciones</div>
              <div className="summary-value" title={`${safeRecipe.servings} porciones`}>
                {safeRecipe.servings}
              </div>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-icon"></div>
            <div className="summary-text">
              <div className="summary-label">Dificultad</div>
              <div className="summary-value" title={safeRecipe.difficulty}>
                {truncateText(safeRecipe.difficulty, 8)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="recipe-excerpt">
          <p title={safeRecipe.description}>
            {truncateText(safeRecipe.description || 'Descripción no disponible', 90)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardV4;