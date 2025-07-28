import { Order } from "../models/order";
import StatusCodes from "http-status-codes";
import { OrderDetail } from "./../models/orderDetail";

const createOrder = async (req, res) => {
  try {
    //     {
    //   "user_id": "662c3e1c94f9a9e9b87745a0",
    //   "note": "Giao ban ngày",
    //   "total": 500000,
    //   "products": [
    //     {
    //       "product_id": "662c3e1c94f9a9e9b8771111",
    //       "quantity": 2,
    //       "price": 100000
    //     },
    //     {
    //       "product_id": "662c3e1c94f9a9e9b8772222",
    //       "quantity": 1,
    //       "price": 300000
    //     }
    //   ]
    // }

    const { user_id, note, total, products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const order = await Order.create({ user_id, note, total });

    const orderDetails = products.map((item) => ({
      order_id: order._id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderDetail.insertMany(orderDetails);

    res.status(StatusCodes.CREATED).json({
      message: "Đặt hàng thành công",
      order: order,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      search = "",
      sortBy = "createdAt",
      order = "desc",
      status = "",
      limit,
    } = req.query;

    const orderValue = order === "desc" ? -1 : 1;
    const sort = { [sortBy.trim()]: orderValue };

    const pageNumber = parseInt(page) || 1;
    const safeLimit = parseInt(limit) || 2;
    const skip = (pageNumber - 1) * safeLimit;

    const searchRegex = new RegExp(search, "i");

    const pipeline = [
      // Join user
      {
        $lookup: {
          from: "users",
          let: { userId: "$user_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            { $project: { _id: 1, username: 1, email: 1 } },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },

      // Join orderDetails
      {
        $lookup: {
          from: "orderdetails",
          localField: "_id",
          foreignField: "order_id",
          as: "orderDetails",
        },
      },
      { $unwind: "$orderDetails" },

      // Join products
      {
        $lookup: {
          from: "products",
          localField: "orderDetails.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // Gắn product vào orderDetails
      {
        $addFields: {
          "orderDetails.product": "$product",
        },
      },

      // Gom lại các orderDetails về cùng đơn hàng
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          total: { $first: "$total" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          orderDetails: { $push: "$orderDetails" },
        },
      },

      // Tìm kiếm
      {
        $match: {
          ...(search
            ? {
                $or: [
                  { "user.username": { $regex: searchRegex } },
                  { "user.email": { $regex: searchRegex } },
                  { "orderDetails.product.name": { $regex: searchRegex } },
                ],
              }
            : {}),
          ...(status ? { status: status } : {}),
        },
      },

      // Phân trang và sort
      { $sort: sort },
      {
        $facet: {
          docs: [
            { $skip: skip },
            { $limit: safeLimit },
            {
              $project: {
                user: 1,
                orderDetails: 1,
                total: 1,
                status: 1,
                createdAt: 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await Order.aggregate(pipeline);

    const docs = result?.docs || [];
    const totalDocs = result?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalDocs / safeLimit);

    res.status(200).json({
      docs,
      totalDocs,
      totalPages,
      page: pageNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Order updated successfully", order });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const orderController = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrderById,
};
