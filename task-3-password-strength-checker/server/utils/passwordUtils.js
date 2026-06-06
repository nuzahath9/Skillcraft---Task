export const evaluatePassword = (password) => {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  let score = 0;
  if (criteria.length) score++;
  if (criteria.uppercase) score++;
  if (criteria.lowercase) score++;
  if (criteria.numbers) score++;
  if (criteria.specialChars) score++;

  let strength = 'Very Weak';
  let color = 'bg-red-500';
  let emoji = '🔴';
  
  if (score === 1 || (score === 2 && !criteria.length)) {
    strength = 'Weak';
    color = 'bg-orange-500';
    emoji = '🟠';
  } else if (score === 3 || (score === 2 && criteria.length)) {
    strength = 'Medium';
    color = 'bg-yellow-500';
    emoji = '🟡';
  } else if (score === 4) {
    strength = 'Strong';
    color = 'bg-green-500';
    emoji = '🟢';
  } else if (score === 5) {
    strength = 'Very Strong';
    color = 'bg-emerald-500';
    emoji = '🔥';
  }

  // Handle empty password explicitly
  if (password.length === 0) {
    score = 0;
    strength = 'None';
    color = 'bg-gray-700';
    emoji = '⚪';
  }

  const suggestions = [];
  if (!criteria.length) suggestions.push('Use at least 8 characters.');
  if (!criteria.uppercase) suggestions.push('Add an uppercase letter.');
  if (!criteria.lowercase) suggestions.push('Add a lowercase letter.');
  if (!criteria.numbers) suggestions.push('Include at least one number.');
  if (!criteria.specialChars) suggestions.push('Use a special character (e.g., !@#$%).');

  return {
    score,
    strength,
    color,
    emoji,
    criteria,
    suggestions
  };
};
