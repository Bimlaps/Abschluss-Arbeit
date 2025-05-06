// Capitalize first letter of a string
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate string with ellipsis
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

// Convert string to slug (URL-friendly string)
export const slugify = (str: string): string => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim() // Trim whitespace
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Convert camelCase to Title Case
export const camelCaseToTitleCase = (str: string): string => {
  if (!str) return '';
  
  // Add space before uppercase letters and capitalize the first letter
  const result = str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
  
  return result;
};

// Format phone number (German format)
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a German number
  if (cleaned.startsWith('49') || cleaned.startsWith('0')) {
    // Format as German number
    if (cleaned.startsWith('49')) {
      // International format
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    } else {
      // National format
      return `0${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
  }
  
  // Return as is if not recognized
  return phoneNumber;
};
