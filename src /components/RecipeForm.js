import React, { useState, useEffect } from 'react';
import './RecipeForm.css';
import { 
  isValidImageUrl, 
  validateLength, 
  normalizeTag,
  isValidString,
  limitArrayItems,
  sanitizeText 
} from '../utils/security';

const RecipeForm = ({ onAddRecipe, onUpdateRecipe, editingRecipe, setEditingRecipe }) => {
  // Límites de seguridad
  const LIMITS = {
    TITLE: 200,
    DESCRIPTION: 500,
    COMMENTS: 1000,
    INGREDIENT_NAME: 50,
    INGREDIENT_QUANTITY: 30,
    STEP: 500,
    TAG: 30,
    MAX_INGREDIENTS: 30,
    MAX_STEPS: 30,
    MAX_TAGS: 15
  };

  const initialFormData = {
    title: '',
    description: '',
    category: 'Principal',
    prepTime: 30,
    servings: 4,
    difficulty: 'Media',
    ingredients: [{ name: '', quantity: '' }],
    steps: [''],
    comments: '',
    tags: [],
    image: '',
    rating: 3
  };

  const [formData, setFormData] = useState(initialFormData);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingRecipe) {
      // Sanitizar datos al editar
      const sanitized = {
        ...initialFormData,
        ...editingRecipe,
        title: sanitizeText(editingRecipe.title, LIMITS.TITLE),
        description: sanitizeText(editingRecipe.description, LIMITS.DESCRIPTION),
        comments: sanitizeText(editingRecipe.comments, LIMITS.COMMENTS),
        ingredients: (editingRecipe.ingredients || []).map(ing => ({
          name: sanitizeText(ing.name, LIMITS.INGREDIENT_NAME),
          quantity: sanitizeText(ing.quantity, LIMITS.INGREDIENT_QUANTITY)
        })),
        steps: (editingRecipe.steps || []).map(step => sanitizeText(step, LIMITS.STEP)),
        tags: (editingRecipe.tags || []).map(tag => sanitizeText(tag, LIMITS.TAG))
      };
      setFormData(sanitized);
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
    setTouched({});
  }, [editingRecipe]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = type === 'number' ? parseInt(value) || 0 : value;
    
    // Sanitizar texto
    if (type !== 'number') {
      newValue = sanitizeText(newValue);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Validar campo
    validateField(name, newValue);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch(fieldName) {
      case 'title':
        if (!isValidString(value)) {
          error = 'El título es obligatorio';
        } else if (value.length > LIMITS.TITLE) {
          error = `Máximo ${LIMITS.TITLE} caracteres`;
        }
        break;
      case 'description':
        if (value.length > LIMITS.DESCRIPTION) {
          error = `Máximo ${LIMITS.DESCRIPTION} caracteres`;
        }
        break;
      case 'comments':
        if (value.length > LIMITS.COMMENTS) {
          error = `Máximo ${LIMITS.COMMENTS} caracteres`;
        }
        break;
      case 'image':
        if (value && !isValidImageUrl(value)) {
          error = 'URL de imagen no válida';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName]);
  };

  const handleIngredientChange = (index, field, value) => {
    const cleanValue = sanitizeText(value);
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: cleanValue
    };
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  const addIngredient = () => {
    if (formData.ingredients.length >= LIMITS.MAX_INGREDIENTS) {
      alert(` No puedes tener más de ${LIMITS.MAX_INGREDIENTS} ingredientes`);
      return;
    }
    
    // Verificar que el último ingrediente no esté vacío
    const lastIng = formData.ingredients[formData.ingredients.length - 1];
    if (lastIng.name.trim() && lastIng.quantity.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { name: '', quantity: '' }]
      }));
    } else {
      alert(' Completa el ingrediente actual antes de agregar otro');
    }
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: updatedIngredients
      }));
    }
  };

  const handleStepChange = (index, value) => {
    const cleanValue = sanitizeText(value);
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = cleanValue;
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps
    }));
  };

  const addStep = () => {
    if (formData.steps.length >= LIMITS.MAX_STEPS) {
      alert(` No puedes tener más de ${LIMITS.MAX_STEPS} pasos`);
      return;
    }
    
    // Verificar que el último paso no esté vacío
    const lastStep = formData.steps[formData.steps.length - 1];
    if (lastStep.trim()) {
      setFormData(prev => ({
        ...prev,
        steps: [...prev.steps, '']
      }));
    } else {
      alert(' Completa el paso actual antes de agregar otro');
    }
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        steps: updatedSteps
      }));
    }
  };

  const addTag = () => {
    if (formData.tags.length >= LIMITS.MAX_TAGS) {
      alert(` No puedes tener más de ${LIMITS.MAX_TAGS} etiquetas`);
      return;
    }
    
    const normalizedTag = normalizeTag(newTag);
    if (normalizedTag && normalizedTag.length <= LIMITS.TAG) {
      if (!formData.tags.some(tag => tag.toLowerCase() === normalizedTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, normalizedTag]
        }));
        setNewTag('');
      } else {
        alert(' Esta etiqueta ya existe');
      }
    } else if (normalizedTag.length > LIMITS.TAG) {
      alert(` La etiqueta no puede tener más de ${LIMITS.TAG} caracteres`);
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones completas
    const validationErrors = [];
    
    // Validar título
    if (!isValidString(formData.title)) {
      validationErrors.push('El título es obligatorio');
    }
    
    // Validar ingredientes
    const validIngredients = formData.ingredients.filter(
      ing => isValidString(ing.name) && isValidString(ing.quantity)
    );
    
    if (validIngredients.length === 0) {
      validationErrors.push('Debes tener al menos un ingrediente válido');
    }
    
    // Validar pasos
    const validSteps = formData.steps.filter(step => isValidString(step));
    
    if (validSteps.length === 0) {
      validationErrors.push('Debes tener al menos un paso válido');
    }
    
    // Validar imagen
    if (formData.image && !isValidImageUrl(formData.image)) {
      validationErrors.push('La URL de la imagen no es válida');
    }
    
    // Validar longitudes
    if (formData.comments.length > LIMITS.COMMENTS) {
      validationErrors.push(`Los comentarios no pueden exceder ${LIMITS.COMMENTS} caracteres`);
    }
    
    if (validationErrors.length > 0) {
      alert(' Errores en el formulario:\n- ' + validationErrors.join('\n- '));
      return;
    }
    
    // Limitar número de items
    const limitedIngredients = limitArrayItems(validIngredients, LIMITS.MAX_INGREDIENTS, 'ingredientes');
    const limitedSteps = limitArrayItems(validSteps, LIMITS.MAX_STEPS, 'pasos');
    
    if (limitedIngredients.error) alert(limitedIngredients.error);
    if (limitedSteps.error) alert(limitedSteps.error);
    
    const recipeToSubmit = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      comments: formData.comments.trim(),
      ingredients: limitedIngredients.limited,
      steps: limitedSteps.limited
    };

    if (editingRecipe) {
      onUpdateRecipe(recipeToSubmit);
    } else {
      onAddRecipe(recipeToSubmit);
    }

    // Resetear formulario
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="recipe-form-container">
      <h2>{editingRecipe ? ' Editar Receta' : 'Nueva Receta'}</h2>
      
      {Object.keys(errors).some(key => errors[key] && touched[key]) && (
        <div className="form-errors-summary">
           Corrige los errores antes de continuar
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="title">
              Título de la receta <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={() => handleBlur('title')}
              required
              maxLength={LIMITS.TITLE}
              placeholder="Ej: Lasaña de carne"
              className={touched.title && errors.title ? 'input-error' : ''}
            />
            <div className="char-count">
              {formData.title.length}/{LIMITS.TITLE}
            </div>
            {touched.title && errors.title && (
              <div className="field-error">{errors.title}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              rows="3"
              placeholder="Describe brevemente la receta..."
              maxLength={LIMITS.DESCRIPTION}
              className={touched.description && errors.description ? 'input-error' : ''}
            />
            <div className="char-count">{formData.description.length}/{LIMITS.DESCRIPTION}</div>
            {touched.description && errors.description && (
              <div className="field-error">{errors.description}</div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Categoría</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Principal">Principal</option>
                <option value="Postre">Postre</option>
                <option value="Entrada">Entrada</option>
                <option value="Ensalada">Ensalada</option>
                <option value="Sopa">Sopa</option>
                <option value="Bebida">Bebida</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="prepTime">Tiempo (min)</label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                min="1"
                max="600"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="servings">Porciones</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                min="1"
                max="50"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="difficulty">Dificultad</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
                <option value="Experto">Experto</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>
            Ingredientes <span className="required">*</span>
            <span className="section-count">
              ({formData.ingredients.filter(i => i.name.trim() && i.quantity.trim()).length}/{LIMITS.MAX_INGREDIENTS})
            </span>
          </h3>
          
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder="Nombre del ingrediente"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                maxLength={LIMITS.INGREDIENT_NAME}
                required={index === 0}
              />
              <input
                type="text"
                placeholder="Cantidad (ej: 200g, 1 taza)"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                maxLength={LIMITS.INGREDIENT_QUANTITY}
                required={index === 0}
              />
              {formData.ingredients.length > 1 && (
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeIngredient(index)}
                  title="Eliminar ingrediente"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button" 
            className="add-btn" 
            onClick={addIngredient}
            disabled={formData.ingredients.length >= LIMITS.MAX_INGREDIENTS}
          >
            + Agregar ingrediente
          </button>
        </div>
        
        <div className="form-section">
          <h3>
            Pasos a seguir <span className="required">*</span>
            <span className="section-count">
              ({formData.steps.filter(s => s.trim()).length}/{LIMITS.MAX_STEPS})
            </span>
          </h3>
          
          {formData.steps.map((step, index) => (
            <div key={index} className="step-row">
              <span className="step-number">{index + 1}.</span>
              <textarea
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Describe el paso ${index + 1}`}
                rows="2"
                maxLength={LIMITS.STEP}
                required={index === 0}
              />
              {formData.steps.length > 1 && (
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeStep(index)}
                  title="Eliminar paso"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button" 
            className="add-btn" 
            onClick={addStep}
            disabled={formData.steps.length >= LIMITS.MAX_STEPS}
          >
            + Agregar paso
          </button>
        </div>
        
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="comments">Comentarios adicionales</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              onBlur={() => handleBlur('comments')}
              rows="3"
              placeholder="Notas, variaciones, consejos..."
              maxLength={LIMITS.COMMENTS}
              className={touched.comments && errors.comments ? 'input-error' : ''}
            />
            <div className="char-count">{formData.comments.length}/{LIMITS.COMMENTS}</div>
            {touched.comments && errors.comments && (
              <div className="field-error">{errors.comments}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="image">URL de imagen (opcional)</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              onBlur={() => handleBlur('image')}
              placeholder="https://ejemplo.com/imagen.jpg"
              className={touched.image && errors.image ? 'input-error' : ''}
            />
            <small className="input-hint">Formatos: JPG, PNG, GIF, WEBP</small>
            {touched.image && errors.image && (
              <div className="field-error">{errors.image}</div>
            )}
          </div>
          
          <div className="form-group">
            <label>Etiquetas ({formData.tags.length}/{LIMITS.MAX_TAGS})</label>
            <div className="tags-input">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(sanitizeText(e.target.value))}
                placeholder="Agregar etiqueta (ej: vegetariano, rápido)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                maxLength={LIMITS.TAG}
              />
              <button 
                type="button" 
                onClick={addTag}
                disabled={formData.tags.length >= LIMITS.MAX_TAGS}
              >
                +
              </button>
            </div>
            <div className="tags-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    title="Eliminar etiqueta"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.tags.length === 0 && (
                <span className="no-tags">No hay etiquetas aún</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          {editingRecipe && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancelar
            </button>
          )}
          <button type="submit" className="submit-btn">
            {editingRecipe ? ' Guardar Cambios' : ' Crear Receta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;