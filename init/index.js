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
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();