import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    old_price: {
      type: Number,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model("Product", productSchema);
