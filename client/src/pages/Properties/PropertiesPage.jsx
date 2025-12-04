import { useSearchParams, Link } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const purpose = searchParams.get('purpose');
  const propertyType = searchParams.get('propertyType');
  const subType = searchParams.get('subType');
  const city = searchParams.get('city');
  const area = searchParams.get('area');

  const { properties, loading, error } = useProperties({ purpose, propertyType, subType, city, area });

  const handleSubTypeFilter = (selectedSubType) => {
    const params = {};
    if (purpose) params.purpose = purpose;
    if (propertyType) params.propertyType = propertyType;
    if (selectedSubType) params.subType = selectedSubType;
    if (city) params.city = city;
    if (area) params.area = area;
    setSearchParams(params);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Define subType options based on propertyType
  const getSubTypeOptions = () => {
    if (propertyType === 'home') {
      return ['house', 'flat', 'penthouse', 'upper-portion', 'lower-portion'];
    } else if (propertyType === 'plot') {
      return ['residential', 'commercial', 'agricultural', 'industrial'];
    } else if (propertyType === 'commercial') {
      return ['office', 'shop', 'warehouse', 'plaza', 'showroom', 'building'];
    }
    return [];
  };

  const subTypeOptions = getSubTypeOptions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {propertyType ? `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} Properties` :
           purpose ? `Properties for ${purpose.charAt(0).toUpperCase() + purpose.slice(1)}` :
           'All Properties'}
          {subType && (
            <span className="ml-3 text-2xl text-gray-600">
              • {subType.charAt(0).toUpperCase() + subType.slice(1).replace('-', ' ')}
            </span>
          )}
          {city && (
            <span className="ml-3 text-2xl text-gray-600">
              • {city}
            </span>
          )}
        </h1>
        <p className="text-gray-600">
          {properties.length} properties found
          {subType && <span className="font-semibold"> in {subType.replace('-', ' ')} category</span>}
          {city && <span className="font-semibold"> in {city}</span>}
          {area && <span className="font-semibold"> • {area}</span>}
        </p>

        {/* SubType Filters */}
        {subTypeOptions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Type:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSubTypeFilter(null)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  !subType
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {subTypeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSubTypeFilter(option)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    subType === option
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link
              key={property._id}
              to={`/properties/${property._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition block"
            >
              <div className="h-48 bg-gray-200">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 hover:text-gray-700 transition">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{property.location?.city}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold text-xl">
                    PKR {property.price?.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {property.area?.value} {property.area?.unit}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {property.propertyType}
                  </span>
                  {property.subType && (
                    <span className={`inline-block text-xs px-3 py-1 rounded font-bold capitalize transition ${
                      subType === property.subType
                        ? 'bg-gray-600 text-white ring-2 ring-gray-400 shadow-lg'
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {property.subType.replace('-', ' ')}
                    </span>
                  )}
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {property.purpose}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
