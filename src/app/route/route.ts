import { Router } from "express"
import { userRoutes } from "../modules/user/user.routes"
import { authRoutes } from "../modules/auth/auth.routes"
import { productRoutes } from "../modules/product/product.route"
// import { cartRoutes } from "../modules/cart/cart.route"
import { reviewRoutes } from "../modules/review/review.route"
import { wishlistRoutes } from "../modules/wishlist/wishlist.route"
import { subscribeRoutes } from './../modules/subscribe/subscribe.route';
import { orderRoutes } from "../modules/order/order.route"
import { blogRoutes } from "../modules/blog/blog.route"
import { contactRoutes } from "../modules/contact/contact.route"

const router = Router()
const routes = [
    {
        path: "/user",
        component: userRoutes
    },
    {
        path: "/auth",
        component: authRoutes
    },
    {
        path: "/product",
        component: productRoutes
    },
    // {
    //     path: "/cart",
    //     component: cartRoutes
    // },
    {
        path: "/order",
        component: orderRoutes
    },
    {
        path: "/review",
        component: reviewRoutes
    },
    {
        path: "/wishlist",
        component: wishlistRoutes
    },
    {
        path: "/subscribe",
        component: subscribeRoutes
    },
    {
        path: "/blog",
        component: blogRoutes
    },
    {
        path: "/contact",
        component: contactRoutes
    }
]

routes.forEach(route => router.use(route.path, route.component))
export default router 