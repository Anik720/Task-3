import mongoose, { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiErrors'
import httpStatus from 'http-status'
import { IpaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationHelpers } from '../../../helper/pagination'
import { IOrder } from './order.interface'
import User from '../users/users.model'
import Cow from '../cow/cow.model'
import Order from './order.model'

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  const findBuyer = await User.findById({ _id: order.buyer })
  const findCow = await Cow.findById({ _id: order.cow })

  // generate student id
  let newOrderAllData = null
  if (findBuyer && findBuyer.budget && findCow && findCow.price) {
    if (findBuyer?.budget < findCow?.price) {
      throw new ApiError(400, 'You have not enough budget.')
    }
  } else {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()
      if (findCow && findCow.label) {
        findCow.label = 'sold out'
      }

      let newBudget
      if (findBuyer && findBuyer.budget && findCow && findCow.price) {
        newBudget = findBuyer?.budget - findCow?.price
        findBuyer.budget = newBudget
      }

      const findSeller = await User.findOne({ _id: findCow?.seller })
      if (findSeller && findSeller.income && findCow && findCow.price) {
        findSeller.income = findCow?.price
      }

      //array
      const newOrder = await Order.create([order], { session })

      if (!newOrder.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create order')
      }

      newOrderAllData = newOrder[0]
      await findBuyer?.save()
      await findCow?.save()
      await findSeller?.save()
      await session.commitTransaction()
      await session.endSession()
    } catch (error) {
      await session.abortTransaction()
      await session.endSession()
      throw error
    }
  }

  if (newOrderAllData) {
    newOrderAllData = await Order.findOne({
      _id: newOrderAllData._id,
    }).populate({
      path: 'cow',
    })
  }

  return newOrderAllData
}
const getAllOrders = async (
  paginationOptions: IpaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const result = await Order.find({})
    .populate({ path: 'cow' })
    .populate({ path: 'buyer' })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Order.countDocuments({})

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

export const OrderService = {
  createOrder,
  getAllOrders,
}
