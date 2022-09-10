const authModel = require("../models/auth.model");
const cloudinary = require("../utils/cloudinary.utils");
const status = require("http-status");

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
            console.log("saveData", saveData.profile[0].res);

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
                {
                    message: "User Register Successfully",
                    status: true,
                    code: 201,
                    statusCode: 1,
                    data: response
                }
            )

        } else {
            res.status(status.CONFLICT).json(
                {
                    message: "Email Already Exist",
                    status: false,
                    code: 409,
                    statusCode: 0
                }
            )
        }


    } catch (error) {
        console.log("Error::", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            {
                message: "Something Went Wrong",
                status: false,
                code: 500,
                statusCode: 0,
                error: error.message
            }
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
                {
                    message: "Data Not Exist",
                    status: false,
                    code: 404,
                    statusCode: 0
                }
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
                    {
                        message: "User Login Successfully",
                        status: true,
                        code: 200,
                        statusCode: 1,
                        data: response
                    }
                )
            } else {
                res.status(status.UNAUTHORIZED).json(
                    {
                        message: "Password Not Match",
                        status: false,
                        code: 401,
                        statusCode: 0
                    }
                )
            }
        }

    } catch (error) {
        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            {
                message: "Something Went Wrong",
                status: false,
                code: 500,
                statusCode: 0,
                error: error.message
            }
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
            {
                message: "User Login Successfully",
                status: true,
                code: 200,
                statusCode: 1,
                data: getAllData
            }
        )

    } catch (error) {
        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            {
                message: "Something Went Wrong",
                status: false,
                code: 500,
                statusCode: 0,
                error: error.message
            }
        )
    }
}

exports.viewById = async (req, res) => {
    try {

        const findUserById = await authModel.findById(
            {
                _id: req.params.id
            }
        ).select('-__v');

        res.status(status.OK).json(
            {
                message: "User Login Successfully",
                status: true,
                code: 200,
                statusCode: 1,
                data: findUserById
            }
        )

    } catch (error) {
        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            {
                message: "Something Went Wrong",
                status: false,
                code: 500,
                statusCode: 0,
                error: error.message
            }
        )
    }
}