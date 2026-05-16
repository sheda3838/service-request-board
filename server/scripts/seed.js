import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Job from "../models/Job.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // connect to mongodb
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // clear existing data to avoid duplicates
    await User.deleteMany();
    await Job.deleteMany();
    console.log("Existing data cleared...");

    // hash password (1234)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("1234", salt);

    // users data
    const usersData = [
      { name: "Zaid", email: "zaid@gmail.com", password: hashedPassword },
      { name: "Kamil", email: "kamil@gmail.com", password: hashedPassword },
      { name: "Sheda", email: "sheda@gmail.com", password: hashedPassword },
    ];

    // insert users
    await User.insertMany(usersData);
    console.log("Users seeded successfully...");

    // jobs data (9 jobs, 3 per user)
    const jobsData = [
      // zaid's jobs
      {
        title: "Fix leaking kitchen sink",
        description:
          "The pipe under the kitchen sink is leaking continuously. Need a plumber to replace or fix it.",
        category: "Plumbing",
        location: "Federal Territory Malaysia",
        contactName: "Zaid",
        contactEmail: "zaid@gmail.com",
        status: "Open",
      },
      {
        title: "Install new ceiling fan",
        description:
          "Need help installing a new ceiling fan in the living room.",
        category: "Electrical",
        location: "London England",
        contactName: "Zaid",
        contactEmail: "zaid@gmail.com",
        status: "In Progress",
      },
      {
        title: "Paint bedroom walls",
        description:
          "Looking for a professional painter to paint my bedroom walls in white.",
        category: "Painting",
        location: "Colombo Sri Lanka",
        contactName: "Zaid",
        contactEmail: "zaid@gmail.com",
        status: "Closed",
      },

      // kamil's Jobs
      {
        title: "Custom wardrobe building",
        description:
          "Need a carpenter to build a custom wardrobe for the master bedroom.",
        category: "Joinery",
        location: "Bangkok Thailand",
        contactName: "Kamil",
        contactEmail: "kamil@gmail.com",
        status: "Open",
      },
      {
        title: "Fix broken electrical socket",
        description:
          "One of the sockets in the kitchen sparked and stopped working. Need it replaced safely.",
        category: "Electrical",
        location: "Canberra Australia",
        contactName: "Kamil",
        contactEmail: "kamil@gmail.com",
        status: "Open",
      },
      {
        title: "Unblock bathroom drain",
        description:
          "The shower drain is completely blocked and water is not going down.",
        category: "Plumbing",
        location: "Washington USA",
        contactName: "Kamil",
        contactEmail: "kamil@gmail.com",
        status: "In Progress",
      },

      // Sheda's Jobs
      {
        title: "Assemble IKEA furniture",
        description:
          "Need help assembling a large IKEA bed frame and two nightstands.",
        category: "Joinery",
        location: "Ottawa Canada",
        contactName: "Sheda",
        contactEmail: "sheda@gmail.com",
        status: "Open",
      },
      {
        title: "Exterior house painting",
        description: "Looking for a team to repaint the exterior of my villa.",
        category: "Painting",
        location: "Doha Qatar",
        contactName: "Sheda",
        contactEmail: "sheda@gmail.com",
        status: "Open",
      },
      {
        title: "Water heater repair",
        description:
          "The water heater is not producing any hot water. Need urgent repair.",
        category: "Plumbing",
        location: "Tokyo Japan",
        contactName: "Sheda",
        contactEmail: "sheda@gmail.com",
        status: "Closed",
      },
    ];

    // insert jobs
    await Job.insertMany(jobsData);
    console.log("Jobs seeded successfully...");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
