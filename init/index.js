import mongoose from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";

main().then(() => {
    console.log(`connection successful`);
}).catch((err) => {
    console.log("connection error");
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '6a9e79eb2b49beb7c6d3c1bf' }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();