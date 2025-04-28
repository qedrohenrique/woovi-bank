import mongoose, { Document } from "mongoose";
import { UserDocument } from "../../user/UserModel";
export type Account = {
  user: UserDocument;
  balance: number;
  updatedAt: Date;
} & Document;

export type AccountDocument = Document & Account;

const AccountSchema = new mongoose.Schema<Account>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    collection: "Account",
    timestamps: true,
  }
);

export const AccountModel = mongoose.model<AccountDocument>(
  "Account",
  AccountSchema
);
