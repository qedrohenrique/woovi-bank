import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";
import { env } from "../../../config/environment";

export type User = {
  fullName: string;
  password: string;
  email: string;
  cpf: string;

  isEmailVerified: boolean;
  emailVerificationToken: string;
  emailVerificationTokenExpiresAt: Date;
  
  createdAt: Date;
  updatedAt: Date;

  hashPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, digest: string) => Promise<boolean>;
} & Document;

export type UserDocument = Document & User;

const UserSchema = new mongoose.Schema<User>(
  {
    fullName: {
      type: String,
      minlength: 3,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    cpf: {
      type: String,
      minlength: 11,
      maxlength: 11,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "User",
    timestamps: true,
  }
);

UserSchema.methods = {
  hashPassword: (password: string) => {
    return bcrypt.hash(password, env.HASH_SALT);
  },
  comparePassword(password: string, digest: string) {
    return bcrypt.compare(password, digest);
  },
};

UserSchema.pre<UserDocument>("save", async function () {
  if (this.isModified("password")) {
    this.password = await this.hashPassword(this.password);
  }
});

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);