import mongoose from "mongoose";
import dotenv from "dotenv";
import sunglassesModel from "../models/sunglassesModel.js";

dotenv.config();

const sunglassesData = [
  {
    name: "Classic Black Aviator",
    price: 1999,
    brand: "RayStyle",
    category: "Men",
    description: "Premium aviator sunglasses with UV protection and metal frame.",
    image: ["/sunglasses/aviator_black.png"],
    stock: 20,
    bestseller: true,
    createdAt: Date.now()
  },
  {
    name: "Round Retro Sunglasses",
    price: 1499,
    brand: "VintageWear",
    category: "Women",
    description: "Stylish retro round sunglasses for modern fashion.",
    image: ["/sunglasses/round_retro.png"],
    stock: 15,
    bestseller: false,
    createdAt: Date.now()
  },
  {
    name: "Square Modern Shades",
    price: 1799,
    brand: "UrbanLook",
    category: "Men",
    description: "Bold square sunglasses for street style fashion.",
    image: ["/sunglasses/square_modern.png"],
    stock: 18,
    bestseller: true,
    createdAt: Date.now()
  },
  {
    name: "Sport Wrap Sunglasses",
    price: 2199,
    brand: "ActivePro",
    category: "Kids",
    description: "High performance sport sunglasses for outdoor use.",
    image: ["/sunglasses/sport_wrap.png"],
    stock: 25,
    bestseller: false,
    createdAt: Date.now()
  },
  {
    name: "Luxury Gold Frame",
    price: 2999,
    brand: "LuxuryLine",
    category: "Women",
    description: "Premium gold frame sunglasses with gradient lenses.",
    image: ["/sunglasses/luxury_gold.png"],
    stock: 10,
    bestseller: true,
    createdAt: Date.now()
  },
  {
    name: "Transparent Frame Fashion",
    price: 1899,
    brand: "MinimalStyle",
    category: "Kids",
    description: "Clean transparent frame sunglasses for modern look.",
    image: ["/sunglasses/transparent_frame.png"],
    stock: 22,
    bestseller: false,
    createdAt: Date.now()
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for clean seeding...");

    // Clear existing to avoid duplicates and fix casing issues
    await sunglassesModel.deleteMany({});
    console.log("Cleared existing sunglasses collection");

    await sunglassesModel.insertMany(sunglassesData);
    console.log("Successfully seeded 6 high-quality sunglasses products!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
