export function hasRequiredRole(userRole, required) {
  if (!userRole) return false;
  if (required === 'premium') {
    return userRole === 'premium' || userRole === 'dealer';
  }
  if (required === 'dealer') {
    return userRole === 'dealer';
  }
  return false;
}
