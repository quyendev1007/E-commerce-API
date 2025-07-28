import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["ordered", "cancel", "progress", "shipping", "success", "fail"],
      default: "ordered",
    },
    note: { type: String },
    total: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

OrderSchema.plugin(mongoosePaginate);

export const Order = mongoose.model("Order", OrderSchema);
