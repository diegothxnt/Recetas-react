import React from 'react';
import '../RecipeCard.css';
import { escapeHtml } from '../../utils/security';

const RecipeCardV1 = ({ recipe }) => {
  // Escapar datos para prevenir XSS
  const safeRecipe = {
    title: escapeHtml(recipe?.title || 'Sin título'),
    category: escapeHtml(recipe?.category || 'Sin categoría'),
    ingredients: (recipe?.ingredients || []).map(ing => ({
      name: escapeHtml(ing.name),
      quantity: escapeHtml(ing.quantity)
    })),
    prepTime: recipe?.prepTime || 0,
    servings: recipe?.servings || 0,
    difficulty: escapeHtml(recipe?.difficulty || 'No especificado'),
    image: recipe?.image ? escapeHtml(recipe.image) : null,
    description: escapeHtml(recipe?.description || '')
  };

  // Función segura para truncar texto
  const truncateText = (text, maxLength = 20) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Manejador seguro para errores de imagen
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.parentNode.querySelector('.image-placeholder-common');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  return (
    <div className="recipe-card version-1">
      <div className="recipe-header">
        <h3 className="recipe-title" title={safeRecipe.title}>
          {truncateText(safeRecipe.title, 25)}
        </h3>
        <span className="recipe-category" title={safeRecipe.category}>
          {truncateText(safeRecipe.category, 15)}
        </span>
      </div>
      
      <div className="recipe-image-container">
        {safeRecipe.image ? (
          <>
            <img 
              src={safeRecipe.image} 
              alt={safeRecipe.title}
              className="recipe-image"
              loading="lazy"
              onError={handleImageError}
            />
            <div className="image-placeholder-common" style={{ display: 'none' }}>
              <span> Sin imagen</span>
            </div>
          </>
        ) : (
          <div className="image-placeholder-common">
            <span> Sin imagen</span>
          </div>
        )}
      </div>
      
      <div className="recipe-content">
        <div className="ingredients-preview">
          <h4> Ingredientes:</h4>
          <ul>
            {safeRecipe.ingredients.slice(0, 3).map((ingredient, idx) => (
              <li key={idx} title={`${ingredient.name}: ${ingredient.quantity}`}>
                <span className="ingredient-name">{truncateText(ingredient.name, 15)}</span>
                <span className="ingredient-quantity">{truncateText(ingredient.quantity, 10)}</span>
              </li>
            ))}
            {safeRecipe.ingredients.length > 3 && (
              <li>
                <span className="ingredient-name">...</span>
                <span className="ingredient-quantity">
                  +{safeRecipe.ingredients.length - 3} más
                </span>
              </li>
            )}
            {safeRecipe.ingredients.length === 0 && (
              <li>No hay ingredientes</li>
            )}
          </ul>
        </div>
        
        <div className="recipe-stats">
          <span className="stat" title="Tiempo de preparación">
             {safeRecipe.prepTime} min
          </span>
          <span className="stat" title="Porciones">
             {safeRecipe.servings}
          </span>
          <span className="stat" title="Dificultad">
             {truncateText(safeRecipe.difficulty, 10)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardV1;