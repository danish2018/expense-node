import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

// Define the User schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

// Hash the user's password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});



userSchema.methods.generateToken = async function(){
  
  try {
      return jwt.sign({
          userId:this._id.toString(),
          email:this.email,
          isAdmin:this.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {
              expiresIn:"2d"
      }
  );
      
  } catch (error) {
      console.error(error)
      
  }
}

// Define a method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Define the User model
const User = mongoose.model('User', userSchema);

export default User;
