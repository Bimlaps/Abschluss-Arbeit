import { useState } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // Mock-Daten für die Demonstration
  const [websites] = useState([
    {
      id: '1',
      name: 'Meine Handwerker-Website',
      subdomain: 'meine-firma',
      status: 'published',
      lastUpdated: '2023-04-15',
      template: 'Modern Blue',
    },
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/dashboard/create-website"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Neue Website erstellen
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Meine Websites</h2>
          
          {websites.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subdomain
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zuletzt aktualisiert
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {websites.map((website) => (
                    <tr key={website.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {website.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {website.subdomain}.247vitrine.ma
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {website.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {website.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {website.template}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link to={`/dashboard/edit/${website.id}`} className="text-primary-600 hover:text-primary-900">
                            Bearbeiten
                          </Link>
                          <Link to={`/dashboard/preview/${website.id}`} className="text-gray-600 hover:text-gray-900">
                            Vorschau
                          </Link>
                          <a href={`https://${website.subdomain}.247vitrine.ma`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-900">
                            Besuchen
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Du hast noch keine Websites erstellt.</p>
              <Link
                to="/dashboard/create-website"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Erste Website erstellen
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Schnellzugriff</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard/profile" className="text-primary-600 hover:text-primary-800 transition-colors">
                  Mein Profil bearbeiten
                </Link>
              </li>
              <li>
                <Link to="/dashboard/subscription" className="text-primary-600 hover:text-primary-800 transition-colors">
                  Mein Abonnement verwalten
                </Link>
              </li>
              <li>
                <Link to="/dashboard/domains" className="text-primary-600 hover:text-primary-800 transition-colors">
                  Domains verwalten
                </Link>
              </li>
              <li>
                <Link to="/dashboard/support" className="text-primary-600 hover:text-primary-800 transition-colors">
                  Support kontaktieren
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Statistiken</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Aktive Websites</p>
                <p className="text-2xl font-bold">{websites.filter(w => w.status === 'published').length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gesamte Websites</p>
                <p className="text-2xl font-bold">{websites.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Abonnement</p>
                <p className="text-2xl font-bold">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
