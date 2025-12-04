import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "agent", "admin"],
      default: "buyer",
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    // Agent-specific fields
    agencyName: {
      type: String,
      trim: true,
      maxlength: [100, "Agency name cannot be more than 100 characters"],
    },
    licenseNumber: {
      type: String,
      trim: true,
      maxlength: [50, "License number cannot be more than 50 characters"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, "Bio cannot be more than 1000 characters"],
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      max: [100, "Experience cannot be more than 100 years"],
    },
    specialization: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  const profile = {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    avatar: this.avatar,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
  };

  // Include agent-specific fields if user is an agent
  if (this.role === "agent") {
    profile.agencyName = this.agencyName;
    profile.licenseNumber = this.licenseNumber;
    profile.bio = this.bio;
    profile.experience = this.experience;
    profile.specialization = this.specialization;
  }

  return profile;
};

export default mongoose.model("User", userSchema);
