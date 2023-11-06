import CmsPage from "../../modules/admin/models/cms-page";
import CarCareSubCategory from "../../modules/car-care/models/car-care-sub-category";
import FeatureSpecification from "../../modules/features-and-specification/models/feature-specification";
import ServicesSubCategory from "../../modules/service/models/service-sub-category";
const exceljs = require('exceljs');


const fetchFeatureSpecifications = async (_id: any) => {

    const fetchFeatureSpecifications = await FeatureSpecification.find({ 'feature_id': { $in: _id } });


    return fetchFeatureSpecifications;
}


const getAllCmsPages = async () => {

    let cmsPage: any = [];
    const allCmsPage = await CmsPage.find({}).where({ page_status: 1 }).sort({ createdAt: -1 })


    allCmsPage.forEach((cms) => {
        cmsPage.push({
            _id: cms._id,
            name: cms.page_name,
            slug: cms.page_slug,
        })
    });
    return cmsPage;
}


const convertTimeStamp = (date: any) => {
    let currentDate = new Date(date)
    let dateFormat = currentDate.toDateString()
    let timeFormat = currentDate.toLocaleTimeString('en-US', { hour12: true });
    let convertDate = dateFormat + ' , ' + timeFormat
    return convertDate;
}



const fetchServiceDetailsByServiceCategory = async (categories: any) => {
    let getAllServices: any = [];
    let forGetAllService: any = [];
    // let getServices: any = [];
    for (let i = 0; i < categories.length; i++) {

        // if (categories[i].service_sub_category === null) {
        const getServices = await ServicesSubCategory.find({ service_category_id: categories[i].service_category._id }).where({ service_sub_category_id: categories[i].service_sub_category });
        // }

        // if (categories[i].service_sub_category) {
        //     getServices = await ServicesSubCategory.find({ service_category_id: categories[i].service_category._id });
        // }

        getServices.forEach((service: any) => {
            getAllServices.push({
                _id: categories[i]._id,
                sub_cate_id: service._id,
                service_category: categories[i].service_category,
                service_name: service.service_sub_category_name,
                service_slug: service.service_sub_category_slug,
                discount_type: categories[i].discount_type,
                service_discount_price: categories[i].service_discount_price,
                start_discount_date: categories[i].start_discount_date,
                end_discount_date: categories[i].end_discount_date,
                status: categories[i].sta

            });
        })
        forGetAllService = getAllServices;
    }
    return forGetAllService
}


const fetchCarCareDetailsByCarCareCategory = async (categories: any) => {
    let getAllServices: any = [];
    let forGetAllService: any = [];
    // let getServices: any = [];
    for (let i = 0; i < categories.length; i++) {

        // if (categories[i].service_sub_category === null) {
        const getServices = await CarCareSubCategory.find({ car_care_category_id: categories[i].car_care_category._id }).where({ car_care_sub_category_id: categories[i].car_care_sub_category });
        // }

        // if (categories[i].service_sub_category) {
        //     getServices = await ServicesSubCategory.find({ service_category_id: categories[i].service_category._id });
        // }

        getServices.forEach((service: any) => {
            getAllServices.push({
                _id: categories[i]._id,
                sub_cate_id: service._id,
                car_care_category: categories[i].car_care_category,
                car_care_name: service.car_care_sub_category_name,
                car_care_slug: service.car_care_sub_category_slug,
                discount_type: categories[i].discount_type,
                car_care_discount_price: categories[i].car_care_discount_price,
                start_discount_date: categories[i].start_discount_date,
                end_discount_date: categories[i].end_discount_date,
                status: categories[i].sta

            });
        })
        forGetAllService = getAllServices;
    }
    return forGetAllService
}

// export async function parseExcelFile(filePath: any) {
//     const workbook = new exceljs.Workbook();
//     await workbook.xlsx.readFile(filePath);

//     const worksheet = workbook.getWorksheet(1); // Assuming data is in the first worksheet

//     const data: any = [];
//     worksheet.eachRow((row: any, rowNumber: any) => {
//         // Assuming columns are in the order of Brand, Model, Variant
//         if (rowNumber > 1) { // Skip header row
//             const model = row.getCell(2).value?.trim() || '';
//             const brand = row.getCell(1).value?.trim() || '';
//             const variant = row.getCell(3).value?.trim() || '';
//             const year = row.getCell(4).value?.trim() || '';

//             data.push({ brand, model, variant, year });
//         }
//     });

//     return data;
// }

export async function parseExcelFile(filePath: any) {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1); // Assuming data is in the first worksheet

    const data: any = [];
    // worksheet.eachRow((row: any, rowNumber: any) => {
    //     // Assuming columns are in the order of Brand, Model, Variant, and Year
    //     if (rowNumber > 1) { // Skip header row
    //         const brand = typeof row.getCell(1).value === 'string' || typeof row.getCell(1).value === 'number' ? row.getCell(1).value.trim() : '';
    //         const model = typeof row.getCell(2).value === 'string' || typeof row.getCell(2).value === 'number' ? row.getCell(2).value.trim() : '';
    //         const variant = typeof row.getCell(3).value === 'string' || typeof row.getCell(3).value === 'number' ? row.getCell(3).value.trim() : '';
    //         const year = typeof row.getCell(4).value === 'string' || typeof row.getCell(4).value === 'number' ? row.getCell(4).value.trim() : '';

    //         data.push({ brand, model, variant, year });
    //     }
    // });

    worksheet.eachRow((row: any, rowNumber: any) => {
        // Assuming columns are in the order of Brand, Model, Variant, and Year
        if (rowNumber > 1) { // Skip header row
            const brand = typeof row.getCell(1).value === 'string' || typeof row.getCell(1).value === 'number'
                ? row.getCell(1).value.toString().trim()
                : '';
            const model = typeof row.getCell(2).value === 'string' || typeof row.getCell(2).value === 'number'
                ? row.getCell(2).value.toString().trim()
                : '';
            const variant = typeof row.getCell(3).value === 'string' || typeof row.getCell(3).value === 'number'
                ? row.getCell(3).value.toString().trim()
                : '';
            const year = typeof row.getCell(4).value === 'string' || typeof row.getCell(4).value === 'number'
                ? row.getCell(4).value.toString().trim()
                : '';

            data.push({ brand, model, variant, year });
        }
    });







    return data;
}



export { fetchFeatureSpecifications, getAllCmsPages, convertTimeStamp, fetchServiceDetailsByServiceCategory, fetchCarCareDetailsByCarCareCategory }