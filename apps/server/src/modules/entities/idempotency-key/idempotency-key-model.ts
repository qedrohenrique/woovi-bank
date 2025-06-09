import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../../../config/environment";

export type IdempotencyKey = {
  keyId: string;
  payload: string;
  hashedKey: string;
  createdAt: Date;
  expiresAt: Date;

  hashKey: (key: string, payload: string) => Promise<string>;
} & Document;

export type IdempotencyKeyDocument = Document & IdempotencyKey;

const IdempotencyKeySchema = new mongoose.Schema<IdempotencyKey>({
  keyId: { type: String, required: true },
  payload: { type: String, required: true },
  hashedKey: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

IdempotencyKeySchema.methods = {
  hashKey: (key: string, payload: string) => {
    return bcrypt.hash(key + payload, env.HASH_SALT);
  },
};

IdempotencyKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

IdempotencyKeySchema.pre<IdempotencyKeyDocument>("validate", async function () {
  this.hashedKey = await this.hashKey(this.keyId, this.payload);
});

export const IdempotencyKeyModel = mongoose.model<IdempotencyKeyDocument>(
  "IdempotencyKey",
  IdempotencyKeySchema
);
