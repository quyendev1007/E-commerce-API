import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderDetailSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    price: {
      type: Number,
      required: true,
    },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

OrderDetailSchema.plugin(mongoosePaginate);

export const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);
