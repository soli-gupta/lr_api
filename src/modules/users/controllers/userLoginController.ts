import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import OtpVerification from "../models/otp_verification";
import { AddMinutesToDate, currentDateTime } from "../../../helpers/common_helper";
import * as dotenv from 'dotenv'
import generateUserAuthToken from "../middelware/generateUserAuthToken";
import fs from 'fs';
import path from "path";
import UserAddresses from "../models/user-address";

dotenv.config()

var request = require('request');
const DIR = 'public/user/profile/';
const userImagePath = path.join(process.cwd(), '/public/user/profile/');

const loginUser = async (req: Request, res: Response) => {
    try {
        let otp: any = ''
        let testMobileNo = '9773888779'
        if (req.body.mobile == testMobileNo) {
            otp = '1234'
        } else {
            otp = Math.floor(1000 + Math.random() * 9000);
        }

        const API_KEY = process.env.SMS_API_KEY
        const BASE_URL = process.env.SMS_BASE_URL
        const SENDER_ID = process.env.SMS_SENDER_ID
        const MSG = `${otp} is the OTP to verify your mobile number with Luxury Ride. Please do not share this OTP with anyone.`
        const url = `${BASE_URL}?api_key=${API_KEY}&method=sms&message=${MSG}&to=${req.body.mobile}&sender=${SENDER_ID}`

        const expiration_time = AddMinutesToDate();
        const data = {
            mobile: req.body.mobile,
            otp: otp,
            otp_expiry: expiration_time
        }
        var options = {
            'method': 'POST',
            'url': url
        };
        const checkOTP = await OtpVerification.deleteOne({ mobile: req.body.mobile })
        const verifyOtp = new OtpVerification(data);
        await verifyOtp.save();
        if (req.body.mobile == testMobileNo) {
            return res.status(201).json({ status: 1, OTP: otp, message: 'OTP has been sent to your mobile number, Please Check.' });
        }
        if (verifyOtp) {
            request(options, function (error: any, response: any) {
                if (error) throw new Error(error);
                // console.log(response.body)
                res.status(201).json({ status: 1, OTP: otp, message: 'OTP has been sent to your mobile number, Please Check.' });
            });
        } else {
            res.status(500).json({ status: 0, message: 'Oops something went wrong' });
        }


    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const OtpVerify = async (req: Request, res: Response, next: NextFunction) => {

    try {
        let mobile = req.body.mobile

        let testMobileNo = '9773888779'
        let testOTP = '1234'

        const currentDate = currentDateTime()

        const getOtp = await OtpVerification.findOne({ mobile: mobile }).sort({ createdAt: -1 });

        const getUser = await User.findOne({ mobile: mobile })

        let token = ''

        // if (getOtp!.mobile == testMobileNo && testOTP == req.body.otp) {
        //     token = await generateUserAuthToken(getUser!._id);
        //     res.status(201).json({ status: 1, userData: getUser, token: token, message: 'OTP verified successfully. You logged In successfully' });
        // }

        if (getOtp!.otp == req.body.otp) {

            if (getOtp!.otp_expiry > currentDate) {
                getOtp!.verify_status = 1
                await getOtp!.save()
                if (getUser) {
                    token = await generateUserAuthToken(getUser!._id);
                    res.status(201).json({ status: 1, userData: getUser, token: token, message: 'OTP verified successfully. You logged In successfully' });
                } else {
                    const user = new User({ mobile: mobile })
                    await user.save()
                    token = await generateUserAuthToken(user._id);
                    res.status(201).json({ status: 1, userData: user, token: token, message: 'OTP verified successfully. You logged In successfully' });
                }

            } else {
                res.status(500).json({ status: 0, message: 'The sms code has expired. Please re-send the verification code to try again.' });
            }
        } else {
            res.status(500).json({ status: 0, message: 'Incorrect OTP entered. Please enter again' });
        }
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }
}

const editUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.user?._id;
        const userAddress = await UserAddresses.findById({ _id: _id }).populate(
            [
                { path: "users" }
            ]
        );
        const shareUser = {
            _id: req.user!._id,
            first_name: req.user!.first_name ?? '',
            last_name: req.user!.last_name ?? '',
            mobile: req.user!.mobile ?? '',
            email: req.user!.email ?? '',
            profile: req.user!.profile ? DIR + req.user!.profile : '',
            status: req.user!.status,
            createAt: req.user!.createdAt,
            Updated: req.user!.updatedAt,
        }
        res.status(200).json({ status: 1, user: shareUser })
    } catch (e) {
        res.status(500).json({ status: 0, message: e })
    }
}

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const _id = req.user?._id;
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'This action isnot alowed at this time!' });
        }
        const user = await User.findById({ _id })!;

        user!.first_name = req.body.first_name ? req.body.first_name : user!.first_name;
        user!.last_name = req.body.last_name ? req.body.last_name : user!.last_name;
        user!.email = req.body.email;
        let fileName: any = ''
        if (req.body.image) {
            let base64String: any = req.body.image
            let base64Image = base64String.split(';base64,').pop();
            fileName = `${user!.first_name}${new Date().getSeconds()}.png`

            if (user!.profile && user!.profile !== undefined) {
                fs.unlinkSync(userImagePath + req.user!.profile);
            }

            fs.writeFile(`./public/user/profile/${fileName}`, base64Image, { encoding: 'base64' }, function (err) {

            });
            user!.profile = fileName;
        }
        // if(user!.mobile === req.body.mobile){
        // user!.mobile = req.body.mobile ? req.body.mobile : user!.mobile;
        // user!.profile = fileName;

        await user!.save();
        const shareUser = {
            _id: user!._id,
            first_name: user!.first_name,
            last_name: user!.last_name,
            mobile: user!.mobile,
            email: user!.email,
            status: user!.status,
            createAt: user!.createdAt,
            lastUpdated: user!.updatedAt,
            profile: user!.profile ? DIR + user!.profile : ''
        }
        res.status(200).json({ status: 1, message: 'User profile updated successfully!', user: shareUser })
        // }
        // else{
        //     user!.mobile = req.body.mobile ? req.body.mobile : user!.mobile;
        //     user!.profile = fileName;
        //     req.user!.tokens = req.user!.tokens.filter((token: any) => {
        //     return token.token !== req.token;
        // });
        //  await  user?.save();
        //   res.status(200).json({ status: 1, message: 'User profile updated successfully!', user:'' })

        // } 

    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const userLogout = async (req: Request, res: Response) => {
    try {
        req.user!.tokens = req.user!.tokens.filter((token: any) => {
            return token.token !== req.token;
        });
        await req.user!.save();
        res.status(200).json({ status: 1, message: 'User logout succerssfully!' });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const convertBase64ImageToFile = () => {
    let base64String: any = 'data:image/jpeg;base64,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'; // Not a real image

    // Remove header
    let base64Image = base64String.split(';base64,').pop();

    fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function (err) {
        console.log('File created');
    });
}

export { loginUser, OtpVerify, editUser, updateUserProfile, userLogout, convertBase64ImageToFile }