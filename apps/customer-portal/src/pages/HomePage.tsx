import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Deine professionelle Handwerker-Website in Minuten</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Mit 247Vitrine erstellst du mit wenigen Klicks deine eigene Website, wirst sichtbar und baust deine digitale Präsenz auf.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-3 bg-white text-primary-700 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Jetzt starten
            </Link>
            <Link to="/features" className="px-8 py-3 border border-white rounded-md font-semibold hover:bg-primary-600 transition-colors">
              Mehr erfahren
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Alles was du brauchst</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-primary-600 text-4xl mb-4">
                <i className="fas fa-paint-brush"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">No-Code Website-Builder</h3>
              <p className="text-gray-600">
                Erstelle deine Website mit unserem einfachen Formular-basierten Builder - keine Programmierkenntnisse erforderlich.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-primary-600 text-4xl mb-4">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
              <p className="text-gray-600">
                Deine Website sieht auf allen Geräten perfekt aus - vom Smartphone bis zum Desktop.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-primary-600 text-4xl mb-4">
                <i className="fas fa-images"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bildergalerie für Projekte</h3>
              <p className="text-gray-600">
                Präsentiere deine besten Arbeiten in einer professionellen Bildergalerie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Bereit, deine digitale Präsenz aufzubauen?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Starte noch heute und erstelle deine professionelle Handwerker-Website in wenigen Minuten.
          </p>
          <Link to="/register" className="px-8 py-3 bg-primary-600 text-white rounded-md font-semibold hover:bg-primary-700 transition-colors">
            Kostenlos testen
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
