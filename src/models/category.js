import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CategorySchema.plugin(mongoosePaginate);

export const Category = mongoose.model("Category", CategorySchema);
