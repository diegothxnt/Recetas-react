// Utilidades de seguridad para toda la aplicación

// Escape de HTML para prevenir XSS
export const escapeHtml = (text) => {
  if (!text) return '';
  if (typeof text !== 'string') return String(text);
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#47;',
    '\\': '&#92;',
    '(': '&#40;',
    ')': '&#41;'
  };
  
  return text.replace(/[&<>"'\/\\()]/g, function(char) {
    return map[char];
  });
};

// Validar URL de imagen
export const isValidImageUrl = (url) => {
  if (!url || url.trim() === '') return true; // Campo opcional
  
  try {
    const urlObj = new URL(url);
    // Solo permitir http y https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Extensiones permitidas
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const urlLower = url.toLowerCase();
    return validExtensions.some(ext => urlLower.endsWith(ext)) || 
           urlLower.includes('image') || // Algunas URLs no tienen extensión
           urlLower.includes('img') ||
           urlLower.includes('photo');
  } catch {
    return false;
  }
};

// Sanitizar texto (eliminar caracteres peligrosos)
export const sanitizeText = (text, maxLength = 1000) => {
  if (!text) return '';
  let clean = String(text).trim();
  // Eliminar cualquier intento de script
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/javascript:/gi, 'blocked:');
  clean = clean.replace(/on\w+=/gi, 'blocked=');
  // Limitar longitud
  if (maxLength > 0 && clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }
  return clean;
};

// Validar longitud máxima
export const validateLength = (text, maxLength, fieldName) => {
  if (!text) return { valid: true };
  if (text.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} no puede exceder ${maxLength} caracteres`
    };
  }
  return { valid: true };
};

// Normalizar tags
export const normalizeTag = (tag) => {
  if (!tag) return '';
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
};

// Limitar número de items
export const limitArrayItems = (array, maxItems, fieldName) => {
  if (array.length > maxItems) {
    return {
      limited: array.slice(0, maxItems),
      error: `Demasiados ${fieldName}. Solo se guardarán los primeros ${maxItems}`
    };
  }
  return { limited: array, error: null };
};

// Validar que no haya solo espacios
export const isValidString = (text) => {
  return text && typeof text === 'string' && text.trim().length > 0;
};