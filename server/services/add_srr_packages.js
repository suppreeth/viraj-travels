const { v4: uuidv4 } = require('uuid');
const db = require('./db');

function addSrrPackages() {
  console.log('Adding SRR Holidays packages to database...');

  // Set existing packages to featured = 0 so the new 3 packages are the featured ones on Home page
  db.prepare('UPDATE TourPackage SET featured = 0').run();

  // 1. Destinations
  const dests = [
    {
      id: 'dest-coastal-karnataka',
      name: 'Gokarna & Coastal Karnataka',
      country: 'India',
      description: 'Sacred coastal shrines, roaring waterfalls, serene backwaters, and pristine Arabian Sea beaches from Sigandur to Murdeshwar.',
      image: '/images/murdeshwar-coastal-tour.jpg',
      category: 'India',
      packageCount: 1,
    },
    {
      id: 'dest-munnar-kerala',
      name: 'Munnar & Wayanad',
      country: 'India',
      description: 'Lush emerald tea carpets, tranquil backwater houseboats, and misty mountain heights in God\'s Own Country.',
      image: '/images/munnar-tea-estate.jpg',
      category: 'India',
      packageCount: 1,
    },
    {
      id: 'dest-sakleshpur-chikmagalur',
      name: 'Sakleshpur & Chikmagalur',
      country: 'India',
      description: 'Aromatic coffee plantations, historic star-shaped forts, roaring waterfalls, and highest peaks of Karnataka.',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
      category: 'India',
      packageCount: 1,
    },
    {
      id: 'dest-mysore',
      name: 'Mysore & Srirangapatna',
      country: 'India',
      description: 'The royal City of Palaces — illuminated Mysore Palace, Chamundi Hill, Tipu Sultan\'s capital Srirangapatna and the musical Brindavan Gardens.',
      image: '/images/mysore-palace-tour.jpg',
      category: 'India',
      packageCount: 1,
    },
    {
      id: 'dest-chikkamagaluru',
      name: 'Chikkamagaluru',
      country: 'India',
      description: 'Coffee land of Karnataka — Mullayanagiri peak, Kudremukh, Sringeri, Horanadu and the misty Kemmangundi hills.',
      image: '/images/chikkamagaluru-hills-tour.jpg',
      category: 'India',
      packageCount: 1,
    },
    {
      id: 'dest-coorg',
      name: 'Coorg (Kodagu)',
      country: 'India',
      description: 'The Scotland of India — coffee estates, Abbi Falls, Dubare elephants, Raja Seat sunsets and Talacauvery.',
      image: '/images/coorg-abbi-falls-tour.jpg',
      category: 'India',
      packageCount: 1,
    }
  ];

  const upsertDest = db.prepare(`
    INSERT INTO Destination (id, name, country, description, image, category, packageCount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      country=excluded.country,
      description=excluded.description,
      image=excluded.image,
      category=excluded.category,
      packageCount=excluded.packageCount
  `);

  for (const d of dests) {
    upsertDest.run(d.id, d.name, d.country, d.description, d.image, d.category, d.packageCount);
  }

  // 2. Packages
  const newPackages = [
    {
      id: 'pkg-sigandur-gokarna-murdeshwar',
      title: 'Sigandur, Gokarna & Murdeshwar Coastal Tour',
      destinationId: 'dest-coastal-karnataka',
      destinationName: 'Gokarna & Coastal Karnataka, India',
      description: 'Experience an unforgettable 3-day coastal and heritage pilgrimage by SRR Holidays — Travel Comfortable ❤️. Beginning with an overnight journey from Mysore to the divine Sigandur Chowdeshwari Temple across Sharavathi backwaters, witness the majestic cascade of Jog Falls, ancient Sirsi, and mystical Yana karst rock towers. Explore the spiritual shores of Gokarna, cruise through Honnavara mangrove backwaters, visit sacred Idgunji Mahaganapathi and grand Murdeshwar Shiva temple, scenic Maravanthe beach, Anegudda, Udupi, and the columnar basalt geological wonder of St. Mary\'s Island at Malpe beach before returning overnight to Mysore.',
      shortDescription: 'Night journey to Sigandur, Jog Falls, Yana rocks, Gokarna, Honnavara boating, Murdeshwar & St. Mary\'s Island.',
      duration: '3 Days / 2 Nights',
      nights: 2,
      price: 14999,
      rating: 4.9,
      category: 'Beach Holidays',
      mainImage: '/images/murdeshwar-coastal-tour.jpg',
      highlights: JSON.stringify([
        'Night journey from Mysore towards Sigandur',
        'Sigandur Chowdeshwari Temple & majestic Jog Falls',
        'Sirsi & prehistoric Yana karst rock towers',
        'Gokarna Mahabaleshwar Temple & beach sunset',
        'Honnavara boating, Eco Beach & Mangrove forest walk',
        'Idgunji Mahaganapathi & Murdeshwar Sea Temple',
        'Scenic Maravanthe Beach & Anegudda Ganapathi Temple',
        'Udupi Sri Krishna Temple, Malpe Beach & St. Mary\'s Island'
      ]),
      inclusions: JSON.stringify([
        'Comfortable AC pushback transport from Mysore & return',
        '2 Nights hotel accommodation (Gokarna & Murdeshwar)',
        'Daily Breakfast & Dinner',
        'Honnavara backwaters boat ride pass',
        'St. Mary\'s Island ferry charges',
        'Toll, parking, and driver allowances'
      ]),
      exclusions: JSON.stringify([
        'Lunch and personal snacks',
        'Special temple pooja charges',
        'Personal shopping and camera permits'
      ]),
      images: JSON.stringify([
        '/images/murdeshwar-coastal-tour.jpg',
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
      ]),
      featured: 1,
      itineraries: [
        {
          day: 1,
          title: 'Sigandur Chowdeshwari, Jog Falls, Sirsi & Yana (Gokarna Halt)',
          description: 'Night journey from Mysore to Sigandur. Early morning arrival and darshan at Sri Sigandur Chowdeshwari Temple across the Sharavathi backwaters. Proceed to the roaring Jog Falls cascading down the Sahyadri ranges. Travel through Sirsi to the mystical limestone caves and monolithic karst towers of Yana. Head to Gokarna for beach sunset and overnight halt.'
        },
        {
          day: 2,
          title: 'Gokarna Temple, Honnavara Boating, Mangroves & Murdeshwar (Murdeshwar Halt)',
          description: 'Morning darshan at the holy Gokarna Mahabaleshwar Temple. Journey to Honnavara for an enchanting boat cruise through scenic mangrove forests and a visit to pristine Eco Beach. Offer prayers at the ancient Idgunji Mahaganapathi Temple. Drive to Murdeshwar to see the world\'s second-tallest Shiva statue overlooking the Arabian Sea. Overnight halt at Murdeshwar.'
        },
        {
          day: 3,
          title: 'Maravanthe Beach, Anegudda, Udupi, Malpe Beach & St. Mary\'s Island',
          description: 'Scenic morning coastal drive along Maravanthe Beach where the highway is framed by the Suparnika River on one side and the Arabian Sea on the other. Visit Anegudda Sri Vinayaka Temple and the holy Krishna Temple in Udupi. Spend the afternoon at Malpe Beach with a boat cruise to the columnar basalt rock formations of St. Mary\'s Island. Night journey back towards Mysore.'
        }
      ]
    },
    {
      id: 'pkg-munnar-alleppey-wayanad',
      title: 'Munnar, Alleppey & Wayanad Kerala Package',
      destinationId: 'dest-munnar-kerala',
      destinationName: 'Munnar & Kerala, India',
      description: 'Discover the scenic wonders of Kerala with SRR Holidays — Travel Comfortable ❤️. This 3-day itinerary encompasses the emerald tea carpets and misty viewpoints of Munnar, Mattupetty Dam, Kundala Lake, and an exhilarating off-road jeep journey. Cruise the tranquil palm-fringed backwaters of Alappuzha (Alleppey) aboard a traditional boat house, seek blessings at sacred Guruvayur, and journey into Wayanad to explore the prehistoric Edakkal Caves, authentic tribal heritage village, and the towering heights of Chembra Peak.',
      shortDescription: 'Munnar tea gardens, jeep safari, Alleppey backwater boat house, Guruvayur darshan & misty Wayanad peaks.',
      duration: '3 Days / 2 Nights',
      nights: 2,
      price: 17999,
      rating: 4.9,
      category: 'Honeymoon',
      mainImage: '/images/munnar-tea-estate.jpg',
      highlights: JSON.stringify([
        'Munnar lush Tea Garden walks & photo points',
        'Mattupetty Dam, Echo Point & serene Kundala Lake',
        'Cascading waterfalls view point & off-road Jeep journey',
        'Alappuzha (Alleppey) traditional boat house cruise',
        'Sacred Guruvayur Temple visit',
        'Prehistoric Edakkal Caves with ancient petroglyphs',
        'Authentic Tribal Heritage Village walk in Wayanad',
        'Panoramic views of Chembra Peak'
      ]),
      inclusions: JSON.stringify([
        '2 Nights quality hotel accommodation (Munnar & Wayanad)',
        'Traditional boat house cruise experience in Alappuzha',
        'Off-road Jeep safari in Munnar',
        'Daily Breakfast & Dinner',
        'All intercity transfers & sightseeing in AC vehicle',
        'Tolls, parking, and driver allowances'
      ]),
      exclusions: JSON.stringify([
        'Lunch and personal snacks',
        'Optional boating tickets at Mattupetty dam',
        'Special temple entry queues and tips'
      ]),
      images: JSON.stringify([
        '/images/munnar-tea-estate.jpg',
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop'
      ]),
      featured: 1,
      itineraries: [
        {
          day: 1,
          title: 'Munnar Tea Gardens, Mattupetty Dam, Echo Point & Jeep Safari',
          description: 'Arrive in picturesque Munnar surrounded by rolling mist and endless tea plantations. Visit the world-famous Tea Gardens, Mattupetty Dam, Echo Point, and the tranquil waters of Kundala Lake. Stop at beautiful waterfall viewpoints and set off on an exciting off-road jeep safari through the hills. Overnight stay in Munnar.'
        },
        {
          day: 2,
          title: 'Alappuzha Boat House Cruise, Guruvayur & Wayanad Halt',
          description: 'Drive down to Alappuzha (Alleppey) for a memorable backwaters cruise aboard a traditional boat house drifting along palm-lined canals and paddy fields. Proceed to the spiritual town of Guruvayur for darshan at the holy temple. Afterwards, climb the winding mountain passes into Wayanad for overnight halt.'
        },
        {
          day: 3,
          title: 'Edakkal Caves, Tribal Village & Chembra Peak',
          description: 'Morning excursion to the legendary Edakkal Caves to witness ancient Stone Age wall carvings. Explore indigenous culture and craft at the local Tribal Village. Enjoy stunning views of the heart-shaped lake trail and rolling hills of Chembra Peak before concluding the tour.'
        }
      ]
    },
    {
      id: 'pkg-sakleshpur-chikmagalur',
      title: 'Sakleshpur & Chikmagalur Hill Explorer',
      destinationId: 'dest-sakleshpur-chikmagalur',
      destinationName: 'Sakleshpur & Chikmagalur, Karnataka',
      description: 'Immerse yourself in the verdant coffee plantations and cloud-capped summits of the Western Ghats with SRR Holidays — Travel Comfortable ❤️. This exciting 3-day holiday covers Sakleshpur\'s iconic Bettada Byraveshwara hilltop shrine, the roaring Mallalli Falls, and the 18th-century French star-shaped Manjarabad Fort. Summit Karnataka’s highest peak Mullayanagiri, explore spiritual Baba Budangiri, take a bumpy 4x4 jeep ride to Jhari (Jeeri) Falls, enjoy sunset from Z Point in Kemmangundi, see Kalhatti Falls, and admire the UNESCO-recognized 12th-century Hoysala temple in Belur before returning to Mysore.',
      shortDescription: 'Manjarabad star fort, roaring Mallalli Falls, Mullayanagiri peak, Jhari falls jeep ride, Kemmangundi & Belur.',
      duration: '3 Days / 2 Nights',
      nights: 2,
      price: 12999,
      rating: 4.8,
      category: 'Adventure',
      mainImage: '/images/sakleshpur-hills-tour.jpg',
      highlights: JSON.stringify([
        'Bettada Byraveshwara hilltop temple & meadows',
        'Thundering Mallalli Falls in Western Ghats',
        'Historic star-shaped Manjarabad Fort exploration',
        'Trek to Mullayanagiri — Karnataka\'s highest summit',
        'Holy Baba Budangiri shrine & Dattatreya Peetha',
        'Exciting 4x4 Jeep ride down to Jhari (Jeeri) Falls',
        'Kemmangundi hill station, Z Point & Kalhatti Falls',
        'Exquisite 12th-century Belur Chennakeshava Temple'
      ]),
      inclusions: JSON.stringify([
        '2 Nights coffee estate resort stay in Chikmagalur',
        'AC pushback vehicle from Mysore & return',
        'Daily Breakfast & Dinner with Malnad cuisine',
        '4x4 Jeep ride to Jhari (Jeeri) Falls',
        'All toll, parking, driver allowances'
      ]),
      exclusions: JSON.stringify([
        'Lunch and personal expenses',
        'Camera tickets & adventure activities'
      ]),
      images: JSON.stringify([
        '/images/sakleshpur-hills-tour.jpg',
        '/images/chikkamagaluru-hills-tour.jpg',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop'
      ]),
      featured: 1,
      itineraries: [
        {
          day: 1,
          title: 'Bettada Byraveshwara, Mallalli Falls & Manjarabad Fort (Stay at Chikmagalur)',
          description: 'Depart Mysore towards the mist-covered valleys of Sakleshpur. Visit the scenic Bettada Byraveshwara Temple surrounded by rolling green hills, witness the thundering cascade of Mallalli Falls, and explore the unique star-shaped Manjarabad Fort built by Tipu Sultan. Proceed to Chikmagalur for overnight stay at a coffee estate resort.'
        },
        {
          day: 2,
          title: 'Baba Budangiri, Mullayanagiri, Jhari (Jeeri) Falls & Z Point',
          description: 'Early morning drive and trek to Mullayanagiri, the highest peak in Karnataka, offering breathtaking 360-degree cloud vistas. Visit the revered Baba Budangiri caves and take a thrilling 4x4 off-road jeep drive down through dense coffee plantations to Jhari (Jeeri) Falls. Catch the sunset at Z Point. Overnight stay at Chikmagalur.'
        },
        {
          day: 3,
          title: 'Kemmangundi, Kalhatti (Kalthgiri) Falls, Belur Temple & Return to Mysore',
          description: 'Morning excursion to the royal summer hill resort of Kemmangundi and the cascading Kalhatti (Kalthgiri) Falls where water plunges over Veerabhadra Temple. Afternoon visit to the historic UNESCO world heritage site of Belur Chennakeshava Temple to admire Hoysala architecture. Return back to Mysore by evening.'
        }
      ]
    },
    {
      id: 'pkg-mysore-sightseeing',
      title: 'Mysore & Srirangapatna Sightseeing',
      destinationId: 'dest-mysore',
      destinationName: 'Mysore, Karnataka',
      description: 'Discover the royal heritage of Mysore in a single day with SRR Holidays — Travel Comfortable ❤️. The morning covers Jaganmohana Palace Art Gallery, Sri Chamarajendra Zoological Garden, shopping, Chamundi Hill temple, the Mahishasura statue and the Big Bull (Nandi). After lunch, explore the magnificent Maharaja Palace and St. Philomena\'s Church, then head to Tipu Sultan\'s capital Srirangapatna for Tippu\'s Fort, Tippu\'s Death Place, Ranganathaswamy Temple, Krishnaraja Sagara Dam and the illuminated Brindavan Gardens.',
      shortDescription: 'Mysore Palace, Chamundi Hill, Zoo, St. Philomena\'s, Srirangapatna, KRS Dam & illuminated Brindavan Gardens.',
      duration: '1 Day',
      nights: 0,
      price: 1499,
      rating: 4.8,
      category: 'Family Tours',
      mainImage: '/images/mysore-palace-tour.jpg',
      highlights: JSON.stringify([
        'Jaganmohana Palace (Art Gallery)',
        'Sri Chamarajendra Zoological Garden (Zoo)',
        'Chamundi Hill Temple, Mahishasura Statue & Big Bull (Nandi)',
        'Maharaja Main Palace',
        'St. Philomena\'s Church',
        'Tippu\'s Fort & Tippu\'s Death Place',
        'Ranganathaswamy Temple, Srirangapatna',
        'Krishnaraja Sagara Dam & illuminated Brindavan Garden'
      ]),
      inclusions: JSON.stringify([
        'AC vehicle for full-day sightseeing',
        'Pickup & drop within Mysore city',
        'Experienced driver-cum-guide',
        'Toll, parking & driver allowance'
      ]),
      exclusions: JSON.stringify([
        'Monument, zoo & garden entry tickets',
        'Lunch & personal expenses',
        'Camera charges'
      ]),
      images: JSON.stringify(['/images/mysore-palace-tour.jpg']),
      featured: 1,
      itineraries: [
        {
          day: 1,
          title: 'Morning: Jaganmohana Palace, Zoo, Shopping & Chamundi Hill',
          description: 'Start at Jaganmohana Palace Art Gallery, then visit Sri Chamarajendra Zoological Garden. Time for shopping, followed by Chamundi Hill Temple, the Statue of Mahishasura and the Big Bull (Nandi).'
        },
        {
          day: 1,
          title: 'Afternoon: Maharaja Palace & St. Philomena\'s Church',
          description: 'After the lunch break, tour the grand Maharaja Main Palace and the Gothic St. Philomena\'s Church.'
        },
        {
          day: 1,
          title: 'Evening: Srirangapatna, KRS Dam & Brindavan Garden',
          description: 'Drive to Srirangapatna, Tippu Sultan\'s capital city — Tippu\'s Fort, Tippu\'s Death Place and Ranganathaswamy Temple. End the day at Krishnaraja Sagara Dam and the illuminated Brindavan Garden.'
        }
      ]
    },
    {
      id: 'pkg-chikkamagaluru',
      title: 'Chikkamagaluru, Kudremukh & Sringeri Tour',
      destinationId: 'dest-chikkamagaluru',
      destinationName: 'Chikkamagaluru, Karnataka',
      description: 'A breathtaking 3-day journey through the coffee hills of Chikkamagaluru with SRR Holidays — Travel Comfortable ❤️. Watch the sunrise from Mullayanagiri, see Hebbe Falls, Z Point and Baba Budangiri, and visit Sringeri Mutt on the Tunga river. Seek blessings at Sri Veeranarayana Temple, Horanadu Annapurneshwari and Kalasa, then take in Kudremukh Peak and National Park. The last day covers Jhari (Buttermilk) Falls, Bhadra and Muthodi Wildlife Sanctuaries, Inam Dattathreya Peeta and Kemmangundi peak.',
      shortDescription: 'Mullayanagiri, Hebbe Falls, Sringeri, Horanadu, Kudremukh, Jhari Falls, Bhadra & Kemmangundi.',
      duration: '3 Days / 2 Nights',
      nights: 2,
      price: 11999,
      rating: 4.8,
      category: 'Adventure',
      mainImage: '/images/chikkamagaluru-hills-tour.jpg',
      highlights: JSON.stringify([
        'Mullayanagiri & Baba Budangiri View Points',
        'Hebbe Falls & Z Point',
        'Sringeri Mutt on the Tunga River',
        'Sri Veeranarayana & Sri Annapurneshwari Temples',
        'Kalasa Shiva Temple',
        'Kudremukh Peak & National Park',
        'Jhari (Buttermilk) Waterfall',
        'Bhadra & Muthodi Wildlife Sanctuaries, Kemmangundi'
      ]),
      inclusions: JSON.stringify([
        '2 Nights stay in Chikkamagaluru',
        'Daily Breakfast & Dinner',
        'AC vehicle for all sightseeing',
        'Toll, parking & driver allowance'
      ]),
      exclusions: JSON.stringify([
        'Jeep charges for Hebbe & Jhari Falls',
        'Sanctuary & entry tickets',
        'Lunch & personal expenses'
      ]),
      images: JSON.stringify(['/images/chikkamagaluru-hills-tour.jpg']),
      featured: 1,
      itineraries: [
        {
          day: 1,
          title: 'Mullayanagiri, Hebbe Falls, Z Point, Baba Budangiri & Sringeri',
          description: 'Mullayanagiri View Point, Hebbe Falls, Z Point and Baba Budangiri View Point, then Sringeri Mutt on the banks of the Tunga River.'
        },
        {
          day: 2,
          title: 'Veeranarayana, Annapurneshwari, Kalasa & Kudremukh',
          description: 'Sri Veeranarayana Temple, Sri Annapurneshwari Temple (Horanadu), Kalasa Shiva Temple, Kudremukh Peak and Kudremukh National Park.'
        },
        {
          day: 3,
          title: 'Jhari Falls, Bhadra, Muthodi, Dattathreya Peeta & Kemmangundi',
          description: 'Jhari Waterfall (Buttermilk Falls), Bhadra Wildlife Sanctuary, Muthodi Wildlife Sanctuary, Inam Dattathreya Peeta and Kemmangundi Peak.'
        }
      ]
    },
    {
      id: 'pkg-coorg-by-car',
      title: 'Coorg by Car — 3 Day Tour',
      destinationId: 'dest-coorg',
      destinationName: 'Coorg (Kodagu), Karnataka',
      description: 'Explore the misty coffee country of Coorg by private car with SRR Holidays — Travel Comfortable ❤️. Day one covers the Golden Temple at Bylakuppe, Nisarga Dhama, Dubare Elephant Camp, a Suntikoppa coffee plantation, Madikeri Fort and Raja Seat. Day two brings Abbi Falls, a Mandalpatti jeep safari, Omkareshwara Temple, the General Cariappa Memorial and city shopping. The tour ends at Bhagamandala and Talacauvery, the birthplace of the River Cauvery.',
      shortDescription: 'Golden Temple, Dubare elephants, Abbi Falls, Mandalpatti jeep safari, Raja Seat & Talacauvery.',
      duration: '3 Days / 2 Nights',
      nights: 2,
      price: 9999,
      rating: 4.9,
      category: 'Family Tours',
      mainImage: '/images/coorg-abbi-falls-tour.jpg',
      highlights: JSON.stringify([
        'Golden Temple (Bylakuppe) & Nisarga Dhama',
        'Dubare Elephant Camp',
        'Suntikoppa Coffee Plantation',
        'Madikeri Fort & Raja Seat sunset',
        'Abbi Falls',
        'Mandalpatti Jeep Safari',
        'Omkareshwara Temple & General Cariappa Memorial',
        'Bhagamandala & Talacauvery (Birth of River Cauvery)'
      ]),
      inclusions: JSON.stringify([
        'Private car for the entire tour',
        '2 Nights stay in Coorg',
        'Daily Breakfast',
        'Toll, parking & driver allowance'
      ]),
      exclusions: JSON.stringify([
        'Mandalpatti jeep safari charges',
        'Entry tickets & elephant activities',
        'Lunch, dinner & personal expenses'
      ]),
      images: JSON.stringify(['/images/coorg-abbi-falls-tour.jpg']),
      featured: 1,
      itineraries: [
        {
          day: 1,
          title: 'Golden Temple, Nisarga Dhama, Dubare, Coffee Plant, Madikeri Fort & Raja Seat',
          description: 'Golden Temple, Nisarga Dhama, Dubare Elephant Camp, Suntikoppa Coffee Plant, Madikeri Fort and sunset at Raja Seat.'
        },
        {
          day: 2,
          title: 'Abbi Falls, Mandalpatti Jeep Safari, Omkareshwara & Shopping',
          description: 'Abbi Falls, Mandalpatti (Jeep Safari), Omkareshwara Temple, General Cariappa Memorial and Coorg city shopping.'
        },
        {
          day: 3,
          title: 'Bhagamandala & Talacauvery',
          description: 'Bhagamandala (Bhagamandeshwara Temple) and Talacauvery, the birthplace of the River Cauvery.'
        }
      ]
    }
  ];

  const upsertPkg = db.prepare(`
    INSERT INTO TourPackage (
      id, title, destinationId, destinationName, description, shortDescription,
      duration, nights, price, rating, category, mainImage, highlights, inclusions,
      exclusions, images, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title,
      destinationId=excluded.destinationId,
      destinationName=excluded.destinationName,
      description=excluded.description,
      shortDescription=excluded.shortDescription,
      duration=excluded.duration,
      nights=excluded.nights,
      price=excluded.price,
      rating=excluded.rating,
      category=excluded.category,
      mainImage=excluded.mainImage,
      highlights=excluded.highlights,
      inclusions=excluded.inclusions,
      exclusions=excluded.exclusions,
      images=excluded.images,
      featured=excluded.featured
  `);

  const deleteItin = db.prepare('DELETE FROM Itinerary WHERE packageId = ?');
  const insertItin = db.prepare('INSERT INTO Itinerary (id, packageId, day, title, description) VALUES (?, ?, ?, ?, ?)');

  for (const pkg of newPackages) {
    upsertPkg.run(
      pkg.id, pkg.title, pkg.destinationId, pkg.destinationName, pkg.description,
      pkg.shortDescription, pkg.duration, pkg.nights, pkg.price, pkg.rating,
      pkg.category, pkg.mainImage, pkg.highlights, pkg.inclusions, pkg.exclusions,
      pkg.images, pkg.featured
    );

    deleteItin.run(pkg.id);
    for (const it of pkg.itineraries) {
      insertItin.run(uuidv4(), pkg.id, it.day, it.title, it.description);
    }
  }

  console.log('Successfully added SRR Holidays packages!');
}

addSrrPackages();

module.exports = { addSrrPackages };
