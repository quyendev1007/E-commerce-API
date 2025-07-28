import { OrderDetail } from "../models/orderDetail";
import StatusCodes from "http-status-codes";

const createOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.create(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "OrderDetail created successfully", orderDetail });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetail.paginate();

    res.status(StatusCodes.OK).json(orderDetails);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!orderDetail) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "OrderDetail not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "OrderDetail updated successfully", orderDetail });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const deleteOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findByIdAndDelete(req.params.id);

    if (!orderDetail) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "OrderDetail not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "OrderDetail deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getOrderDetailById = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findById(req.params.id);

    if (!orderDetail) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "OrderDetail not found" });
    }

    res.status(StatusCodes.OK).json(orderDetail);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const orderDetailController = {
  createOrderDetail,
  getOrderDetails,
  updateOrderDetail,
  deleteOrderDetail,
  getOrderDetailById,
};
