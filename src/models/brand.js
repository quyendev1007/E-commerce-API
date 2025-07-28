import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

brandSchema.plugin(mongoosePaginate);

export const Brand = mongoose.model("Brand", brandSchema);
