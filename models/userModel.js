import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    maxLength: [60, "A user must have less or equal than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    maxLength: [
      60,
      "A user must have less or equal than 60 characters of email",
    ],
    validate: [validator.isEmail],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "A user must have password"],
    minLength: [8, "A user must have password of minLenght: 8"],
  },
  confirmPassword: {
    type: String,
    required: [true, "A user must have an confirm email of minLength: 8"],
    minLength: 8,
    validate: {
      //NOTE This only works on SAVE or CREATE!
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

export const User = mongoose.model("User", userSchema);
