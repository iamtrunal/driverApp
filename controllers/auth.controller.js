const authModel = require("../models/auth.model");
const cloudinary = require("../utils/cloudinary.utils");
const status = require("http-status");
const APIResponse = require("../helper/APIResponse");
const { models } = require("mongoose");

exports.registration = async (req, res) => {
    try {

        let email = req.body.email;

        const cloudinaryImageUploadMethod = async file => {
            return new Promise(resolve => {
                cloudinary.uploader.upload(file, (err, res) => {
                    console.log("file", file);
                    if (err) return err
                    resolve({
                        res: res.secure_url
                    })
                }
                )
            })
        }

        const urls = []
        const files = req.files;
        console.log("req.files::::", req.files);

        for (const file of files) {
            const { path } = file
            console.log("path::", path);

            const newPath = await cloudinaryImageUploadMethod(path)
            console.log("newPath::", newPath);
            urls.push(newPath)
        }

        const getData = await authModel.find({ email: email });

        if (getData.length == 0) {
            const authData = authModel({
                profile: urls,
                username: req.body.username,
                age: req.body.age,
                sex: req.body.sex,
                vehicleType: req.body.vehicleType,
                dailyKM: req.body.dailyKM,
                email: email,
                number: req.body.number,
                password: req.body.password
            });

            const saveData = await authData.save();

            const response = {
                user_id: saveData._id,
                profile: saveData.profile[0].res,
                username: saveData.username,
                age: saveData.age,
                sex: saveData.sex,
                vehicleType: saveData.vehicleType,
                dailyKM: saveData.dailyKM,
                email: saveData.email,
                number: saveData.number,
                password: saveData.password
            }

            res.status(status.CREATED).json(
                new APIResponse("User Register Successfully", true, 201, 1, response)
            )
        } else {
            res.status(status.CONFLICT).json(
                new APIResponse("Email Already Exist", "false", 409, 1)
            )
        }


    } catch (error) {
        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            new APIResponse("Something Went Wrong", "false", 500, "0", error.message)
        )
    }
}

exports.login = async (req, res) => {
    try {

        let email = req.body.email;
        let password = req.body.password;

        const getAuthData = await authModel.find({ email: email });

        if (getAuthData.length == 0) {
            res.status(status.NOT_FOUND).json(
                new APIResponse("Data Not Exist", "false", 404, "0", error.message)
            )
        } else {
            if (getAuthData[0].password == password) {

                const getData = await authModel.find({ email: email });

                const response = {
                    user_id: getData[0]._id,
                    profile: getData[0].profile[0].res,
                    username: getData[0].username,
                    age: getData[0].age,
                    sex: getData[0].sex,
                    vehicleType: getData[0].vehicleType,
                    dailyKM: getData[0].dailyKM,
                    email: getData[0].email,
                    number: getData[0].number,
                    password: getData[0].password
                }

                res.status(status.OK).json(
                    new APIResponse("User Login Successfully", true, 200, 1, response)
                )
            } else {
                res.status(status.UNAUTHORIZED).json(
                    new APIResponse("Password Not Match", "false", 401, "0")
                )
            }
        }

    } catch (error) {
        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            new APIResponse("Something Went Wrong", "false", 500, "0", error.message)
        )
    }
}

exports.all_user = async (req, res) => {
    try {

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const getAllData = await authModel.find().skip(startIndex).limit(endIndex);

        res.status(status.OK).json(
            new APIResponse("User Login Successfully", true, 200, 1, getAllData)
        )

    } catch (error) {
        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            new APIResponse("Something Went Wrong", "false", 500, "0", error.message)
        )
    }
}