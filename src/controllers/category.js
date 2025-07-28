import { Category } from "../models/category";
import StatusCodes from "http-status-codes";

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const { search = "", sortBy = "", order = "desc" } = req.query;

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

    const categories = await Category.paginate(filter, option);

    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }

    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
