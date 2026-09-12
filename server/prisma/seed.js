const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed database...');

  // 1. Create Destinations
  const goa = await prisma.destination.create({
    data: {
      name: 'Goa',
      country: 'India',
      description: 'Famous for its pristine beaches, vibrant nightlife, and Portuguese heritage.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
      category: 'India',
    },
  });

  const kashmir = await prisma.destination.create({
    data: {
      name: 'Kashmir',
      country: 'India',
      description: 'Paradise on Earth, known for its beautiful valleys, lakes, and snow-capped mountains.',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1000&auto=format&fit=crop',
      category: 'India',
    },
  });

  const dubai = await prisma.destination.create({
    data: {
      name: 'Dubai',
      country: 'UAE',
      description: 'A city of skyscrapers, luxury shopping, and ultramodern architecture.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
      category: 'International',
    },
  });

  // 2. Create Tour Packages
  const goaPackage = await prisma.tourPackage.create({
    data: {
      title: 'Goa Beach Escape',
      destinationId: goa.id,
      description: 'Experience the ultimate beach holiday in Goa. Relax on pristine shores, enjoy water sports, and discover the vibrant local culture and nightlife. This package includes premium accommodation and guided tours to North and South Goa.',
      shortDescription: 'The ultimate beach holiday experience.',
      duration: '5 Days / 4 Nights',
      nights: 4,
      price: 24999,
      rating: 4.8,
      category: 'Beach Holidays',
      mainImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      itineraries: {
        create: [
          { day: 1, title: 'Arrival & Hotel Check-in', description: 'Arrive at Goa airport, transfer to hotel. Evening free for leisure.' },
          { day: 2, title: 'North Goa Sightseeing', description: 'Visit Calangute, Baga, and Fort Aguada.' },
          { day: 3, title: 'Beach & Water Activities', description: 'Enjoy parasailing, jet skiing, and a sunset cruise.' },
          { day: 4, title: 'South Goa Exploration', description: 'Visit Old Goa churches, Mangueshi temple, and Colva beach.' },
          { day: 5, title: 'Departure', description: 'Check out and transfer to airport.' },
        ]
      }
    }
  });

  const kashmirPackage = await prisma.tourPackage.create({
    data: {
      title: 'Kashmir Paradise Tour',
      destinationId: kashmir.id,
      description: 'Discover the breathtaking beauty of Kashmir. Experience a magical stay on a houseboat in Dal Lake, explore the meadows of Gulmarg, and visit the scenic valleys of Pahalgam.',
      shortDescription: 'A magical journey to the Paradise on Earth.',
      duration: '6 Days / 5 Nights',
      nights: 5,
      price: 39999,
      rating: 4.9,
      category: 'Honeymoon',
      mainImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      itineraries: {
        create: [
          { day: 1, title: 'Arrival in Srinagar', description: 'Transfer to Houseboat. Shikara ride on Dal Lake.' },
          { day: 2, title: 'Srinagar to Gulmarg', description: 'Drive to Gulmarg. Enjoy the Gondola ride.' },
          { day: 3, title: 'Gulmarg to Pahalgam', description: 'Scenic drive to Pahalgam. Visit saffron fields.' },
          { day: 4, title: 'Pahalgam Exploration', description: 'Visit Betaab Valley and Aru Valley.' },
          { day: 5, title: 'Pahalgam to Srinagar', description: 'Return to Srinagar. Visit Mughal Gardens.' },
          { day: 6, title: 'Departure', description: 'Transfer to Srinagar airport.' },
        ]
      }
    }
  });

  const dubaiPackage = await prisma.tourPackage.create({
    data: {
      title: 'Dubai Luxury Escape',
      destinationId: dubai.id,
      description: 'Experience the ultimate luxury in Dubai. From the towering Burj Khalifa to the vast desert dunes, this package offers a perfect blend of modern marvels and traditional Arabian adventures.',
      shortDescription: 'Experience the ultimate luxury and modern marvels.',
      duration: '5 Days / 4 Nights',
      nights: 4,
      price: 69999,
      rating: 4.9,
      category: 'International Tours',
      mainImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      itineraries: {
        create: [
          { day: 1, title: 'Arrival & Dhow Cruise', description: 'Arrive in Dubai. Evening Dhow Cruise with dinner.' },
          { day: 2, title: 'Dubai City Tour & Burj Khalifa', description: 'Half-day city tour. Visit Burj Khalifa 124th floor in the evening.' },
          { day: 3, title: 'Desert Safari', description: 'Morning free. Afternoon Desert Safari with BBQ dinner and belly dance.' },
          { day: 4, title: 'Abu Dhabi City Tour', description: 'Full day Abu Dhabi tour including Sheikh Zayed Grand Mosque.' },
          { day: 5, title: 'Departure', description: 'Shopping time and transfer to airport.' },
        ]
      }
    }
  });

  // 3. Create Testimonials
  await prisma.testimonial.create({
    data: {
      name: 'Priya Sharma',
      destination: 'Goa',
      rating: 5.0,
      review: 'An absolutely amazing experience! Viraj Travels organized everything perfectly. The hotel was fantastic and the itinerary was perfectly paced.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  });

  await prisma.testimonial.create({
    data: {
      name: 'Rahul Desai',
      destination: 'Kashmir',
      rating: 4.8,
      review: 'Our honeymoon in Kashmir was a dream come true thanks to Viraj Travels. The houseboat stay was magical and the guides were very professional.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
