import axios, { AxiosError } from 'axios';

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Handle server response errors
    if (axiosError.response) {
      const { data, status } = axiosError.response;
      
      // If the server returned an error message
      if (data && data.message) {
        return {
          message: data.message,
          code: data.code,
          status,
        };
      }
      
      // Generic error based on status code
      return {
        message: getErrorMessageByStatus(status),
        status,
      };
    }
    
    // Handle request errors (network issues, etc.)
    if (axiosError.request) {
      return {
        message: 'Keine Antwort vom Server erhalten. Bitte überprüfe deine Internetverbindung.',
        code: 'NETWORK_ERROR',
      };
    }
    
    // Handle other axios errors
    return {
      message: axiosError.message || 'Ein unbekannter Fehler ist aufgetreten.',
      code: 'UNKNOWN_ERROR',
    };
  }
  
  // Handle non-axios errors
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'CLIENT_ERROR',
    };
  }
  
  // Fallback for unknown error types
  return {
    message: 'Ein unbekannter Fehler ist aufgetreten.',
    code: 'UNKNOWN_ERROR',
  };
};

// Helper function to get error message based on HTTP status code
const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'Ungültige Anfrage. Bitte überprüfe deine Eingaben.';
    case 401:
      return 'Nicht autorisiert. Bitte melde dich erneut an.';
    case 403:
      return 'Zugriff verweigert. Du hast keine Berechtigung für diese Aktion.';
    case 404:
      return 'Ressource nicht gefunden.';
    case 409:
      return 'Konflikt mit dem aktuellen Zustand der Ressource.';
    case 422:
      return 'Validierungsfehler. Bitte überprüfe deine Eingaben.';
    case 429:
      return 'Zu viele Anfragen. Bitte versuche es später erneut.';
    case 500:
      return 'Interner Serverfehler. Bitte versuche es später erneut.';
    case 503:
      return 'Dienst nicht verfügbar. Bitte versuche es später erneut.';
    default:
      return `Fehler ${status}. Bitte versuche es später erneut.`;
  }
};
