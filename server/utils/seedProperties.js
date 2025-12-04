import Property from '../models/Property.js';
import User from '../models/User.js';

// Demo images from internet - using Unsplash with proper parameters
const homeImages = [
  [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&q=80',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80'
  ]
];

const plotImages = [
  [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80'
  ]
];

const commercialImages = [
  [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80'
  ]
];

// Helper function to generate varied properties
const generateProperties = () => {
  const cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi'];
  const islamabadAreas = ['F-10', 'F-11', 'G-10', 'G-11', 'DHA', 'Bahria Town'];
  const rawalpindiAreas = ['Bahria Town', 'Saddar', 'Satellite Town', 'DHA', 'Gulraiz', 'PWD'];
  const lahoreAreas = ['DHA Phase 6', 'Bahria Town', 'Gulberg', 'Johar Town', 'Model Town', 'Cantt'];
  const karachiAreas = ['DHA Phase 8', 'Clifton', 'Bahria Town', 'North Nazimabad', 'Gulshan-e-Iqbal'];

  const properties = [];

  // ========== HOMES FOR SALE (20) ==========
  const homeTitles = [
    'Luxury Villa', 'Modern House', 'Beautiful Bungalow', 'Spacious Home', 'Contemporary House',
    'Elegant Residence', 'Family House', 'Stylish Home', 'Comfortable House', 'Premium Villa',
    'Cozy House', 'Designer Home', 'Classic House', 'Grand Villa', 'Smart Home',
    'Traditional House', 'Lavish Bungalow', 'Charming Home', 'Sophisticated House', 'Peaceful Residence'
  ];

  for (let i = 0; i < 20; i++) {
    const city = cities[i % cities.length];
    const area = city === 'Islamabad' ? islamabadAreas[i % islamabadAreas.length] :
                 city === 'Rawalpindi' ? rawalpindiAreas[i % rawalpindiAreas.length] :
                 city === 'Lahore' ? lahoreAreas[i % lahoreAreas.length] :
                 karachiAreas[i % karachiAreas.length];

    properties.push({
      title: `${homeTitles[i]} with ${3 + (i % 5)} Bedrooms in ${area}`,
      description: `Beautiful ${homeTitles[i].toLowerCase()} featuring modern amenities, spacious rooms, and excellent location. This property offers ${3 + (i % 5)} bedrooms, ${2 + (i % 4)} bathrooms, and premium finishes throughout. Perfect for families looking for comfort and style in ${area}.`,
      purpose: 'buy',
      propertyType: 'home',
      subType: i % 3 === 0 ? 'house' : i % 3 === 1 ? 'flat' : 'penthouse',
      price: 5000000 + (i * 3000000) + (i % 10) * 500000,
      area: { value: 5 + (i * 2), unit: i % 2 === 0 ? 'marla' : 'kanal' },
      location: {
        city: city,
        area: area,
        address: `Block ${String.fromCharCode(65 + (i % 10))}, ${area}`
      },
      features: {
        bedrooms: 3 + (i % 5),
        bathrooms: 2 + (i % 4),
        parking: 1 + (i % 3),
        furnished: i % 3 === 0
      },
      images: homeImages[i % homeImages.length],
      status: 'active',
      featured: i % 4 === 0
    });
  }

  // ========== HOMES FOR RENT (20) ==========
  const rentTitles = [
    'Furnished Apartment', 'Upper Portion', 'Lower Portion', 'Studio Apartment', 'Flat',
    'Penthouse', 'Family Home', 'Bachelor Pad', 'Serviced Apartment', 'Duplex',
    'Townhouse', 'Garden Home', 'Terrace House', 'Loft Apartment', 'Villa',
    'Cottage', 'Bungalow Portion', 'Independent Floor', 'Corner House', 'End Unit'
  ];

  for (let i = 0; i < 20; i++) {
    const city = cities[i % cities.length];
    const area = city === 'Islamabad' ? islamabadAreas[i % islamabadAreas.length] :
                 city === 'Rawalpindi' ? rawalpindiAreas[i % rawalpindiAreas.length] :
                 city === 'Lahore' ? lahoreAreas[i % lahoreAreas.length] :
                 karachiAreas[i % karachiAreas.length];

    properties.push({
      title: `${rentTitles[i]} ${i % 2 === 0 ? 'for Rent' : 'Available'} in ${area}`,
      description: `Well-maintained ${rentTitles[i].toLowerCase()} available for rent in prime location of ${area}. Features ${2 + (i % 4)} bedrooms, modern kitchen, and all necessary amenities. ${i % 3 === 0 ? 'Fully furnished with appliances.' : 'Unfurnished ready to move in.'} Ideal for ${i % 2 === 0 ? 'families' : 'professionals'}.`,
      purpose: 'rent',
      propertyType: 'home',
      subType: i % 4 === 0 ? 'upper-portion' : i % 4 === 1 ? 'lower-portion' : i % 4 === 2 ? 'flat' : 'house',
      price: 25000 + (i * 15000) + (i % 10) * 5000,
      area: { value: 3 + (i * 0.5), unit: i % 2 === 0 ? 'marla' : 'kanal' },
      location: {
        city: city,
        area: area,
        address: `Block ${String.fromCharCode(65 + (i % 10))}, ${area}`
      },
      features: {
        bedrooms: 2 + (i % 4),
        bathrooms: 2 + (i % 3),
        parking: 1 + (i % 2),
        furnished: i % 3 === 0
      },
      images: homeImages[i % homeImages.length],
      status: 'active',
      featured: i % 5 === 0
    });
  }

  // ========== PLOTS FOR SALE (20) ==========
  const plotTypes = [
    'Residential', 'Corner', 'Park Facing', 'Boulevard', 'Main Road',
    'Prime Location', 'Investment', 'Development', 'Agricultural', 'Commercial',
    'Industrial', 'Farmhouse', 'Society', 'Gated Community', 'Developed',
    'Undeveloped', 'Near Park', 'Near Market', 'Near School', 'Near Mosque'
  ];

  for (let i = 0; i < 20; i++) {
    const city = cities[i % cities.length];
    const area = city === 'Islamabad' ? islamabadAreas[i % islamabadAreas.length] :
                 city === 'Rawalpindi' ? rawalpindiAreas[i % rawalpindiAreas.length] :
                 city === 'Lahore' ? lahoreAreas[i % lahoreAreas.length] :
                 karachiAreas[i % karachiAreas.length];

    properties.push({
      title: `${plotTypes[i]} Plot ${5 + (i * 3)} Marla in ${area}`,
      description: `${plotTypes[i]} plot available for sale in ${area}. Clear title, all NOCs approved, and utilities available. ${i % 2 === 0 ? 'Possession ready, ideal for building your dream home.' : 'Great investment opportunity in rapidly developing area.'} Located in prime location with easy access to main roads and facilities.`,
      purpose: 'buy',
      propertyType: 'plot',
      subType: i % 5 === 0 ? 'agricultural' : i % 5 === 1 ? 'commercial' : i % 5 === 2 ? 'industrial' : 'residential',
      price: 2000000 + (i * 800000) + (i % 10) * 200000,
      area: { value: 5 + (i * 2), unit: i % 3 === 0 ? 'kanal' : 'marla' },
      location: {
        city: city,
        area: area,
        address: `Block ${String.fromCharCode(65 + (i % 10))}, ${area}`
      },
      features: {
        bedrooms: 0,
        bathrooms: 0,
        parking: 0,
        furnished: false
      },
      images: plotImages[i % plotImages.length],
      status: 'active',
      featured: i % 5 === 0
    });
  }

  // ========== COMMERCIAL PROPERTIES (20) ==========
  const commercialTypes = [
    'Shop', 'Office', 'Plaza', 'Warehouse', 'Showroom',
    'Restaurant Space', 'Retail Store', 'Building', 'Mall Space', 'Factory',
    'Gym Space', 'Salon Space', 'Clinic', 'Call Center', 'Co-working Space',
    'Hotel', 'Guest House', 'Banquet Hall', 'Petrol Pump', 'Car Showroom'
  ];

  for (let i = 0; i < 20; i++) {
    const city = cities[i % cities.length];
    const area = city === 'Islamabad' ? islamabadAreas[i % islamabadAreas.length] :
                 city === 'Rawalpindi' ? rawalpindiAreas[i % rawalpindiAreas.length] :
                 city === 'Lahore' ? lahoreAreas[i % lahoreAreas.length] :
                 karachiAreas[i % karachiAreas.length];

    const isForRent = i % 2 === 0;

    properties.push({
      title: `${commercialTypes[i]} ${isForRent ? 'for Rent' : 'for Sale'} in ${area}`,
      description: `Prime commercial ${commercialTypes[i].toLowerCase()} ${isForRent ? 'available for rent' : 'for sale'} in ${area}. ${i % 3 === 0 ? 'Corner location with high visibility and foot traffic.' : 'Excellent location with ample parking and easy access.'} ${isForRent ? 'Ready to occupy with all facilities.' : 'Great investment opportunity with high rental yield potential.'}`,
      purpose: isForRent ? 'rent' : 'buy',
      propertyType: 'commercial',
      subType: i % 6 === 0 ? 'office' : i % 6 === 1 ? 'shop' : i % 6 === 2 ? 'warehouse' : i % 6 === 3 ? 'plaza' : i % 6 === 4 ? 'showroom' : 'building',
      price: isForRent ? (50000 + (i * 30000)) : (5000000 + (i * 2000000)),
      area: { value: 500 + (i * 300), unit: 'sq-ft' },
      location: {
        city: city,
        area: area,
        address: `${i % 2 === 0 ? 'Main' : 'Commercial'} ${area}`
      },
      features: {
        bedrooms: 0,
        bathrooms: 1 + (i % 3),
        parking: 2 + (i % 5),
        furnished: i % 4 === 0
      },
      images: commercialImages[i % commercialImages.length],
      status: 'active',
      featured: i % 4 === 0
    });
  }

  return properties;
};

export const sampleProperties = generateProperties();

// Seed function
export const seedProperties = async () => {
  try {
    console.log('🌱 Starting property seeding...');

    // Check if properties already exist
    const existingCount = await Property.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} properties. Skipping seed.`);
      console.log('💡 To reseed, delete existing properties first using DELETE /api/properties/seed');
      return {
        success: false,
        message: `Database already has ${existingCount} properties`,
        count: existingCount
      };
    }

    // Find or create a default user to be the owner
    let defaultUser = await User.findOne({ email: 'admin@zameen.com' });

    if (!defaultUser) {
      console.log('📝 Creating default admin user...');
      defaultUser = await User.create({
        name: 'Zameen Admin',
        email: 'admin@zameen.com',
        password: 'admin123456',
        phone: '+92-300-1234567',
        role: 'admin'
      });
      console.log('✅ Default admin user created');
    }

    // Add owner to each property
    const propertiesWithOwner = sampleProperties.map(prop => ({
      ...prop,
      owner: defaultUser._id
    }));

    // Insert properties
    const insertedProperties = await Property.insertMany(propertiesWithOwner);

    console.log(`✅ Successfully seeded ${insertedProperties.length} properties!`);
    console.log(`📊 Breakdown:`);
    console.log(`   - Homes for sale: ${insertedProperties.filter(p => p.propertyType === 'home' && p.purpose === 'buy').length}`);
    console.log(`   - Homes for rent: ${insertedProperties.filter(p => p.propertyType === 'home' && p.purpose === 'rent').length}`);
    console.log(`   - Plots for sale: ${insertedProperties.filter(p => p.propertyType === 'plot').length}`);
    console.log(`   - Commercial properties: ${insertedProperties.filter(p => p.propertyType === 'commercial').length}`);

    return {
      success: true,
      message: `Successfully seeded ${insertedProperties.length} properties`,
      count: insertedProperties.length,
      breakdown: {
        homesForSale: insertedProperties.filter(p => p.propertyType === 'home' && p.purpose === 'buy').length,
        homesForRent: insertedProperties.filter(p => p.propertyType === 'home' && p.purpose === 'rent').length,
        plots: insertedProperties.filter(p => p.propertyType === 'plot').length,
        commercial: insertedProperties.filter(p => p.propertyType === 'commercial').length
      },
      adminUser: {
        email: 'admin@zameen.com',
        password: 'admin123456'
      }
    };

  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    throw error;
  }
};

// Clear all properties (use with caution!)
export const clearProperties = async () => {
  try {
    const result = await Property.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} properties`);
    return {
      success: true,
      message: `Deleted ${result.deletedCount} properties`,
      count: result.deletedCount
    };
  } catch (error) {
    console.error('❌ Error clearing properties:', error);
    throw error;
  }
};
