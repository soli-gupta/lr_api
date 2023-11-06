import { DocumentDefinition } from "mongoose"
import { IAdmin } from "../../modules/admin/models/admin"
import { Admin } from "../custom"


declare global {

    namespace Express {
        interface Request {
            admin?: Record<string, any>,
            token?: string
            user?: Record<string, any>
            selling_your_car?: File,
            location?: Record<string, any>,
            key?: Record<string, any>,
            ext_img_1: File
        }

    }
}
export { }