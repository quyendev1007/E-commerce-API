import { Product } from "../models/product";
import StatusCodes from "http-status-codes";

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      search = "",
      sortBy = "createdAt",
      order = "desc",
      limit,
    } = req.query;

    const allowedSortFields = ["name", "price", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy.trim())
      ? sortBy.trim()
      : "createdAt";
    const orderValue = order === "desc" ? -1 : 1;

    const sort = { [safeSortBy]: orderValue };

    const filter = {};
    if (search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const safeLimit = limit > 0 ? parseInt(limit) : 2;

    const skip = (parseInt(page) - 1) * safeLimit;

    const [products, totalDocs] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(safeLimit)
        .populate("brand_id")
        .populate("category_id"),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / safeLimit);

    res.status(200).json({
      docs: products,
      totalDocs,
      limit,
      page: parseInt(page),
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getProducts = async (req, res) => {
//   try {
//     const { page = 1, search = "", sortBy = "", order = "desc" } = req.query;

//     const safeSortBy = sortBy?.trim() || "createdAt";

//     const orderValue = order === "desc" ? -1 : 1;

//     const sort = { [safeSortBy]: orderValue };

//     const filter = {};
//     if (search.trim() !== "") {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     const option = {
//       page,
//       limit: 10,
//       offset: 3,
//       sort,
//       populate: ["brand", "category"],
//     };

//     console.log(filter, option);

//     const products = await Product.paginate(filter, option);

//     res.status(StatusCodes.OK).json(products);
//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: error.message });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand_id")
      .populate("category_id");

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { brand_id: product.brand_id },
        { category_id: product.category_id },
      ],
    }).limit(4);

    res.status(StatusCodes.OK).json({
      product,
      similarProducts,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const productController = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};
