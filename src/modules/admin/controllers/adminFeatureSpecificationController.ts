import { Request, Response } from "express";
import FeatureSpecification from "../../features-and-specification/models/feature-specification";
import path from "path";
import fs from 'fs';
import SpecificationCategory from "../../features-and-specification/models/specifications-category";
import { fetchFeatureSpecifications } from "../../../helpers/admin/Helper";
import { fetchFeatures } from "../../../helpers/users/commonHelper";

const featureImagePath = path.join(process.cwd(), '/public/feature-specification');
const DIR = 'public/feature-specification/';

const createFeatureSpecification = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        const featureData = {
            feature_id: body.feature_id,
            feature_name: body.name,
        }

        // const checkFeatureSpecification = await FeatureSpecification.findOne({ feature_name: featureData.feature_name }).populate([
        //     { path: "feature_id", select: ["name"] }
        // ]);

        // if (checkFeatureSpecification) {
        //     if (checkFeatureSpecification.feature_id === featureData.feature_id) {
        //         return res.status(400).json({ status: 2, message: `${checkFeatureSpecification.feature_name} already added in selected category!.` });
        //     }
        // }
        // ${checkBrandSlug.feature_id.name} 
        const feature = new FeatureSpecification(featureData);
        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : '';
            feature.feature_icon = uploadFile;
        }

        await feature.save();

        const shareFeature = {
            _id: feature._id,
            feature_id: feature.feature_id,
            name: feature.feature_name,
            icon: feature.feature_icon ? DIR + feature.feature_icon : '',
            status: feature.feature_status,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt
        }
        res.status(201).json({ status: 1, message: `${shareFeature.name} Feature & Specification created successfully`, features: shareFeature });
    } catch (e) {
        res.status(500).json({ status: 0, message: 0 });
    }
}

const manageAllSpecifications = async (req: Request, res: Response) => {
    try {
        const features: any = [];
        const page: any = req.query.page ? req.query.page : 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const getAllFeatures = await FeatureSpecification.find({}).populate([
            { path: "feature_id", select: ["name"] }
        ]).skip(skip).limit(limit);

        if (!getAllFeatures) {
            return res.status(400).json({ status: 0, messge: 'No Features and Specifications found!' });
        }

        getAllFeatures.forEach((feature) => {
            features.push({
                _id: feature._id,
                feature_id: feature.feature_id,
                name: feature.feature_name,
                icon: feature.feature_icon ? DIR + feature.feature_icon : '',
                status: feature.feature_status,
                createdAt: feature.createdAt,
                updatedAt: feature.updatedAt
            })
        });

        res.status(200).json({ status: 1, features });

    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const viewFeatureSpecification = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please referesh the page and click again!' });
        }

        const feature = await FeatureSpecification.findById({ _id }).populate([
            { path: "feature_id", select: ["name"] }
        ]);

        if (!feature) {
            return res.status(404).json({ status: 0, message: 'No data found!' });
        }

        const shareFeature = {
            _id: feature._id,
            feature_id: feature.feature_id,
            name: feature.feature_name,
            icon: feature.feature_icon ? DIR + feature.feature_icon : '',
            status: feature.feature_status,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt
        }

        res.status(200).json({ status: 1, features: shareFeature });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const updateFeature = async (req: Request, res: Response) => {
    try {
        const body: any = req.body;
        const _id = req.params.id;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong.' });
        }
        const feature = await FeatureSpecification.findById({ _id });

        if (!feature) {
            return res.status(400).json({ status: 0, message: 'No Feature & Specfication found!' });
        }

        feature.feature_name = body.name ? body.name : feature.feature_name;
        feature.feature_id = body.feature_id ? body.feature_id : feature.feature_id;

        if (req.file !== undefined) {
            const uploadFile = req.file.filename ? req.file.filename : feature.feature_icon;
            if (feature.feature_icon) {
                fs.unlinkSync(featureImagePath + feature.feature_icon);
            }
            feature.feature_icon = uploadFile;
        }

        await feature.save();

        const shareFeature = {
            _id: feature._id,
            feature_id: feature.feature_id,
            name: feature.feature_name,
            icon: feature.feature_icon ? DIR + feature.feature_icon : '',
            status: feature.feature_status,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt
        }

        res.status(200).json({ status: 1, message: `${shareFeature.name} updated successfully!`, features: shareFeature });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const blockUnBlockFeature = async (req: Request, res: Response) => {

    try {
        const _id = req.query.id;
        const status: any = req.query.status;

        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please referesh the page and click again!' });
        }
        if (!status) {
            return res.status(400).json({ status: 0, messafe: 'Something went wrong. Please referesh the page and click again!' });
        }

        const feature = await FeatureSpecification.findById({ _id });
        if (!feature) {
            return res.status(404).json({ status: 0, message: 'Not found!' });
        }
        feature.feature_status = status;
        await feature.save();
        let statusType = feature.feature_status === 1 ? 'Active' : 'De-active';
        res.status(200).json({ status: 1, message: `${feature.feature_name} has been marked ${statusType} successfully!` });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


const fetchFeatureByCategory = async (req: Request, res: Response) => {
    try {
        const features: any = [];
        const feature_id = req.query.id;
        if (!feature_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong!' });
        }
        const getAllFeatures = await FeatureSpecification.find({ feature_id: feature_id }).where({ feature_status: 1 });
        // .populate([
        //     { path: "feature_id", select: ["name"] }
        // ])
        if (!getAllFeatures || getAllFeatures.length <= 0) {
            return res.status(400).json({ status: 0, message: 'No Features and Specifications found!' });
        }

        getAllFeatures.forEach((feature) => {
            features.push({
                _id: feature._id,
                feature_id: feature.feature_id,
                name: feature.feature_name,
            })
        });

        // console.log(features);

        res.status(200).json({ status: 1, features });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchAllFeatures = async (req: Request, res: Response) => {
    try {
        const features: any = [];
        const getAllFeatures = await FeatureSpecification.find({}).where({ feature_status: 1 });

        if (!getAllFeatures) {
            return res.status(400).json({ status: 0, messge: 'No Features and Specifications found!' });
        }

        getAllFeatures.forEach((feature) => {
            features.push({
                name: feature.feature_name,
                icon: feature.feature_icon ? DIR + feature.feature_icon : '',
                status: feature.feature_status,
                createdAt: feature.createdAt,
                updatedAt: feature.updatedAt
            })
        });
        res.status(200).json({ status: 0, features });
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchFeturewithCategory = async (req: Request, res: Response) => {
    try {
        const feature_id: any = req.params.id;
        const categoriesFeature: any = [];
        const features: any = [];
        const fetchFeatureCategory = await FeatureSpecification.find({ feature_id: feature_id }).where({ feature_status: 1 });

        // fetchFeatureCategory.forEach(async (category) => {


        //     const fetchFeature = await FeatureSpecification.find({ feature_id: category._id }).where({ feature_status: 1 });

        //     // fetchFeature.forEach((feature) => {
        //     //     features.push({
        //     //         _id: feature.feature_id,
        //     //         feature_name: feature.feature_name
        //     //     });
        //     // })

        //     // console.log('Features: ', features);

        //     categoriesFeature.push({
        //         cateId: category._id,
        //         cateName: category.name,
        //         cateSlug: category.slug,
        //         featuress: fetchFeature.forEach((feature) => {
        //             // console.log(feature);
        //             features.push({
        //                 _id: feature.feature_id,
        //                 feature_name: feature.feature_name
        //             });
        //             // console.log(features);
        //         })
        //     })
        // })
        // console.log(categoriesFeature);
        // res.json({})

        // const fetchFeatureWithCategory = await FeatureSpecification.find({}).populate([
        //     { path: "feature_id", select: ["name", "slug"] }
        // ]);

        // console.log('Featur with Category: ', fetchFeatureWithCategory)
        res.status(200).json({ featureCategories: fetchFeatureCategory })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

const fetchFeatureSpecificationsBuyCategories = async (req: Request, res: Response) => {
    try {
        const categories: any = [];
        const allData: any = [];
        // const fetchCategories = await SpecificationCategory.find({}).where({ status: 1 });
        //.select('_id')
        // const fetchSpecifications = await fetchFeatureSpecifications(fetchCategories);


        {/**

db.users.aggregate([{$lookup: 
    {
     from: "products", 
     localField: "product_id", 
     foreignField: "_id", 
     as: "products"
    }
}])

Course.find({ category: "Database" })
    .then(data => {
        console.log("Database Courses:")
        console.log(data);
  
        // Putting all course id's in dbcourse array
        data.map((d, k) => {
            dbcourse.push(d._id);
        })
  
        // Getting students who are enrolled in any
        // database course by filtering students
        // whose courseId matches with any id in
        // dbcourse array
        Student.find({ courseId: { $in: dbcourse } })
            .then(data => {
                console.log("Students in Database Courses:")
                console.log(data);
            })
            .catch(error => {
                console.log(error);
            })
    })
    .catch(error => {
        console.log(error);
    })
*/}
        const mapGetData: any = [];
        let getNewData: any = [];
        const getData = await SpecificationCategory.find({}).where({ status: 1 });

        const fetchFeatu = await fetchFeatures(getData);

        // fetchFeatu.map((fetur) => {

        // })


        let forFeatures: any = [];
        const features: any = [];
        for (let i = 0; i < getData.length; i++) {

            const fetchSpecName = await FeatureSpecification.find({ feature_id: getData[i]._id }).where({ feature_status: 1 });

            fetchSpecName.forEach((fetu) => {
                features.push({
                    _id: fetu._id,
                    feature_name: fetu.feature_name,
                })
            });


            // }
            // console.log();

            getData.forEach((cat) => {
                mapGetData.push({
                    _id: cat._id,
                    name: cat.name,
                    slug: cat.slug,
                    features: features
                })
            });

            forFeatures = mapGetData;
        }

        res.status(200).json({ status: 1, features: forFeatures });

        // console.log(mapGetData);
        // getdata.forEach(async (cate) => {
        //     const fetchSpecName = await FeatureSpecification.find({}).where({ feature_status: 1 });

        //     // fetchSpecName.forEach((fetu) => {
        //     //     getNewData.push({
        //     //         _id: fetu._id,
        //     //         feature_name
        //     //     })
        //     // })

        //     mapGetData.push({
        //         _id: cate._id,
        //         cate_name: cate.name,
        //         features: fetchSpecName
        //     });

        //     getNewData = mapGetData;
        //     console.log(getNewData);
        // })



        // const fetchAllData = await FeatureSpecification.aggregate([{$lookup:
        //      {
        //             from: "feature-specification"
        //         }
        //     }
        // ])





        // fetchCategories.forEach((category) => {
        //     categories.push({
        //         _id: category._id,
        //         category_name: category.name,
        //         category_slug: category.slug
        //     })
        // })

        // // console.log(fetchCategories.length);
        // for (let i = 0; i < fetchCategories.length; i++) {
        //     console.log(fetchCategories[i]._id);
        //     const features = await FeatureSpecification.find({ feature_id: categories._id[i] });

        // }


        // console.log(fetchCategories);



    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}

export { createFeatureSpecification, manageAllSpecifications, viewFeatureSpecification, updateFeature, blockUnBlockFeature, fetchFeatureByCategory, fetchAllFeatures, fetchFeturewithCategory, fetchFeatureSpecificationsBuyCategories }