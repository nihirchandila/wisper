import express from "express"
const Router = express.Router()

import {signup, login, logout, sidebarUsers, search} from "../Controllers/user.js"
import { verify } from "../Middleware/protectedRoute.js"

Router.post("/register", signup)
Router.post("/login", login)
Router.post("/logout", logout)
Router.post("/sidebarUsers", verify, sidebarUsers)
Router.post("/search", search)



export default Router