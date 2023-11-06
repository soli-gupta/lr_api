import bcrypt from "bcryptjs";
let fs = require("fs");
// var fs = require('fs');
const nodemailer = require("nodemailer");
const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 8);

  return encryptedPassword;
};

const createSlug = async (value: string) => {
  const convertToSlug = await value.toLowerCase().replace(/ /g, "-");
  return convertToSlug;
};

// function to encode file data to base64 encoded string
const base64Encode = async (file: any) => {
  const img = fs.readFileSync(file);
  console.log(img);
  return Buffer.from(img).toString("base64");
};

const generateRequestID = async () => {
  const sellRequestId = Math.floor(100000 + Math.random() * 900000);
  return sellRequestId;
};

const AddMinutesToDate = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() +
    ":" +
    (today.getMinutes() + 1) +
    ":" +
    today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};

const currentDateTime = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};

const sendEmail = async (userEmail: any, ccEmail: any, subject: any, message: any) => {
  let hostname = "smtp.gmail.com";
  let username = process.env.SMTP_USERNAME;
  let password = process.env.SMTP_PASSWORD;

  let transporter = nodemailer.createTransport({
    host: hostname,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: username,
      pass: password,
    },
    logger: true
  });

  let info = await transporter.sendMail({
    from: process.env.SMTP_SENDER,
    to: userEmail,
    cc: ccEmail,
    subject: subject,
    html: message,
    headers: { 'x-cloudmta-class': 'standard' }
  });

  console.log("Message sent: %s", info.response);
}

export const convertTimeStamp = (date: any) => {
  let currentDate = new Date(date)
  let dateFormat = currentDate.toDateString()
  let timeFormat = currentDate.toLocaleTimeString('en-US', { hour12: true });
  let convertDate = dateFormat + ' , ' + timeFormat
  return convertDate;
}

export {
  encryptPassword,
  createSlug,
  generateRequestID,
  AddMinutesToDate,
  currentDateTime,
  base64Encode,
  sendEmail
};
