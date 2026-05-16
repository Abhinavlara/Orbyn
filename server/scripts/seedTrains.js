const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Train = require('../models/Train');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const trains = [
  {
    trainNumber: '12301',
    trainName: 'Rajdhani Express',
    from: { station: 'New Delhi', code: 'NDLS', city: 'Delhi' },
    to: { station: 'Mumbai Central', code: 'MMCT', city: 'Mumbai' },
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    daysOfRun: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: '1A', price: 4750, seatsAvailable: 4 },
      { type: '2A', price: 2850, seatsAvailable: 12 },
      { type: '3A', price: 2100, seatsAvailable: 45 }
    ],
    trainType: 'Rajdhani'
  },
  {
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    from: { station: 'New Delhi', code: 'NDLS', city: 'Delhi' },
    to: { station: 'Varanasi Jn', code: 'BSB', city: 'Varanasi' },
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    daysOfRun: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: 'EC', price: 3200, seatsAvailable: 10 },
      { type: 'CC', price: 1750, seatsAvailable: 85 }
    ],
    trainType: 'Vande Bharat'
  },
  {
    trainNumber: '12010',
    trainName: 'Shatabdi Express',
    from: { station: 'Ahmedabad Jn', code: 'ADI', city: 'Ahmedabad' },
    to: { station: 'Mumbai Central', code: 'MMCT', city: 'Mumbai' },
    departureTime: '14:50',
    arrivalTime: '21:20',
    duration: '6h 30m',
    daysOfRun: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    classes: [
      { type: 'EC', price: 2400, seatsAvailable: 8 },
      { type: 'CC', price: 1250, seatsAvailable: 40 }
    ],
    trainType: 'Shatabdi'
  },
  {
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani',
    from: { station: 'Mumbai Central', code: 'MMCT', city: 'Mumbai' },
    to: { station: 'New Delhi', code: 'NDLS', city: 'Delhi' },
    departureTime: '17:00',
    arrivalTime: '08:30',
    duration: '15h 30m',
    daysOfRun: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: '1A', price: 4800, seatsAvailable: 2 },
      { type: '2A', price: 2900, seatsAvailable: 15 },
      { type: '3A', price: 2150, seatsAvailable: 50 }
    ],
    trainType: 'Rajdhani'
  }
];

const seedTrains = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding trains...');
    
    await Train.deleteMany();
    console.log('Cleared existing trains');
    
    await Train.insertMany(trains);
    console.log('Seeded 4 popular train routes');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding trains:', error);
    process.exit(1);
  }
};

seedTrains();
