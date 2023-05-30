const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i <50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '646681c70ddd9f9d1f26ab2c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price,
            geometry: {
                type: "Point",
                coordinates: [-90.070116, 29.949932],
            },
            images: [
            {
                url: 'https://res.cloudinary.com/doq70e85v/image/upload/v1684954805/YelpCamp/vwvuixusdrl3anagm8gl.jpg',
                filename: 'YelpCamp/vwvuixusdrl3anagm8gl',
            },
            {
                url: 'https://res.cloudinary.com/doq70e85v/image/upload/v1684954805/YelpCamp/r9hnunv0tjmltuozwiwj.jpg',
                filename: 'YelpCamp/r9hnunv0tjmltuozwiwj',
            },
            {
                url: 'https://res.cloudinary.com/doq70e85v/image/upload/v1684954805/YelpCamp/eypsj3ueucgtryk1kijg.jpg',
                filename: 'YelpCamp/eypsj3ueucgtryk1kijg',
            }
            ]
        })
        await camp.save();
    }
}

seedDB();