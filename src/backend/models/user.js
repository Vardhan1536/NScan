import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"; // Import default and destructure

const { hash } = bcrypt; // Extract `hash` from the default export

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash if password is modified
    this.password = await hash(this.password, 10); // Hash password before saving
    next();
});

const User = model('User', UserSchema);

export default User;
