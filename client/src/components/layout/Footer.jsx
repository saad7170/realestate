import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">7 star estate</h3>
            <p className="text-gray-400 text-sm">
              Your trusted platform for buying, selling, and renting properties across Pakistan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?purpose=buy" className="text-gray-400 hover:text-white transition">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/properties?purpose=rent" className="text-gray-400 hover:text-white transition">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link to="/properties?category=projects" className="text-gray-400 hover:text-white transition">
                  New Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?category=homes" className="text-gray-400 hover:text-white transition">
                  Homes
                </Link>
              </li>
              <li>
                <Link to="/properties?category=plots" className="text-gray-400 hover:text-white transition">
                  Plots
                </Link>
              </li>
              <li>
                <Link to="/properties?category=commercial" className="text-gray-400 hover:text-white transition">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: info@propertyhub.pk</li>
              <li>Phone: +92 300 1234567</li>
              <li>Address: Islamabad, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} 7 star estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
