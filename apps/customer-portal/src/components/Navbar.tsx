import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">247Vitrine</Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-primary-200 transition-colors">Home</Link>
          <Link to="/features" className="hover:text-primary-200 transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-primary-200 transition-colors">Preise</Link>
          <Link to="/contact" className="hover:text-primary-200 transition-colors">Kontakt</Link>
        </div>
        
        <div className="flex space-x-4">
          <Link to="/login" className="px-4 py-2 rounded hover:bg-primary-600 transition-colors">Login</Link>
          <Link to="/register" className="px-4 py-2 bg-white text-primary-700 rounded hover:bg-gray-100 transition-colors">Registrieren</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
