import { Schema, model, models } from "mongoose";

// Define the admin schema
const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
});

// Create and export the Admin model
const Admin = models.Admin || model('Admin', AdminSchema);

export default Admin;

