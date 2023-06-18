import express from 'express'
import { UserRouter } from '../modules/users/users.routes'
import { CowRouter } from '../modules/cow/cow.route'
import { OrderRouter } from '../modules/Order/order.route'

const router = express.Router()
const moduleRoutes = [
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/cows',
    route: CowRouter,
  },
  {
    path: '/orders',
    route: OrderRouter,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router