import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cityService } from '../../services/api';
import SearchableDropdown from '../../components/common/SearchableDropdown';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [purpose, setPurpose] = useState('buy');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Islamabad');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [loadingAreas, setLoadingAreas] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchCityAreas(selectedCity);
    }
  }, [selectedCity]);

  const fetchCities = async () => {
    try {
      const response = await cityService.getCities();
      if (response.success) {
        // Filter to show only Islamabad and Rawalpindi
        const filteredCities = response.data.filter(
          city => city.name === 'Islamabad' || city.name === 'Rawalpindi'
        );
        setCities(filteredCities.map(city => city.name));
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Set default cities if API fails
      setCities(['Islamabad', 'Rawalpindi']);
    }
  };

  const fetchCityAreas = async (cityName) => {
    try {
      setLoadingAreas(true);
      const response = await cityService.getCityAreas(cityName);
      if (response.success) {
        setAreas(response.data || []);
        setSelectedArea(''); // Reset area when city changes
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.append('purpose', purpose);
    if (activeTab !== 'all') params.append('propertyType', activeTab);
    if (selectedCity) params.append('city', selectedCity);
    if (selectedArea) params.append('area', selectedArea);

    navigate(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedCity('Islamabad');
    setSelectedArea('');
    setPurpose('buy');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-20 bg-cover bg-center" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1920')"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Find Your Dream Property
            </h1>
            <p className="text-xl text-gray-200 drop-shadow-md">
              Browse thousands of properties across Pakistan
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto border border-gray-300">
            {/* Property Type Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  activeTab === 'home'
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Homes
              </button>
              <button
                onClick={() => setActiveTab('plot')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  activeTab === 'plot'
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Plots
              </button>
              <button
                onClick={() => setActiveTab('commercial')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  activeTab === 'commercial'
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Commercial
              </button>
            </div>

            <div className="text-center text-gray-500 text-sm mb-4">
              Search by city, location, or property type
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Search properties for sale in Pakistan
            </h2>

            {/* Purpose Tabs */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setPurpose('buy')}
                className={`px-8 py-2 rounded-md font-medium transition ${
                  purpose === 'buy'
                    ? 'bg-white text-gray-900 border-2 border-gray-600 shadow-sm'
                    : 'bg-gray-700 text-white hover:bg-gray-800'
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => setPurpose('rent')}
                className={`px-8 py-2 rounded-md font-medium transition ${
                  purpose === 'rent'
                    ? 'bg-white text-gray-900 border-2 border-gray-600 shadow-sm'
                    : 'bg-gray-700 text-white hover:bg-gray-800'
                }`}
              >
                RENT
              </button>
            </div>

            {/* Search Form */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              {/* City Searchable Dropdown */}
              <div className="flex-1">
                <SearchableDropdown
                  label="City"
                  options={cities.length > 0 ? cities : ['Islamabad', 'Rawalpindi']}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder="Select city"
                />
              </div>

              {/* Area/Sector Searchable Dropdown */}
              <div className="flex-1">
                <SearchableDropdown
                  label="Area / Sector"
                  options={areas}
                  value={selectedArea}
                  onChange={setSelectedArea}
                  placeholder={loadingAreas ? 'Loading areas...' : areas.length === 0 ? 'No areas available' : 'Select area or sector'}
                  disabled={loadingAreas}
                />
              </div>

              {/* Find Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto px-12 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-md hover:from-gray-700 hover:to-gray-800 transition shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  FIND
                </button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => navigate('/properties')}
                className="text-gray-700 hover:text-gray-900 mx-2 font-medium"
              >
                More Options
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-gray-600 hover:text-gray-800 mx-2">
                Change Currency
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-gray-600 hover:text-gray-800 mx-2">
                Change Area Units
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-800 mx-2 font-medium"
              >
                Reset Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Browse by Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Homes */}
            <button
              onClick={() => {
                setActiveTab('home');
                navigate('/properties?propertyType=home');
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-200 hover:border-gray-600"
            >
              <div className="h-56 bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                <span className="text-8xl">🏠</span>
              </div>
              <div className="p-6 text-left bg-gray-50 group-hover:bg-white transition">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-gray-700 transition">
                  Homes
                </h3>
                <p className="text-gray-600">
                  Houses, Flats, Upper Portions & More
                </p>
              </div>
            </button>

            {/* Plots */}
            <button
              onClick={() => {
                setActiveTab('plot');
                navigate('/properties?propertyType=plot');
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-200 hover:border-gray-700"
            >
              <div className="h-56 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <span className="text-8xl">📐</span>
              </div>
              <div className="p-6 text-left bg-gray-50 group-hover:bg-white transition">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-gray-700 transition">
                  Plots
                </h3>
                <p className="text-gray-600">
                  Residential & Commercial Plots
                </p>
              </div>
            </button>

            {/* Commercial */}
            <button
              onClick={() => {
                setActiveTab('commercial');
                navigate('/properties?propertyType=commercial');
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-200 hover:border-gray-900"
            >
              <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <span className="text-8xl">🏢</span>
              </div>
              <div className="p-6 text-left bg-gray-50 group-hover:bg-white transition">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-gray-900 transition">
                  Commercial
                </h3>
                <p className="text-gray-600">
                  Offices, Shops, Warehouses & More
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Explore More Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore More
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* New Projects */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
              <div className="text-4xl mb-3">🏗️</div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">New Projects</h3>
              <p className="text-sm text-gray-600">Explore latest projects</p>
            </div>

            {/* Property Calculator */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
              <div className="text-4xl mb-3">🧮</div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Cost Calculator</h3>
              <p className="text-sm text-gray-600">Calculate property costs</p>
            </div>

            {/* Home Loan Calculator */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Loan Calculator</h3>
              <p className="text-sm text-gray-600">Calculate home loans</p>
            </div>

            {/* Area Converter */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
              <div className="text-4xl mb-3">📏</div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Area Converter</h3>
              <p className="text-sm text-gray-600">Convert area units</p>
            </div>

            {/* Area Guides */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Area Guides</h3>
              <p className="text-sm text-gray-600">Explore local areas</p>
            </div>

            {/* Property Trends */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Property Trends</h3>
              <p className="text-sm text-gray-600">Market insights</p>
            </div>

            {/* Plot Finder */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Plot Finder</h3>
              <p className="text-sm text-gray-600">Find your ideal plot</p>
            </div>

            {/* Property News */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
              <div className="text-4xl mb-3">📰</div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Property News</h3>
              <p className="text-sm text-gray-600">Latest real estate news</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Locations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Popular Locations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Islamabad */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Islamabad</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/properties?city=Islamabad&area=F-10')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in F-10
                </button>
                <button onClick={() => navigate('/properties?city=Islamabad&area=F-11')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in F-11
                </button>
                <button onClick={() => navigate('/properties?city=Islamabad&area=G-10')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in G-10
                </button>
                <button onClick={() => navigate('/properties?city=Islamabad&area=G-11')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in G-11
                </button>
                <button onClick={() => navigate('/properties?city=Islamabad&area=DHA')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in DHA
                </button>
                <button onClick={() => navigate('/properties?city=Islamabad&area=Bahria Town')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in Bahria Town
                </button>
              </div>
            </div>

            {/* Rawalpindi */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Rawalpindi</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/properties?city=Rawalpindi&area=Bahria Town')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in Bahria Town
                </button>
                <button onClick={() => navigate('/properties?city=Rawalpindi&area=Saddar')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in Saddar
                </button>
                <button onClick={() => navigate('/properties?city=Rawalpindi&area=Satellite Town')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in Satellite Town
                </button>
                <button onClick={() => navigate('/properties?city=Rawalpindi&area=DHA')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in DHA
                </button>
                <button onClick={() => navigate('/properties?city=Rawalpindi&area=Gulraiz')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in Gulraiz
                </button>
                <button onClick={() => navigate('/properties?city=Rawalpindi&area=PWD')} className="text-left text-gray-700 hover:text-gray-900 hover:underline text-sm py-1">
                  Properties in PWD
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
