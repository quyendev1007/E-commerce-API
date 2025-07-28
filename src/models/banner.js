import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const BannerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    status: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BannerSchema.plugin(mongoosePaginate);

export const Banner = mongoose.model("Banner", BannerSchema);
