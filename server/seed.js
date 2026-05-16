require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Property = require('./models/Property');
const Review = require('./models/Review');
const Flight = require('./models/Flight');
const Booking = require('./models/Booking');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    await Review.deleteMany();
    await Flight.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      { name: 'Admin', email: 'admin@orbyn.com', password: 'admin123', role: 'admin' },
      { name: 'Maria K.', email: 'maria@orbyn.com', password: 'host123', role: 'host' },
      { name: 'Aiko Tanaka', email: 'aiko@orbyn.com', password: 'host123', role: 'host' },
      { name: 'Rajesh Patel', email: 'rajesh@orbyn.com', password: 'host123', role: 'host' },
      { name: 'John Doe', email: 'john@orbyn.com', password: 'user123', role: 'user' },
      { name: 'Sarah Chen', email: 'sarah@orbyn.com', password: 'user123', role: 'user' },
      { name: 'Priya Sharma', email: 'priya@orbyn.com', password: 'user123', role: 'user' },
    ]);
    console.log(`Created ${users.length} users`);

    const maria = users[1];
    const aiko = users[2];
    const rajesh = users[3];
    const john = users[4];
    const sarah = users[5];
    const priya = users[6];

    // Create 20 properties across Indian + International cities
    const properties = await Property.create([
      // --- INDIAN CITIES ---
      {
        host: rajesh._id,
        title: 'Royal Haveli in Jaipur',
        description: 'Stay in a beautifully restored heritage haveli in the Pink City. Features traditional Rajasthani architecture, a rooftop terrace with views of Hawa Mahal, and authentic home-cooked meals.',
        location: { address: 'Chandpole, Old City', city: 'Jaipur', country: 'India', coordinates: { lat: 26.9124, lng: 75.7873 } },
        price: 120, category: 'Culture', type: 'Hotel', maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?auto=format&fit=crop&w=1200'],
        amenities: ['WiFi', 'Air conditioning', 'Breakfast included', 'Rooftop terrace', 'City view'],
        ratings: { average: 4.8, count: 342 },
      },
      {
        host: rajesh._id,
        title: 'Houseboat on Dal Lake',
        description: 'Experience the magic of Kashmir aboard a luxurious houseboat on the serene Dal Lake. Wake up to mountain reflections, enjoy Shikara rides, and savour authentic Wazwan cuisine.',
        location: { address: 'Dal Lake, Boulevard Road', city: 'Srinagar', country: 'India', coordinates: { lat: 34.0837, lng: 74.7973 } },
        price: 150, category: 'Adventure', type: 'Hotel', maxGuests: 6,
        images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'All meals', 'Shikara ride', 'Heated rooms', 'Lake view'],
        ratings: { average: 4.9, count: 198 },
      },
      {
        host: rajesh._id,
        title: 'Beach Villa in Goa',
        description: 'A stunning private villa just steps from Palolem Beach. Features a private pool, open-air living, tropical gardens, and the perfect sunset views every evening.',
        location: { address: 'Palolem Beach Road', city: 'Goa', country: 'India', coordinates: { lat: 15.0100, lng: 74.0230 } },
        price: 200, category: 'Beach', type: 'Villa', maxGuests: 8,
        images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Pool', 'Beach access', 'Kitchen', 'Air conditioning', 'Parking'],
        ratings: { average: 4.7, count: 456 },
      },
      {
        host: rajesh._id,
        title: 'Treehouse Retreat in Munnar',
        description: 'Nestled among tea plantations in the Western Ghats. This eco-friendly treehouse offers breathtaking misty mountain views, bird watching, and guided plantation tours.',
        location: { address: 'Bison Valley Road', city: 'Munnar', country: 'India', coordinates: { lat: 10.0889, lng: 77.0595 } },
        price: 95, category: 'Adventure', type: 'Cottage', maxGuests: 2,
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Breakfast included', 'Nature trails', 'Bird watching', 'Tea tasting'],
        ratings: { average: 4.6, count: 128 },
      },
      {
        host: rajesh._id,
        title: 'Luxury Suite in Mumbai',
        description: 'Exclusive penthouse suite in South Mumbai overlooking the Arabian Sea and Marine Drive. Walking distance to Gateway of India, fine dining, and Bollywood charm.',
        location: { address: 'Marine Drive, Nariman Point', city: 'Mumbai', country: 'India', coordinates: { lat: 18.9256, lng: 72.8242 } },
        price: 350, category: 'City', type: 'Apartment', maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1200'],
        amenities: ['WiFi', 'Pool', 'Gym', 'Concierge', 'Parking', 'Sea view', 'Room service'],
        ratings: { average: 4.9, count: 89 },
      },
      {
        host: rajesh._id,
        title: 'Heritage Fort Stay',
        description: 'Live like royalty in this 15th-century fort converted into a luxury hotel. Features antique furnishings, courtyard dining, and camel safari experiences in the Thar desert.',
        location: { address: 'Fort Road, Sam Desert', city: 'Jaisalmer', country: 'India', coordinates: { lat: 26.9157, lng: 70.9083 } },
        price: 180, category: 'Culture', type: 'Hotel', maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Pool', 'Desert safari', 'Heritage dining', 'Cultural shows'],
        ratings: { average: 4.8, count: 267 },
      },
      {
        host: rajesh._id,
        title: 'Ayurvedic Wellness Resort',
        description: 'An authentic Ayurvedic retreat in Kerala backwaters. Includes daily yoga sessions, personalized Panchakarma treatments, organic meals, and houseboat excursions.',
        location: { address: 'Kumarakom Backwaters', city: 'Kerala', country: 'India', coordinates: { lat: 9.6175, lng: 76.4301 } },
        price: 220, category: 'Wellness', type: 'Resort', maxGuests: 2,
        images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Spa', 'Yoga', 'Pool', 'Organic meals', 'Ayurvedic treatments'],
        ratings: { average: 4.9, count: 334 },
      },
      {
        host: rajesh._id,
        title: 'Modern Loft in Bangalore',
        description: 'A chic, Instagram-worthy loft apartment in Koramangala, the startup hub of India. Walking distance to cafes, coworking spaces, and vibrant nightlife.',
        location: { address: 'Koramangala 5th Block', city: 'Bangalore', country: 'India', coordinates: { lat: 12.9352, lng: 77.6245 } },
        price: 85, category: 'City', type: 'Apartment', maxGuests: 3,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Kitchen', 'Workspace', 'Air conditioning', 'Smart TV', 'Washer'],
        ratings: { average: 4.5, count: 201 },
      },
      {
        host: rajesh._id,
        title: 'Spice Plantation Homestay',
        description: 'Immerse yourself in the aromas of a working spice plantation in Coorg. Learn about coffee, cardamom, and pepper cultivation. Home-cooked Kodava cuisine included.',
        location: { address: 'Madikeri Hills', city: 'Coorg', country: 'India', coordinates: { lat: 12.4244, lng: 75.7382 } },
        price: 75, category: 'Food', type: 'Cottage', maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'All meals', 'Plantation tour', 'Bonfire', 'Trekking'],
        ratings: { average: 4.7, count: 178 },
      },
      {
        host: rajesh._id,
        title: 'Himalayan Mountain Lodge',
        description: 'A cozy mountain lodge in Manali with panoramic views of snow-capped peaks. Perfect base for trekking, paragliding, and exploring the Kullu Valley.',
        location: { address: 'Old Manali Road', city: 'Manali', country: 'India', coordinates: { lat: 32.2396, lng: 77.1887 } },
        price: 110, category: 'Adventure', type: 'Cottage', maxGuests: 6,
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Fireplace', 'Mountain view', 'Breakfast included', 'Trekking guides'],
        ratings: { average: 4.6, count: 245 },
      },
      // --- INTERNATIONAL CITIES ---
      {
        host: maria._id,
        title: 'Luxury Villa in Santorini',
        description: 'Experience the pinnacle of Mediterranean luxury in this stunning clifftop villa overlooking the Aegean Sea. Featuring a private infinity pool, sun-drenched terraces, and contemporary design.',
        location: { address: 'Oia, Santorini 847 02', city: 'Santorini', country: 'Greece', coordinates: { lat: 36.4618, lng: 25.3753 } },
        price: 350, category: 'Luxury', type: 'Villa', maxGuests: 6,
        images: ['https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Air conditioning', 'Parking', 'Security'],
        ratings: { average: 4.9, count: 234 },
      },
      {
        host: maria._id,
        title: 'Clifftop Infinity Retreat',
        description: 'A breathtaking retreat perched on the dramatic cliffs of the Amalfi Coast with panoramic sea views and a stunning infinity pool.',
        location: { address: 'Via Positanesi, Amalfi', city: 'Amalfi Coast', country: 'Italy', coordinates: { lat: 40.6340, lng: 14.6027 } },
        price: 490, category: 'Luxury', type: 'Villa', maxGuests: 8,
        images: ['https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Smart TV', 'Air conditioning'],
        ratings: { average: 4.9, count: 178 },
      },
      {
        host: aiko._id,
        title: 'Traditional Ryokan in Kyoto',
        description: 'Immerse yourself in Japanese hospitality at this beautifully preserved ryokan in the heart of Kyoto historic Gion district.',
        location: { address: 'Gion, Higashiyama', city: 'Kyoto', country: 'Japan', coordinates: { lat: 35.0116, lng: 135.7681 } },
        price: 280, category: 'Culture', type: 'Hotel', maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Garden', 'Tea room', 'Hot spring bath'],
        ratings: { average: 4.8, count: 189 },
      },
      {
        host: maria._id,
        title: 'Alpine Chalet Retreat',
        description: 'A cozy mountain chalet with spectacular views of the Matterhorn. Perfect for ski lovers and mountain enthusiasts.',
        location: { address: 'Bahnhofstrasse 5', city: 'Zermatt', country: 'Switzerland', coordinates: { lat: 46.0207, lng: 7.7491 } },
        price: 420, category: 'Adventure', type: 'Cottage', maxGuests: 6,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Fireplace', 'Ski-in/Ski-out', 'Hot tub', 'Kitchen'],
        ratings: { average: 4.9, count: 156 },
      },
      {
        host: aiko._id,
        title: 'Beachfront Bungalow',
        description: 'Wake up to the sound of waves in this stunning beachfront bungalow surrounded by tropical gardens and rice terraces.',
        location: { address: 'Jl. Pantai Berawa', city: 'Bali', country: 'Indonesia', coordinates: { lat: -8.6500, lng: 115.1372 } },
        price: 180, category: 'Beach', type: 'Villa', maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Pool', 'Beach access', 'Kitchen', 'Air conditioning'],
        ratings: { average: 4.7, count: 312 },
      },
      {
        host: maria._id,
        title: 'Modern Penthouse Suite',
        description: 'Luxury penthouse in the heart of Dubai Marina with floor-to-ceiling windows and views of the Burj Al Arab.',
        location: { address: 'Dubai Marina', city: 'Dubai', country: 'UAE', coordinates: { lat: 25.0800, lng: 55.1400 } },
        price: 550, category: 'Luxury', type: 'Apartment', maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Pool', 'Gym', 'Concierge', 'Parking', 'Smart Home'],
        ratings: { average: 4.9, count: 98 },
      },
      {
        host: maria._id,
        title: 'Tuscan Country Estate',
        description: 'A beautifully restored 16th-century estate set among rolling Tuscan hills with its own vineyard and olive grove.',
        location: { address: 'Via della Vigna', city: 'Tuscany', country: 'Italy', coordinates: { lat: 43.7711, lng: 11.2486 } },
        price: 320, category: 'Food', type: 'Villa', maxGuests: 10,
        images: ['https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Pool', 'Vineyard', 'Kitchen', 'Garden', 'Parking'],
        ratings: { average: 4.8, count: 267 },
      },
      {
        host: aiko._id,
        title: 'Overwater Villa Paradise',
        description: 'The ultimate luxury overwater villa with a glass floor, private plunge pool, and direct lagoon access.',
        location: { address: 'North Malé Atoll', city: 'Maldives', country: 'Maldives', coordinates: { lat: 4.1755, lng: 73.5093 } },
        price: 680, category: 'Beach', type: 'Resort', maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Plunge pool', 'Butler service', 'Snorkel gear', 'Spa'],
        ratings: { average: 5.0, count: 445 },
      },
      {
        host: aiko._id,
        title: 'Parisian Loft near Eiffel Tower',
        description: 'A charming Haussmann-era loft with original parquet floors and a Juliet balcony overlooking the Eiffel Tower. Steps from Champ de Mars.',
        location: { address: 'Rue de Grenelle', city: 'Paris', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
        price: 290, category: 'City', type: 'Apartment', maxGuests: 3,
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Kitchen', 'Washer', 'Eiffel Tower view', 'Metro nearby'],
        ratings: { average: 4.7, count: 389 },
      },
      {
        host: maria._id,
        title: 'Wellness Spa Resort Ubud',
        description: 'A holistic wellness retreat in the spiritual heart of Bali. Includes daily yoga, meditation, sound healing, and farm-to-table organic cuisine.',
        location: { address: 'Tegallalang, Ubud', city: 'Ubud', country: 'Indonesia', coordinates: { lat: -8.4095, lng: 115.3977 } },
        price: 250, category: 'Wellness', type: 'Resort', maxGuests: 2,
        images: ['https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1200&auto=format&fit=crop'],
        amenities: ['WiFi', 'Spa', 'Yoga', 'Pool', 'Organic meals', 'Meditation'],
        ratings: { average: 4.9, count: 276 },
      },
    ]);
    console.log(`Created ${properties.length} properties`);

    // Create reviews
    const reviews = await Review.create([
      { user: john._id, property: properties[0]._id, rating: 5, comment: 'Absolutely magical experience! The haveli was stunning and the rooftop dinner was unforgettable.', },
      { user: sarah._id, property: properties[0]._id, rating: 5, comment: 'The heritage architecture took my breath away. Rajesh was an amazing host with great local recommendations.' },
      { user: priya._id, property: properties[2]._id, rating: 4, comment: 'Beautiful beach villa with an amazing pool. The sunset views from the balcony were incredible.' },
      { user: john._id, property: properties[10]._id, rating: 5, comment: 'The Santorini villa exceeded all expectations. The infinity pool overlooking the caldera was a dream come true.' },
      { user: sarah._id, property: properties[12]._id, rating: 5, comment: 'The ryokan experience was truly authentic. The hot spring bath and tea ceremony were highlights.' },
      { user: priya._id, property: properties[17]._id, rating: 5, comment: 'Most incredible place I have ever stayed. Waking up to see fish through the glass floor was surreal!' },
      { user: john._id, property: properties[6]._id, rating: 5, comment: 'The Ayurvedic treatments were life-changing. I left feeling completely rejuvenated and at peace.' },
      { user: sarah._id, property: properties[4]._id, rating: 4, comment: 'Incredible views of Marine Drive. The penthouse was luxurious and the concierge service was top-notch.' },
    ]);
    console.log(`Created ${reviews.length} reviews`);

    // Create flights
    const today = new Date();
    const makeDate = (daysFromNow) => {
      const d = new Date(today);
      d.setDate(d.getDate() + daysFromNow);
      return d;
    };

    const flights = await Flight.create([
      // Delhi to Goa
      { airline: 'IndiGo', flightNumber: '6E-2045', from: { city: 'New Delhi', code: 'DEL' }, to: { city: 'Goa', code: 'GOI' }, departureTime: '06:30', arrivalTime: '09:15', duration: '2h 45m', stops: 0, price: 4500, class: 'Economy', seatsAvailable: 45, date: makeDate(3) },
      { airline: 'Air India', flightNumber: 'AI-882', from: { city: 'New Delhi', code: 'DEL' }, to: { city: 'Goa', code: 'GOI' }, departureTime: '10:15', arrivalTime: '13:30', duration: '3h 15m', stops: 1, stopCity: 'Mumbai', price: 5200, class: 'Economy', seatsAvailable: 30, date: makeDate(3) },
      { airline: 'Vistara', flightNumber: 'UK-867', from: { city: 'New Delhi', code: 'DEL' }, to: { city: 'Goa', code: 'GOI' }, departureTime: '14:00', arrivalTime: '16:40', duration: '2h 40m', stops: 0, price: 6800, class: 'Business', seatsAvailable: 12, date: makeDate(3) },
      // Mumbai to Bangalore
      { airline: 'IndiGo', flightNumber: '6E-5234', from: { city: 'Mumbai', code: 'BOM' }, to: { city: 'Bangalore', code: 'BLR' }, departureTime: '07:00', arrivalTime: '08:45', duration: '1h 45m', stops: 0, price: 3200, class: 'Economy', seatsAvailable: 60, date: makeDate(5) },
      { airline: 'SpiceJet', flightNumber: 'SG-178', from: { city: 'Mumbai', code: 'BOM' }, to: { city: 'Bangalore', code: 'BLR' }, departureTime: '12:30', arrivalTime: '14:15', duration: '1h 45m', stops: 0, price: 2800, class: 'Economy', seatsAvailable: 55, date: makeDate(5) },
      // Delhi to Mumbai
      { airline: 'Air India', flightNumber: 'AI-101', from: { city: 'New Delhi', code: 'DEL' }, to: { city: 'Mumbai', code: 'BOM' }, departureTime: '08:00', arrivalTime: '10:15', duration: '2h 15m', stops: 0, price: 4800, class: 'Economy', seatsAvailable: 40, date: makeDate(2) },
      { airline: 'Vistara', flightNumber: 'UK-945', from: { city: 'New Delhi', code: 'DEL' }, to: { city: 'Mumbai', code: 'BOM' }, departureTime: '16:00', arrivalTime: '18:10', duration: '2h 10m', stops: 0, price: 8500, class: 'Business', seatsAvailable: 8, date: makeDate(2) },
      // Bangalore to Goa
      { airline: 'IndiGo', flightNumber: '6E-7812', from: { city: 'Bangalore', code: 'BLR' }, to: { city: 'Goa', code: 'GOI' }, departureTime: '09:30', arrivalTime: '10:45', duration: '1h 15m', stops: 0, price: 2500, class: 'Economy', seatsAvailable: 70, date: makeDate(4) },
      // Mumbai to Delhi
      { airline: 'IndiGo', flightNumber: '6E-1234', from: { city: 'Mumbai', code: 'BOM' }, to: { city: 'New Delhi', code: 'DEL' }, departureTime: '19:00', arrivalTime: '21:15', duration: '2h 15m', stops: 0, price: 4200, class: 'Economy', seatsAvailable: 35, date: makeDate(7) },
      // Delhi to Srinagar
      { airline: 'Air India', flightNumber: 'AI-445', from: { city: 'New Delhi', code: 'DEL' }, to: { city: 'Srinagar', code: 'SXR' }, departureTime: '06:00', arrivalTime: '07:30', duration: '1h 30m', stops: 0, price: 5500, class: 'Economy', seatsAvailable: 25, date: makeDate(6) },
      // Chennai to Kochi
      { airline: 'SpiceJet', flightNumber: 'SG-302', from: { city: 'Chennai', code: 'MAA' }, to: { city: 'Kochi', code: 'COK' }, departureTime: '11:00', arrivalTime: '12:15', duration: '1h 15m', stops: 0, price: 2200, class: 'Economy', seatsAvailable: 50, date: makeDate(8) },
      // Kolkata to Delhi
      { airline: 'Vistara', flightNumber: 'UK-722', from: { city: 'Kolkata', code: 'CCU' }, to: { city: 'New Delhi', code: 'DEL' }, departureTime: '13:00', arrivalTime: '15:30', duration: '2h 30m', stops: 0, price: 5100, class: 'Economy', seatsAvailable: 42, date: makeDate(3) },
    ]);
    console.log(`Created ${flights.length} flights`);

    // Create sample bookings
    const bookings = await Booking.create([
      {
        user: john._id, property: properties[2]._id,
        dates: { checkIn: makeDate(10), checkOut: makeDate(13) },
        guests: { adults: 2, children: 0 }, totalPrice: 600,
        paymentStatus: 'paid', invoiceId: `INV-${Date.now()}-SAMPLE1`,
      },
      {
        user: sarah._id, property: properties[10]._id,
        dates: { checkIn: makeDate(15), checkOut: makeDate(18) },
        guests: { adults: 2, children: 1 }, totalPrice: 1050,
        paymentStatus: 'paid', invoiceId: `INV-${Date.now()}-SAMPLE2`,
      },
    ]);
    console.log(`Created ${bookings.length} sample bookings`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin:  admin@orbyn.com / admin123');
    console.log('Host:   maria@orbyn.com / host123');
    console.log('Host:   rajesh@orbyn.com / host123');
    console.log('User:   john@orbyn.com / user123');
    console.log('User:   sarah@orbyn.com / user123');

    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
