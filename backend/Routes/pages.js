import express from "express"
import {verify} from "../Middleware/jwtVerify.js"
import { home } from "../Controllers/page.js"

const Router = express.Router()
Router.post("/home", verify, home)

export default Router