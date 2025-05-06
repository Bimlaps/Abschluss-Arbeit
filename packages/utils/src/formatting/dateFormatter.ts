import { format, parseISO, isValid } from 'date-fns';
import { de } from 'date-fns/locale';

// Format date to localized string
export const formatDate = (
  date: Date | string | number,
  formatStr: string = 'dd.MM.yyyy'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    
    if (!isValid(dateObj)) {
      return 'Ungültiges Datum';
    }
    
    return format(dateObj, formatStr, { locale: de });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Ungültiges Datum';
  }
};

// Format date with time
export const formatDateTime = (
  date: Date | string | number,
  formatStr: string = 'dd.MM.yyyy HH:mm'
): string => {
  return formatDate(date, formatStr);
};

// Format relative time (e.g., "vor 2 Stunden")
export const formatRelativeTime = (date: Date | string | number): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    
    if (!isValid(dateObj)) {
      return 'Ungültiges Datum';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'gerade eben';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `vor ${diffInMinutes} ${diffInMinutes === 1 ? 'Minute' : 'Minuten'}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `vor ${diffInHours} ${diffInHours === 1 ? 'Stunde' : 'Stunden'}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `vor ${diffInDays} ${diffInDays === 1 ? 'Tag' : 'Tagen'}`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `vor ${diffInMonths} ${diffInMonths === 1 ? 'Monat' : 'Monaten'}`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `vor ${diffInYears} ${diffInYears === 1 ? 'Jahr' : 'Jahren'}`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Ungültiges Datum';
  }
};
