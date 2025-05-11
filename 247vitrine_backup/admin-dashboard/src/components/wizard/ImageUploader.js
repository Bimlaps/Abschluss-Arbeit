import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import './Wizard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Komponente zum Hochladen und Zuschneiden von Bildern mit festen Auflösungen
 * basierend auf dem ausgewählten Layout und Bildtyp
 */
function ImageUploader({ layoutType, imageType, onImageUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageResolution, setImageResolution] = useState({ width: 0, height: 0, aspectRatio: '1:1' });
  const imgRef = useRef(null);

  // Lade die Bildauflösungen basierend auf Layout und Bildtyp
  useEffect(() => {
    const fetchImageResolutions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/image-resolutions/${layoutType}/${imageType}`);
        const resolution = response.data;

        if (resolution) {
          setImageResolution(resolution);

          // Setze das Seitenverhältnis für den Crop
          if (resolution.aspectRatio) {
            const [width, height] = resolution.aspectRatio.split(':').map(Number);
            setCrop({ ...crop, aspect: width / height });
          }
        }
      } catch (error) {
        console.error('Error fetching image resolutions:', error);
        // Fallback-Werte
        const fallbackResolutions = {
          'one-page': {
            hero: { width: 1920, height: 1080, aspectRatio: '16:9' },
            about: { width: 800, height: 600, aspectRatio: '4:3' },
            gallery: { width: 600, height: 400, aspectRatio: '3:2' },
            logo: { width: 200, height: 80, aspectRatio: '5:2' }
          },
          'multi-page': {
            hero: { width: 1600, height: 800, aspectRatio: '2:1' },
            about: { width: 600, height: 600, aspectRatio: '1:1' },
            gallery: { width: 800, height: 600, aspectRatio: '4:3' },
            logo: { width: 180, height: 60, aspectRatio: '3:1' }
          },
          'sidebar': {
            hero: { width: 1200, height: 800, aspectRatio: '3:2' },
            about: { width: 500, height: 400, aspectRatio: '5:4' },
            gallery: { width: 400, height: 300, aspectRatio: '4:3' },
            logo: { width: 160, height: 60, aspectRatio: '8:3' }
          }
        };

        if (fallbackResolutions[layoutType] && fallbackResolutions[layoutType][imageType]) {
          const fallback = fallbackResolutions[layoutType][imageType];
          setImageResolution(fallback);

          const [width, height] = fallback.aspectRatio.split(':').map(Number);
          setCrop({ ...crop, aspect: width / height });
        }
      }
    };

    if (layoutType && imageType) {
      fetchImageResolutions();
    }
  }, [layoutType, imageType]);

  // Datei-Auswahl-Handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError('');

      // Erstelle eine Vorschau
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Bild-Lade-Handler
  const handleImageLoaded = (img) => {
    imgRef.current = img;
  };

  // Crop-Änderungs-Handler
  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  // Crop-Abschluss-Handler
  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
    makeClientCrop(crop);
  };

  // Erstellt ein zugeschnittenes Bild auf dem Client
  const makeClientCrop = async (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImg = await getCroppedImg(
        imgRef.current,
        crop,
        'cropped.jpg'
      );
      setCroppedImageUrl(croppedImg);
    }
  };

  // Hilfsfunktion zum Zuschneiden des Bildes
  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (!blob) return;
        blob.name = fileName;
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.95);
    });
  };

  // Upload-Handler
  const handleUpload = async () => {
    if (!completedCrop || !selectedFile) {
      setError('Bitte wähle ein Bild aus und schneide es zu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starte Bildupload...');
      console.log('Layout-Typ:', layoutType);
      console.log('Bild-Typ:', imageType);

      // Erstelle einen Blob aus dem zugeschnittenen Bild
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();

      // Erstelle ein File-Objekt
      const croppedFile = new File([blob], selectedFile.name, {
        type: 'image/jpeg',
      });

      console.log('Zugeschnittenes Bild erstellt:', croppedFile.name, croppedFile.size, 'Bytes');

      // Erstelle FormData für den Upload
      const formData = new FormData();
      formData.append('image', croppedFile);
      formData.append('layoutType', layoutType || 'one-page'); // Fallback, falls layoutType nicht gesetzt ist
      formData.append('imageType', imageType || 'hero'); // Fallback, falls imageType nicht gesetzt ist

      // Hole den Token aus dem localStorage
      const token = localStorage.getItem('token');
      console.log('Token vorhanden:', !!token);

      // Sende das Bild zum Server
      console.log('Sende Anfrage an:', `${API_URL}/api/upload-image`);
      const uploadResponse = await axios.post(`${API_URL}/api/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Server-Antwort:', uploadResponse.data);

      // Rufe die Callback-Funktion mit der Bild-URL auf
      if (uploadResponse.data.success) {
        // Füge die API-URL hinzu, falls die zurückgegebene URL relativ ist
        let imageUrl = uploadResponse.data.imageUrl;
        if (imageUrl.startsWith('/')) {
          imageUrl = `${API_URL}${imageUrl}`;
        }
        console.log('Vollständige Bild-URL:', imageUrl);
        onImageUploaded(imageUrl);

        // Zurücksetzen des Formulars
        setSelectedFile(null);
        setPreviewUrl('');
        setCroppedImageUrl('');
      } else {
        throw new Error(uploadResponse.data.message || 'Unbekannter Fehler beim Hochladen');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      let errorMessage = 'Fehler beim Hochladen des Bildes. Bitte versuche es später erneut.';

      if (error.response) {
        // Der Server hat mit einem Fehlercode geantwortet
        console.error('Server-Fehler:', error.response.data);
        errorMessage = `Server-Fehler: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        // Die Anfrage wurde gesendet, aber keine Antwort erhalten
        console.error('Keine Antwort vom Server:', error.request);
        errorMessage = 'Keine Antwort vom Server. Bitte überprüfe deine Internetverbindung.';
      } else {
        // Fehler beim Erstellen der Anfrage
        console.error('Anfragefehler:', error.message);
        errorMessage = `Fehler: ${error.message}`;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  // Kamera-Zugriff für mobile Geräte
  const handleCameraCapture = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.setAttribute('capture', 'environment');
      fileInput.setAttribute('accept', 'image/*');
      fileInput.click();
    }
  };

  return (
    <div className="image-uploader">
      <h3>Bild für {imageType} hochladen</h3>

      {imageResolution.width > 0 && (
        <p className="resolution-info">
          Empfohlene Auflösung: {imageResolution.width} x {imageResolution.height} Pixel
          (Seitenverhältnis {imageResolution.aspectRatio})
        </p>
      )}

      <div className="upload-buttons">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => document.getElementById('fileInput').click()}
        >
          Bild auswählen
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleCameraCapture}
        >
          Kamera öffnen
        </button>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{display: 'none'}}
        />
      </div>

      {selectedFile && (
        <p className="file-info">
          Ausgewählte Datei: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
        </p>
      )}

      {error && <p className="error-message">{error}</p>}

      {previewUrl && (
        <div className="crop-container">
          <h4>Bild zuschneiden</h4>
          <p>Ziehe den Ausschnitt, um das Bild zuzuschneiden.</p>

          <ReactCrop
            src={previewUrl}
            crop={crop}
            onImageLoaded={handleImageLoaded}
            onChange={handleCropChange}
            onComplete={handleCropComplete}
            className="react-crop"
          />
        </div>
      )}

      {croppedImageUrl && (
        <div className="preview-container">
          <h4>Vorschau</h4>
          <img
            src={croppedImageUrl}
            alt="Vorschau"
            className="cropped-preview"
          />

          <button
            type="button"
            className="btn-primary"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Wird hochgeladen...' : 'Bild hochladen'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
