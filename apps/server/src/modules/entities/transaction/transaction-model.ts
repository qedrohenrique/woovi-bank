import mongoose from "mongoose";
import { AccountModel } from "../account/account-model";

export type Transaction = {
  idempotencyKey: string;
  accountId: string;
  targetAccountId: string;
  amount: number;
  description?: string;
  date: Date;
} & Document;

export type TransactionDocument = Document & Transaction;

const TransactionSchema = new mongoose.Schema<Transaction>({
  idempotencyKey: { type: String, required: true },
  accountId: { type: String, required: true },
  targetAccountId: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true },
});

TransactionSchema.pre('save', async function (next) {
  try {
    await AccountModel.findByIdAndUpdate(this.accountId, {
      $inc: { balance: -this.amount }
    });

    await AccountModel.findByIdAndUpdate(this.targetAccountId, {
      $inc: { balance: this.amount }
    });

    next();
  } catch (error) {
    next(error);
  }
});

TransactionSchema.post('save', async function (error: any, doc: TransactionDocument, next: any) {
  if (error) {
    try {
      await AccountModel.findByIdAndUpdate(doc.accountId, {
        $inc: { balance: doc.amount }
      });

      await AccountModel.findByIdAndUpdate(doc.targetAccountId, {
        $inc: { balance: -doc.amount }
      });
    } catch (revertError) {
      console.error('Error reverting account balances:', revertError);
    }
  }
  next(error);
});

TransactionSchema.index(
  { accountId: 1, targetAccountId: 1, idempotencyKey: 1 },
  { unique: true }
);

export const TransactionModel = mongoose.model<TransactionDocument>(
  "Transaction",
  TransactionSchema
);
