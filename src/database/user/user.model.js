import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
        salutation: { type: String, enum: ['Mr.', 'Ms.', 'Mrs.', 'Dr.', ''], default: '' },
        first: { type: String, default: '' },
        middle: { type: String, default: '' },
        last: { type: String, default: '' },
        nickName: { type: String, default: '' },
    },
    number: {
        mobile: {
            number: { type: String, default: '' },
            callingCode: { type: String, default: '91' },
        },
        alternateMobile: {
            number: { type: String, default: '' },
            callingCode: { type: String, default: '91' },
        },
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"], // Enum values for the role field
      required: true,
    },
    specialization: { type: String }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model('User', userSchema);
