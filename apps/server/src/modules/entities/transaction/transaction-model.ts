import mongoose from "mongoose";

export type Transaction = {
  accountId: string;
  targetAccountId: string;
  amount: number;
  description: string;
  date: Date;
} & Document;

export type TransactionDocument = Document & Transaction;

const TransactionSchema = new mongoose.Schema<Transaction>({
  accountId: { type: String, required: true },
  targetAccountId: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});
