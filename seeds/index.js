 const mongoose = require("mongoose");
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors}=require('./seedHelpers.js')
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});



const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i<50; i++){
        
        const random1000= Math.floor(Math.random()*1000);
        const price= Math.floor(Math.random() *20) + 10;
        const camp = new Campground({
            author: '6236340b7f1590735956f490',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:[
                {
                    url: 'https://res.cloudinary.com/federer/image/upload/v1648118212/YelpCamp/y0wtsf99knf6tjvpfuq1.jpg',
                    filename: 'YelpCamp/y0wtsf99knf6tjvpfuq1',
                  },
                  {
                    url: 'https://res.cloudinary.com/federer/image/upload/v1648118211/YelpCamp/u0zpg2txl6cv9u9mgizg.jpg',
                    filename: 'YelpCamp/u0zpg2txl6cv9u9mgizg',
                  }
            ]

        });
        await camp.save();  
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})







