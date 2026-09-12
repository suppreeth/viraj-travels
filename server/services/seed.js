const { v4: uuidv4 } = require('uuid');
const db = require('./db');

function seedDatabase() {
  // Check if data already exists
  const existing = db.prepare('SELECT COUNT(*) as count FROM Destination').get();
  if (existing.count > 0) {
    console.log('Database already seeded.');
    return;
  }

  console.log('Seeding database...');

  // Destinations
  const destinations = [
    { id: uuidv4(), name: 'Goa', country: 'India', description: 'Famous for its pristine beaches, vibrant nightlife, and Portuguese colonial heritage.', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop', category: 'India', packageCount: 2 },
    { id: uuidv4(), name: 'Kashmir', country: 'India', description: 'Paradise on Earth, known for its breathtaking valleys, shimmering Dal Lake, and snow-capped peaks.', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop', category: 'India', packageCount: 1 },
    { id: uuidv4(), name: 'Kerala', country: 'India', description: 'God\'s Own Country — lush backwaters, ayurvedic retreats, and serene houseboat experiences.', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop', category: 'India', packageCount: 1 },
    { id: uuidv4(), name: 'Manali', country: 'India', description: 'A high-altitude Himalayan resort town with adventure sports, scenic valleys, and apple orchards.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop', category: 'India', packageCount: 1 },
    { id: uuidv4(), name: 'Rajasthan', country: 'India', description: 'The Land of Kings — magnificent palaces, golden deserts, rich culture, and royal heritage.', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop', category: 'India', packageCount: 1 },
    { id: uuidv4(), name: 'Andaman', country: 'India', description: 'Crystal-clear turquoise waters, stunning coral reefs, and secluded island paradise.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop', category: 'India', packageCount: 1 },
    { id: uuidv4(), name: 'Dubai', country: 'UAE', description: 'A city of superlatives — world\'s tallest towers, luxury shopping, and desert adventures.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop', category: 'International', packageCount: 1 },
    { id: uuidv4(), name: 'Bali', country: 'Indonesia', description: 'Island of the Gods — emerald rice paddies, Hindu temples, surf beaches, and jungle retreats.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop', category: 'International', packageCount: 1 },
    { id: uuidv4(), name: 'Singapore', country: 'Singapore', description: 'A futuristic city-state where tradition meets technology — Gardens by the Bay to Sentosa Island.', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200&auto=format&fit=crop', category: 'International', packageCount: 1 },
    { id: uuidv4(), name: 'Maldives', country: 'Maldives', description: 'The ultimate tropical luxury escape — overwater villas, crystal lagoons, and vibrant coral reefs.', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200&auto=format&fit=crop', category: 'International', packageCount: 1 },
  ];

  const insertDest = db.prepare('INSERT INTO Destination (id, name, country, description, image, category, packageCount) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const d of destinations) {
    insertDest.run(d.id, d.name, d.country, d.description, d.image, d.category, d.packageCount);
  }

  const goaId = destinations[0].id;
  const kashmirId = destinations[1].id;
  const keralaId = destinations[2].id;
  const manaliId = destinations[3].id;
  const rajId = destinations[4].id;
  const andamanId = destinations[5].id;
  const dubaiId = destinations[6].id;
  const baliId = destinations[7].id;
  const singaporeId = destinations[8].id;
  const maldivesId = destinations[9].id;

  // Packages
  const packages = [
    {
      id: uuidv4(), title: 'Goa Beach Escape', destinationId: goaId, destinationName: 'Goa, India',
      description: 'Indulge in the ultimate beach holiday experience in Goa. Relax on pristine shores, dive into thrilling water sports, and soak in the vibrant local culture. From the historic Portuguese forts to the electric nightlife, every moment in Goa is unforgettable. This package includes premium beachfront accommodation, guided tours of North and South Goa, and a spectacular sunset cruise.',
      shortDescription: 'The ultimate beach holiday — sun, sand, and vibrant nightlife.',
      duration: '5 Days / 4 Nights', nights: 4, price: 24999, rating: 4.8, category: 'Beach Holidays',
      mainImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Beachfront hotel stay', 'North Goa sightseeing tour', 'Water sports (parasailing, jet ski)', 'Sunset cruise on Arabian Sea', 'South Goa heritage tour', 'Casino night (optional)']),
      inclusions: JSON.stringify(['4 Nights accommodation', 'Daily breakfast', 'Airport transfers', 'All tours as mentioned', 'Water sports package', 'Travel insurance']),
      exclusions: JSON.stringify(['Flights', 'Lunch & Dinner', 'Personal expenses', 'Casino charges', 'Tips & gratuities']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1565992441121-4367b2a44a57?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1584490963756-cbc4b2acfe88?q=80&w=800&auto=format&fit=crop']),
      featured: 1
    },
    {
      id: uuidv4(), title: 'Goa Honeymoon Special', destinationId: goaId, destinationName: 'Goa, India',
      description: 'A romantic escape crafted for couples. Enjoy candlelit dinners on the beach, couples spa treatments, and a private yacht cruise. This exclusive honeymoon package makes every moment magical.',
      shortDescription: 'A dreamy romantic getaway crafted for couples.',
      duration: '4 Days / 3 Nights', nights: 3, price: 32999, rating: 4.9, category: 'Honeymoon',
      mainImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Romantic beachside resort', 'Candlelit beach dinner', 'Couples spa session', 'Private yacht cruise', 'Rose petal room decoration']),
      inclusions: JSON.stringify(['3 Nights luxury hotel', 'Daily breakfast', 'Airport transfers', 'Candlelit dinner', 'Couples spa (60 min)', 'Yacht cruise']),
      exclusions: JSON.stringify(['Flights', 'Lunch', 'Personal shopping', 'Tips']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800&auto=format&fit=crop']),
      featured: 1
    },
    {
      id: uuidv4(), title: 'Kashmir Paradise Tour', destinationId: kashmirId, destinationName: 'Kashmir, India',
      description: 'Discover the breathtaking beauty of Kashmir — the Paradise on Earth. Experience the magical houseboat stay on the glittering Dal Lake, the lush meadows of Gulmarg blanketed in snow, and the scenic valleys of Pahalgam. Every view here is a postcard.',
      shortDescription: 'A magical journey through Kashmir\'s valleys, lakes, and snow-capped peaks.',
      duration: '6 Days / 5 Nights', nights: 5, price: 39999, rating: 4.9, category: 'Honeymoon',
      mainImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Houseboat stay on Dal Lake', 'Shikara ride at sunset', 'Gulmarg Gondola ride', 'Pahalgam valley exploration', 'Betaab Valley visit', 'Mughal Gardens tour']),
      inclusions: JSON.stringify(['5 Nights accommodation (Houseboat + Hotel)', 'All meals', 'All transfers by private cab', 'Shikara ride', 'Gondola ride ticket', 'Sightseeing as per itinerary']),
      exclusions: JSON.stringify(['Flights to Srinagar', 'Personal expenses', 'Pony/horse rides', 'Tips']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?q=80&w=800&auto=format&fit=crop']),
      featured: 1
    },
    {
      id: uuidv4(), title: 'Kerala Backwater Experience', destinationId: keralaId, destinationName: 'Kerala, India',
      description: 'Cruise through the serene backwaters of Alleppey aboard a traditional Kerala houseboat. Watch lush paddy fields, swaying coconut palms, and picturesque villages drift by. Kerala is a sensory feast — from Ayurvedic spas to spice plantations.',
      shortDescription: 'Cruise through serene backwaters on a traditional Kerala houseboat.',
      duration: '4 Days / 3 Nights', nights: 3, price: 28999, rating: 4.7, category: 'Family Tours',
      mainImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Houseboat cruise on Alleppey backwaters', 'Cochin city heritage walk', 'Kathakali dance performance', 'Ayurvedic massage session', 'Chinese fishing nets visit', 'Periyar wildlife sanctuary']),
      inclusions: JSON.stringify(['3 Nights accommodation', 'Houseboat stay (1 night)', 'Daily breakfast', 'Airport pick up and drop', 'Kathakali performance ticket', 'Ayurvedic massage (45 min)']),
      exclusions: JSON.stringify(['Flights', 'Lunch & Dinner (except on houseboat)', 'Personal expenses']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop']),
      featured: 1
    },
    {
      id: uuidv4(), title: 'Manali Mountain Adventure', destinationId: manaliId, destinationName: 'Manali, Himachal Pradesh',
      description: 'Feel the rush of the Himalayas in Manali. From snow-capped peaks to raging rivers, this adventure package is designed for thrill-seekers. Experience river rafting, paragliding, trekking, and a visit to the stunning Rohtang Pass.',
      shortDescription: 'Thrilling Himalayan adventure — rafting, paragliding, snow, and peaks.',
      duration: '5 Days / 4 Nights', nights: 4, price: 29999, rating: 4.7, category: 'Adventure',
      mainImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['River rafting on Beas River', 'Paragliding in Solang Valley', 'Rohtang Pass excursion', 'Hadimba Devi Temple visit', 'Trekking in Kullu valley', 'Snow activities at Rohtang']),
      inclusions: JSON.stringify(['4 Nights hotel stay', 'Daily breakfast & dinner', 'Private cab transfers', 'River rafting session', 'Paragliding experience', 'Rohtang Pass permit']),
      exclusions: JSON.stringify(['Flights / Train to Manali', 'Lunch', 'Personal expenses', 'Snow scooter rides']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop']),
      featured: 1
    },
    {
      id: uuidv4(), title: 'Rajasthan Royal Heritage Tour', destinationId: rajId, destinationName: 'Rajasthan, India',
      description: 'Step into the land of maharajas. Rajasthan is a tapestry of golden palaces, vibrant bazaars, camel safaris, and desert sunsets. This royal heritage tour covers Jaipur, Jodhpur, and Jaisalmer — three cities that define the magic of India.',
      shortDescription: 'Explore the royal palaces, forts, and golden deserts of Rajasthan.',
      duration: '7 Days / 6 Nights', nights: 6, price: 44999, rating: 4.8, category: 'Family Tours',
      mainImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Amber Fort, Jaipur', 'Mehrangarh Fort, Jodhpur', 'Camel safari in Thar Desert', 'Jaisalmer Golden Fort', 'Desert camping under stars', 'City Palace tour']),
      inclusions: JSON.stringify(['6 Nights hotel stay', 'Daily breakfast', 'All transfers by AC cab', 'Camel safari & camping', 'All monument entry fees', 'Cultural performance']),
      exclusions: JSON.stringify(['Flights', 'Lunch & Dinner (except camping night)', 'Personal expenses', 'Tips']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop']),
      featured: 0
    },
    {
      id: uuidv4(), title: 'Andaman Island Escape', destinationId: andamanId, destinationName: 'Andaman & Nicobar Islands',
      description: 'Discover an untouched paradise in the Bay of Bengal. With crystal-clear waters, pristine white-sand beaches, and vibrant coral reefs, the Andaman Islands are a world-class destination for diving, snorkelling, and island-hopping.',
      shortDescription: 'A tropical paradise with pristine beaches and vibrant coral reefs.',
      duration: '5 Days / 4 Nights', nights: 4, price: 35999, rating: 4.8, category: 'Beach Holidays',
      mainImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Radhanagar Beach (Asia\'s best beach)', 'Scuba diving at Havelock Island', 'Glass-bottom boat ride', 'Cellular Jail light & sound show', 'North Bay Island snorkelling', 'Sea walk experience']),
      inclusions: JSON.stringify(['4 Nights hotel stay', 'Daily breakfast', 'Airport transfers', 'Ferry tickets to Havelock', 'Scuba diving (2 dives)', 'Snorkelling gear']),
      exclusions: JSON.stringify(['Flights to Port Blair', 'Lunch & Dinner', 'Personal expenses']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop']),
      featured: 0
    },
    {
      id: uuidv4(), title: 'Dubai Luxury Escape', destinationId: dubaiId, destinationName: 'Dubai, UAE',
      description: 'Experience the ultimate luxury in the city of gold. Dubai offers a spectacular blend of ultra-modern architecture, world-class shopping, and thrilling desert adventures. From the observation deck of Burj Khalifa to a traditional Dhow cruise on Dubai Creek, every day is extraordinary.',
      shortDescription: 'Luxury, skyscrapers, desert safaris, and world-class experiences.',
      duration: '5 Days / 4 Nights', nights: 4, price: 69999, rating: 4.9, category: 'International Tours',
      mainImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Burj Khalifa (124th floor)', 'Desert Safari with BBQ dinner', 'Dhow Cruise with dinner', 'Dubai Mall & Fountain Show', 'Abu Dhabi Grand Mosque tour', 'Dubai Frame']),
      inclusions: JSON.stringify(['4 Nights 4-star hotel', 'Daily breakfast', 'Airport transfers', 'Desert Safari (SIC)', 'Dhow Cruise dinner', 'Dubai city tour', 'Burj Khalifa ticket (124th floor)']),
      exclusions: JSON.stringify(['International flights', 'Visa charges', 'Lunch & Dinner (except mentioned)', 'Personal shopping']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop']),
      featured: 1
    },
    {
      id: uuidv4(), title: 'Bali Tropical Getaway', destinationId: baliId, destinationName: 'Bali, Indonesia',
      description: 'Bali is a magical island where spirituality meets natural beauty. Explore ancient Hindu temples perched on volcanic craters, terraced rice paddies, and surf the legendary waves of Kuta and Seminyak. Bali is a feast for the senses.',
      shortDescription: 'Temples, rice terraces, surf, and spiritual retreats in the Island of Gods.',
      duration: '6 Days / 5 Nights', nights: 5, price: 74999, rating: 4.8, category: 'International Tours',
      mainImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Ubud Monkey Forest', 'Tegalalang Rice Terrace', 'Tanah Lot Temple at sunset', 'Kuta Beach surfing lesson', 'Bali Swing experience', 'Traditional Balinese cooking class']),
      inclusions: JSON.stringify(['5 Nights villa/hotel stay', 'Daily breakfast', 'Airport transfers', 'All mentioned tours', 'Surfing lesson (2 hrs)', 'Cooking class']),
      exclusions: JSON.stringify(['International flights', 'Visa on arrival', 'Lunch & Dinner (except cooking class)', 'Personal expenses']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop']),
      featured: 1
    },
    {
      id: uuidv4(), title: 'Singapore Explorer', destinationId: singaporeId, destinationName: 'Singapore',
      description: 'Singapore is where the future meets tradition. Explore the breathtaking Gardens by the Bay, the vibrant streets of Chinatown, and the world-famous Marina Bay Sands. A family-friendly, safe, and exciting destination.',
      shortDescription: 'A futuristic, family-friendly city-state of gardens, culture, and adventure.',
      duration: '4 Days / 3 Nights', nights: 3, price: 64999, rating: 4.7, category: 'Family Tours',
      mainImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200&auto=format&fit=crop',
      highlights: JSON.stringify(['Gardens by the Bay (Supertrees)', 'Universal Studios Singapore', 'Sentosa Island cable car', 'Marina Bay Sands SkyPark', 'Singapore Zoo', 'Night Safari']),
      inclusions: JSON.stringify(['3 Nights 4-star hotel', 'Daily breakfast', 'Airport transfers', 'Universal Studios tickets', 'Gardens by the Bay ticket', 'City tour']),
      exclusions: JSON.stringify(['International flights', 'Visa', 'Lunch & Dinner', 'Personal expenses']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop']),
      featured: 0
    },
  ];

  const insertPkg = db.prepare(`INSERT INTO TourPackage (id, title, destinationId, destinationName, description, shortDescription, duration, nights, price, rating, category, mainImage, highlights, inclusions, exclusions, images, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const p of packages) {
    insertPkg.run(p.id, p.title, p.destinationId, p.destinationName, p.description, p.shortDescription, p.duration, p.nights, p.price, p.rating, p.category, p.mainImage, p.highlights, p.inclusions, p.exclusions, p.images, p.featured);
  }

  // Itineraries
  const itineraries = [
    // Goa Beach Escape (packages[0])
    { id: uuidv4(), packageId: packages[0].id, day: 1, title: 'Arrival & Hotel Check-in', description: 'Arrive at Goa International Airport. Our representative will receive you and transfer you to the hotel. Freshen up and enjoy a welcome drink. Evening is free to relax on the beach. Overnight stay at hotel.' },
    { id: uuidv4(), packageId: packages[0].id, day: 2, title: 'North Goa Sightseeing', description: 'After breakfast, embark on a guided tour of North Goa. Visit the iconic Fort Aguada perched over the sea, the vibrant Calangute Beach, and the happening Baga Beach. Explore the colourful Anjuna Flea Market. Evening at leisure.' },
    { id: uuidv4(), packageId: packages[0].id, day: 3, title: 'Water Sports & Sunset Cruise', description: 'Morning dedicated to thrilling water sports — parasailing, jet skiing, banana boat rides, and bumper rides. In the evening, board a luxury sunset cruise on the Arabian Sea with snacks and beverages onboard.' },
    { id: uuidv4(), packageId: packages[0].id, day: 4, title: 'South Goa Exploration', description: 'Drive to Old Goa and visit the magnificent Basilica of Bom Jesus and Se Cathedral (UNESCO World Heritage Sites). Continue to the Mangueshi Temple and the serene Colva Beach. Evening free to explore the local markets.' },
    { id: uuidv4(), packageId: packages[0].id, day: 5, title: 'Departure', description: 'Enjoy your final breakfast at the hotel. Check out and transfer to Goa Airport for your onward journey. Take home memories of sun, sand, and incredible Goan experiences.' },
    // Kashmir Paradise (packages[2])
    { id: uuidv4(), packageId: packages[2].id, day: 1, title: 'Arrival in Srinagar', description: 'Arrive at Sheikh ul Alam Airport, Srinagar. Transfer to houseboat on Dal Lake. Enjoy a magical Shikara (wooden boat) ride through the lake at sunset, passing the floating gardens and local markets. Welcome dinner on the houseboat.' },
    { id: uuidv4(), packageId: packages[2].id, day: 2, title: 'Srinagar to Gulmarg', description: 'After breakfast, drive to Gulmarg (2,730 m). Take the world\'s highest gondola cable car to Kongdori and Apharwat Peak for breathtaking snow views. Enjoy snow activities. Return to Srinagar for overnight stay.' },
    { id: uuidv4(), packageId: packages[2].id, day: 3, title: 'Srinagar to Pahalgam', description: 'Post breakfast, drive to Pahalgam — the Valley of Shepherds. En route, visit the saffron fields of Pampore and the Avantipora ruins. Arrive Pahalgam and explore the scenic meadows. Evening walk along Lidder River.' },
    { id: uuidv4(), packageId: packages[2].id, day: 4, title: 'Pahalgam Local Sightseeing', description: 'Visit the stunning Betaab Valley (named after the Bollywood film), the lush Aru Valley, and Baisaran — often called "Mini Switzerland." You may opt for pony rides to explore further. Overnight in Pahalgam.' },
    { id: uuidv4(), packageId: packages[2].id, day: 5, title: 'Pahalgam to Srinagar', description: 'Return to Srinagar. Visit the spectacular Mughal Gardens — Shalimar Bagh, Nishat Bagh, and Chashme Shahi. Evening Shikara ride. Explore the local handicraft shops for papier-mâché, carpets, and pashmina shawls.' },
    { id: uuidv4(), packageId: packages[2].id, day: 6, title: 'Departure', description: 'After a final breakfast, transfer to Srinagar Airport. Depart with a heart full of memories from the Paradise on Earth.' },
    // Dubai Luxury (packages[7])
    { id: uuidv4(), packageId: packages[7].id, day: 1, title: 'Arrival & Dhow Cruise Dinner', description: 'Arrive at Dubai International Airport. Transfer to hotel. In the evening, board a traditional wooden Dhow Cruise along Dubai Creek. Enjoy a sumptuous dinner with traditional Arabic entertainment and stunning views of the illuminated skyline.' },
    { id: uuidv4(), packageId: packages[7].id, day: 2, title: 'Dubai City Tour & Burj Khalifa', description: 'Morning half-day city tour — visit Jumeirah Mosque, Gold Souk, Spice Souk, and the historic Al Fahidi neighbourhood. Afternoon at leisure for shopping in Dubai Mall. Evening visit to Burj Khalifa (124th floor) and witness the spectacular fountain show.' },
    { id: uuidv4(), packageId: packages[7].id, day: 3, title: 'Desert Safari Adventure', description: 'Morning free for leisure or optional water park visit. Afternoon, embark on a thrilling desert safari — dune bashing in 4x4s, camel riding, sandboarding, henna painting, and a traditional Arabic BBQ dinner under the stars with belly dance and Tanoura show.' },
    { id: uuidv4(), packageId: packages[7].id, day: 4, title: 'Abu Dhabi Grand Mosque Tour', description: 'Full-day excursion to Abu Dhabi. Visit the magnificent Sheikh Zayed Grand Mosque — one of the world\'s largest mosques with intricate marble work. Visit the Presidential Palace (exterior), Emirates Palace, and the famous Corniche. Return to Dubai.' },
    { id: uuidv4(), packageId: packages[7].id, day: 5, title: 'Departure', description: 'Final morning for last-minute shopping at Dubai Mall or Mall of the Emirates. Transfer to Dubai International Airport for your departure flight. Farewell to the city of gold.' },
    // Bali (packages[8])
    { id: uuidv4(), packageId: packages[8].id, day: 1, title: 'Arrival in Bali', description: 'Arrive at Ngurah Rai International Airport. Transfer to hotel in Seminyak/Kuta area. Freshen up and take a leisurely walk on Kuta Beach to watch the legendary Bali sunset. Welcome dinner at a local restaurant.' },
    { id: uuidv4(), packageId: packages[8].id, day: 2, title: 'Ubud Cultural & Nature Tour', description: 'Drive to Ubud — the cultural heart of Bali. Visit the Sacred Monkey Forest, the stunning Tegalalang Rice Terraces, traditional Balinese artisan workshops, and the Ubud Palace. Watch a traditional Kecak fire dance performance in the evening.' },
    { id: uuidv4(), packageId: packages[8].id, day: 3, title: 'Temple Trail & Bali Swing', description: 'Morning visit to the Tirta Empul holy water temple where you can participate in a purification ceremony. Then head to the thrilling Bali Swing for breathtaking valley views. Afternoon cooking class learning to make authentic Balinese dishes.' },
    { id: uuidv4(), packageId: packages[8].id, day: 4, title: 'Tanah Lot & Seminyak', description: 'Visit the iconic Tanah Lot temple perched on a rock in the sea — most magical at sunset. Afternoon free to explore the trendy boutiques, cafes, and art galleries of Seminyak. Sunset cocktails at a rooftop bar.' },
    { id: uuidv4(), packageId: packages[8].id, day: 5, title: 'Surf & Leisure Day', description: 'Morning surfing lesson at Kuta or Seminyak Beach (2 hours with instructor). Afternoon free for the beach, pool, or spa. Evening farewell dinner at a cliff-top restaurant.' },
    { id: uuidv4(), packageId: packages[8].id, day: 6, title: 'Departure', description: 'Check out and transfer to Ngurah Rai Airport. Take home your Bali memories — the temples, the rice fields, the warm smiles, and the magic.' },
  ];

  const insertItin = db.prepare('INSERT INTO Itinerary (id, packageId, day, title, description) VALUES (?, ?, ?, ?, ?)');
  for (const i of itineraries) {
    insertItin.run(i.id, i.packageId, i.day, i.title, i.description);
  }

  // Testimonials
  const testimonials = [
    { id: uuidv4(), name: 'Priya Sharma', destination: 'Goa Beach Escape', rating: 5.0, review: 'Absolutely magical! Viraj Travels organized every detail flawlessly. The beachfront hotel was stunning and the sunset cruise was the highlight of our trip. We will definitely book again!', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: uuidv4(), name: 'Rahul & Neha Desai', destination: 'Kashmir Paradise Tour', rating: 4.9, review: 'Our honeymoon in Kashmir was beyond our dreams. The houseboat stay on Dal Lake was romantic beyond words. The Viraj Travels team was always available and took care of everything. Highly recommend!', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: uuidv4(), name: 'Arun Mehta', destination: 'Dubai Luxury Escape', rating: 4.8, review: 'A perfectly planned trip to Dubai. From the Burj Khalifa to the desert safari, everything was world-class. The guides were knowledgeable and the hotels were excellent. Worth every rupee!', image: 'https://randomuser.me/api/portraits/men/55.jpg' },
    { id: uuidv4(), name: 'Sunitha Krishnan', destination: 'Kerala Backwater Experience', rating: 4.9, review: 'Kerala is paradise and Viraj Travels made it even more special. The houseboat was comfortable and the crew was extremely hospitable. The Kathakali performance was unforgettable. 10/10!', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: uuidv4(), name: 'Vikram Patel', destination: 'Bali Tropical Getaway', rating: 4.8, review: 'Bali blew my mind and the trip was impeccably organized by Viraj Travels. The villa was gorgeous, the local guide was fantastic, and the cooking class was such a fun experience. Already planning to go back!', image: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { id: uuidv4(), name: 'Anjali & Rohan Gupta', destination: 'Manali Mountain Adventure', rating: 4.7, review: 'As adventure lovers, Manali was perfect for us. Paragliding was thrilling! Viraj Travels had great local contacts and the itinerary was packed but well-paced. The Himalayan views are something we\'ll never forget.', image: 'https://randomuser.me/api/portraits/women/23.jpg' },
  ];

  const insertTestimonial = db.prepare('INSERT INTO Testimonial (id, name, destination, rating, review, image) VALUES (?, ?, ?, ?, ?, ?)');
  for (const t of testimonials) {
    insertTestimonial.run(t.id, t.name, t.destination, t.rating, t.review, t.image);
  }

  console.log('✅ Database seeded successfully!');
  console.log(`  - ${destinations.length} destinations`);
  console.log(`  - ${packages.length} tour packages`);
  console.log(`  - ${itineraries.length} itinerary entries`);
  console.log(`  - ${testimonials.length} testimonials`);
}

module.exports = { seedDatabase };
