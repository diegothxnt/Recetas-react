import React from 'react';
import './RecipePopup.css';
import { escapeHtml } from '../utils/security';

const RecipePopup = ({ recipe, onClose }) => {
  if (!recipe) return null;

  // Escapar todo el contenido para prevenir XSS
  const safeRecipe = {
    title: escapeHtml(recipe.title),
    category: escapeHtml(recipe.category),
    description: escapeHtml(recipe.description),
    comments: escapeHtml(recipe.comments),
    prepTime: recipe.prepTime,
    servings: recipe.servings,
    difficulty: escapeHtml(recipe.difficulty),
    rating: recipe.rating || 0,
    image: recipe.image ? escapeHtml(recipe.image) : null,
    createdAt: recipe.createdAt,
    ingredients: (recipe.ingredients || []).map(ing => ({
      name: escapeHtml(ing.name),
      quantity: escapeHtml(ing.quantity)
    })),
    steps: (recipe.steps || []).map(step => escapeHtml(step)),
    tags: (recipe.tags || []).map(tag => escapeHtml(tag))
  };

  // Función segura para manejar errores de imagen
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = ' Imagen no disponible';
    e.target.parentNode.appendChild(placeholder);
  };

  // Formatear fecha segura
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Fecha desconocida';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Fecha desconocida';
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} title="Cerrar">
          
        </button>
        
        <div className="popup-header">
          <h2>{safeRecipe.title}</h2>
          <div className="recipe-meta-popup">
            <span className="category-badge">{safeRecipe.category}</span>
            <span className="meta-item">⏱ {safeRecipe.prepTime} min</span>
            <span className="meta-item"> {safeRecipe.servings} porciones</span>
            <span className="meta-item"> {safeRecipe.difficulty}</span>
            {safeRecipe.rating > 0 && (
              <span className="meta-item">
                 {safeRecipe.rating}/5
              </span>
            )}
          </div>
        </div>
        
        {safeRecipe.image && (
          <div className="popup-image">
            <img 
              src={safeRecipe.image} 
              alt={safeRecipe.title}
              className="popup-image-content"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        )}
        
        {safeRecipe.description && (
          <div className="popup-section">
            <h3> Descripción</h3>
            <p className="safe-content">{safeRecipe.description}</p>
          </div>
        )}
        
        <div className="popup-section">
          <h3> Ingredientes</h3>
          {safeRecipe.ingredients.length > 0 ? (
            <ul className="ingredients-list-popup">
              {safeRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item-popup">
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-quantity">{ingredient.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No hay ingredientes especificados</p>
          )}
        </div>
        
        <div className="popup-section">
          <h3> Pasos a seguir</h3>
          {safeRecipe.steps.length > 0 ? (
            <ol className="steps-list">
              {safeRecipe.steps.map((step, index) => (
                <li key={index} className="step-item">
                  <div className="step-number-popup">{index + 1}</div>
                  <div className="step-content">{step}</div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="no-data">No hay pasos especificados</p>
          )}
        </div>
        
        {safeRecipe.comments && (
          <div className="popup-section">
            <h3> Comentarios adicionales</h3>
            <div className="comments-text">
              <p className="safe-content">{safeRecipe.comments}</p>
            </div>
          </div>
        )}
        
        {safeRecipe.tags.length > 0 && (
          <div className="popup-section">
            <h3> Etiquetas</h3>
            <div className="popup-tags">
              {safeRecipe.tags.map((tag, index) => (
                <span key={index} className="tag-popup">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="popup-footer">
          <small>
             {formatDate(safeRecipe.createdAt)}
          </small>
          <small className="recipe-id">
             ID: {recipe.id}
          </small>
        </div>
      </div>
    </div>
  );
};

export default RecipePopup;