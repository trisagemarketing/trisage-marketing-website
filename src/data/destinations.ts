export interface CountryData {
  id: string;
  name: string;
  svgPath: string; // Path to load the vector asset
  viewBox: string;
  themeColor: string;
}

export interface DestinationStory {
  id: string;
  countryId: string;
  title: string;
  subtitle: string;
  heroImage: string;
  shortStory: string;
  hospitalityHighlights: string[];
  statistics: { label: string; value: string }[];
  ctaLabel: string;
  coordinates: { x: number; y: number }; // Local SVG coordinates for the country map
}

export const COUNTRIES: Record<string, CountryData> = {
  ind: {
    id: 'ind',
    name: 'India',
    svgPath: '/assets/maps/india.svg',
    viewBox: '0 0 1024 1024',
    themeColor: 'var(--color-secondary-400)'
  },
  are: {
    id: 'are',
    name: 'United Arab Emirates',
    svgPath: '/assets/maps/uae.svg',
    viewBox: '0 0 800 600',
    themeColor: 'var(--color-secondary-400)'
  }
};

export const DESTINATIONS: Record<string, DestinationStory> = {
  'haridwar': {
    id: 'haridwar',
    countryId: 'ind',
    title: 'Haridwar',
    subtitle: 'Spiritual Heritage & Luxury',
    heroImage: '/assets/destinations/haridwar.jpg',
    shortStory: 'Our largest portfolio hub. We manage a diverse range of premium hotels and resorts right at the spiritual heart of the Ganges.',
    hospitalityHighlights: [
      'Villasita',
      'Shri Bhagwan Gopidham',
      'Hotel Satnaam',
      'Hotel Khush Ganga Heritage',
      'Ananat Dhara, Dheer Ganga & Hotel Amaya'
    ],
    statistics: [
      { label: 'Properties', value: '7' },
      { label: 'Category', value: 'Hotels & Resorts' },
      { label: 'Location', value: 'Uttarakhand' }
    ],
    ctaLabel: 'View Haridwar Portfolio',
    coordinates: { x: 300, y: 250 } 
  },
  'dehradun': {
    id: 'dehradun',
    countryId: 'ind',
    title: 'Dehradun',
    subtitle: 'Valley Retreats',
    heroImage: 'https://ik.imagekit.io/rrcdbevrb/ChatGPT%20Image%20Jul%209,%202026,%2003_43_25%20PM.png',
    shortStory: 'Nestled in the Doon Valley, our Dehradun properties offer the perfect blend of natural serenity and premium hospitality.',
    hospitalityHighlights: [
      'Megha Resort',
      'Hornbill (AirBnB)'
    ],
    statistics: [
      { label: 'Properties', value: '2' },
      { label: 'Category', value: 'Resort & AirBnB' },
      { label: 'Location', value: 'Uttarakhand' }
    ],
    ctaLabel: 'View Dehradun Portfolio',
    coordinates: { x: 280, y: 230 } 
  },
  'rishikesh': {
    id: 'rishikesh',
    countryId: 'ind',
    title: 'Rishikesh',
    subtitle: 'Wellness & Adventure',
    heroImage: 'https://avyantahotels.com/uploads/Copy-of-ARP09147-HDR-copy_11_11zon-1783074261745.webp',
    shortStory: 'The yoga capital of the world. We offer premium resort experiences tailored for wellness, spiritual retreats, and adventure.',
    hospitalityHighlights: [
      'Sukh Saklana Haveli (Avyanta) - Premium Resort'
    ],
    statistics: [
      { label: 'Properties', value: '1' },
      { label: 'Category', value: 'Premium Resort' },
      { label: 'Location', value: 'Uttarakhand' }
    ],
    ctaLabel: 'Explore Rishikesh',
    coordinates: { x: 310, y: 240 } 
  },
  'sonipat': {
    id: 'sonipat',
    countryId: 'ind',
    title: 'Sonipat',
    subtitle: 'Urban Escapes',
    heroImage: 'https://ik.imagekit.io/rrcdbevrb/ChatGPT%20Image%20Jul%209,%202026,%2003_37_39%20PM.png',
    shortStory: 'Strategically located near the NCR, TreeHouse Velis offers premium hotel stays, dining, and banquets for business & leisure travelers.',
    hospitalityHighlights: [
      'TreeHouse Velis'
    ],
    statistics: [
      { label: 'Properties', value: '1' },
      { label: 'Category', value: 'Business & Leisure' },
      { label: 'Location', value: 'Haryana (NCR)' }
    ],
    ctaLabel: 'View Sonipat Properties',
    coordinates: { x: 290, y: 260 } 
  }
};
