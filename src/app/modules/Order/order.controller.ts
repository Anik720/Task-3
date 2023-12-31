import { Request, Response, NextFunction, RequestHandler } from 'express'
import { catchAsync } from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import pick from '../../../shared/pick'
import { OrderService } from './order.service'
import { IOrder } from './order.interface'

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...orderData } = req.body
    const result = await OrderService.createOrder(orderData)

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order created successfully',
      data: result,
    })
  }
)

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)

  const result = await OrderService.getAllOrders(paginationOptions)

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

export const OrderController = {
  createOrder,
  getAllOrders,
}
