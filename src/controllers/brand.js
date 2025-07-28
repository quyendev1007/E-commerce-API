import { Brand } from "../models/brand";
import StatusCodes from "http-status-codes";

const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Brand created successfully", brand });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getBrands = async (req, res) => {
  try {
    const { search = "", sortBy = "", order = "" } = req.query;

    const safeSortBy = sortBy?.trim() || "createdAt";

    const safeOrder = order || "desc";

    const orderValue = safeOrder === "desc" ? 1 : -1;

    const sort = { [safeSortBy]: orderValue };

    const filter = {};
    if (search.trim() !== "") {
      filter.name = { $regex: search, $options: "i" };
    }

    const option = {
      sort,
    };

    const brands = await Brand.paginate(filter, option);

    res.status(StatusCodes.OK).json(brands);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!brand) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Brand not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Brand updated successfully", brand });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Brand not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Brand not found" });
    }

    res.status(StatusCodes.OK).json(brand);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const brandController = {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  getBrandById,
};
