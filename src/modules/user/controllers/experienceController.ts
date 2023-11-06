import { Request, Response, NextFunction } from "express";
import ExperienceCenter from "../../experience-centers/models/experience-centers";

// const ShowroomList = async (req:Request, res:Response, next:NextFunction) => {
//      try {
//         const sellData: any = [];
//         const page: any = req.query.page ? req.query.page : 1;
//         const limit = 10;
//         const skip = (page - 1) * limit;
//         const getShowroom = await ExperienceCenter.find({}).limit(2).sort({ 'createdAt': -1 });
//         if (!getShowroom) {
//             return res.status(404).json({ status: 0, message: 'No data found!' });
//         }
//         console.log(getShowroom)
//         getShowroom.forEach((data) => {
//             sellData.push({
               
//                  _id: data._id
             
//             })
//         });
//         res.status(200).json({ status: 1, sellData: sellData });
//     } catch (e) {
//         res.status(500).json({ status: 0, message: e });
//     }
// }
// export {ShowroomList}