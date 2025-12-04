import City from '../models/City.js';

const cities = [
  {
    name: 'Islamabad',
    slug: 'islamabad',
    popularAreas: [
      'DHA Islamabad',
      'Bahria Town',
      'F-6',
      'F-7',
      'F-8',
      'F-10',
      'F-11',
      'G-6',
      'G-7',
      'G-8',
      'G-9',
      'G-10',
      'G-11',
      'I-8',
      'I-9',
      'I-10',
      'Blue Area',
      'PWD',
      'Gulberg Greens',
      'Sector E-11'
    ],
    isActive: true
  },
  {
    name: 'Karachi',
    slug: 'karachi',
    popularAreas: [
      'DHA Phase 1',
      'DHA Phase 2',
      'DHA Phase 5',
      'DHA Phase 6',
      'DHA Phase 7',
      'DHA Phase 8',
      'Clifton',
      'Gulshan-e-Iqbal',
      'Gulistan-e-Jauhar',
      'Malir',
      'Nazimabad',
      'North Karachi',
      'North Nazimabad',
      'PECHS',
      'Saddar',
      'Bahria Town Karachi'
    ],
    isActive: true
  },
  {
    name: 'Lahore',
    slug: 'lahore',
    popularAreas: [
      'DHA Phase 1',
      'DHA Phase 2',
      'DHA Phase 3',
      'DHA Phase 4',
      'DHA Phase 5',
      'DHA Phase 6',
      'DHA Phase 7',
      'DHA Phase 8',
      'DHA Phase 9',
      'Bahria Town',
      'Gulberg',
      'Johar Town',
      'Model Town',
      'Wapda Town',
      'Cantt',
      'Garden Town',
      'Iqbal Town',
      'Faisal Town',
      'Allama Iqbal Town'
    ],
    isActive: true
  },
  {
    name: 'Rawalpindi',
    slug: 'rawalpindi',
    popularAreas: [
      'Bahria Town Phase 1',
      'Bahria Town Phase 2',
      'Bahria Town Phase 3',
      'Bahria Town Phase 4',
      'Bahria Town Phase 7',
      'Bahria Town Phase 8',
      'DHA Phase 1',
      'DHA Phase 2',
      'Satellite Town',
      'Saddar',
      'Commercial Market',
      'Chaklala Scheme',
      'Gulzar-e-Quaid',
      'PWD Road',
      'Westridge'
    ],
    isActive: true
  },
  {
    name: 'Faisalabad',
    slug: 'faisalabad',
    popularAreas: [
      'Canal Road',
      'Civil Lines',
      'D Ground',
      'Eden Valley',
      'Kohinoor City',
      'Model Town',
      'Peoples Colony',
      'Samanabad',
      'Sargodha Road',
      'Susan Road'
    ],
    isActive: true
  },
  {
    name: 'Multan',
    slug: 'multan',
    popularAreas: [
      'Bahauddin Zakariya University',
      'Bosan Road',
      'Cantt',
      'DHA Multan',
      'Gulgasht Colony',
      'Model Town',
      'New Multan',
      'Officers Colony',
      'Royal Orchard',
      'Shah Rukn-e-Alam Colony'
    ],
    isActive: true
  },
  {
    name: 'Peshawar',
    slug: 'peshawar',
    popularAreas: [
      'Hayatabad',
      'University Town',
      'Regi Model Town',
      'Gulbahar',
      'Saddar',
      'Cantt',
      'Phase 5 Hayatabad',
      'Phase 6 Hayatabad',
      'Phase 7 Hayatabad',
      'Ring Road'
    ],
    isActive: true
  },
  {
    name: 'Quetta',
    slug: 'quetta',
    popularAreas: [
      'Satellite Town',
      'Samungli Road',
      'Jinnah Town',
      'Zarghoon Road',
      'Chiltan Housing Scheme',
      'Gulistan Road',
      'Model Town',
      'Cantt',
      'Brewery Road',
      'Hanna Road'
    ],
    isActive: true
  },
  {
    name: 'Sialkot',
    slug: 'sialkot',
    popularAreas: [
      'Cantt',
      'Defence Road',
      'Gulshan-e-Iqbal',
      'Model Town',
      'Paris Road',
      'Pasrur Road',
      'Rangpura',
      'Sambrial Road',
      'Satrah',
      'Zafarwal Road'
    ],
    isActive: true
  },
  {
    name: 'Gujranwala',
    slug: 'gujranwala',
    popularAreas: [
      'Cantt',
      'Civil Lines',
      'DC Road',
      'Model Town',
      'Peoples Colony',
      'Rahwali Cantt',
      'Satellite Town',
      'Wapda Town',
      'GT Road',
      'Green Cap Housing Society'
    ],
    isActive: true
  }
];

const seedCities = async () => {
  try {
    // Delete existing cities
    await City.deleteMany();
    console.log('Existing cities deleted');

    // Insert new cities
    await City.insertMany(cities);
    console.log('Cities seeded successfully');

    return { success: true, count: cities.length };
  } catch (error) {
    console.error('Error seeding cities:', error.message);
    throw error;
  }
};

export { seedCities, cities };
