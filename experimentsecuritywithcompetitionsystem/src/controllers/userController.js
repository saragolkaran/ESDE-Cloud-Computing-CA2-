const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');
const validationFn = require('../middlewares/validationFn');

//winston
const logger = require('../services/loggingService.js');


// 
exports.processDesignSubmission = (req, res, next) => {
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userId = req.body.userId;
    let file = req.body.file;
    fileDataManager.uploadFile(file, async function (error, result) {
        console.log('check result variable in fileDataManager.upload code block\n', result);
        console.log('check error variable in fileDataManager.upload code block\n', error);
        let uploadResult = result;
        if (error) {
            let message = 'Unable to complete file submission.';
            res.status(500).json({ "message": message });
            logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.end();
        } else {
            //Update the file table inside the MySQL when the file image
            //has been saved at the cloud storage (Cloudinary)
            let imageURL = uploadResult.imageURL;
            let publicId = uploadResult.publicId;
            console.log('check uploadResult before calling createFileData in try block', uploadResult);
            try {
                let result = await fileDataManager.createFileData(imageURL, publicId, userId, designTitle, designDescription);
                console.log('Inspert result variable inside fileDataManager.uploadFile code');
                console.log(result);
                if (result) {
                    let data = {
                        "success": true,
                        "message": 'File submission completed.',
                        "data": {
                            imageURL: imageURL
                        }
                    }
                    res.status(200).json(data);
                    logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                }
            } catch (error) {
                let message = 'File submission failed.';
                res.status(500).json({
                    "message": message
                });
                logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            }
        }
    })
}; //End of processDesignSubmission
exports.processGetSubmissionData = async (req, res, next) => {
    console.log("processGetSubmissionData called")
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;

    try {
        let results = await fileDataManager.getFileData(userId, pageNumber, search);
        // console.log('Inspect result variable inside processGetSubmissionData code\n', results);
        if (results) {
            var jsonResult = {
                "success": true,
                "message": "Get submission data successfully",
                "data": {
                    'number_of_records': results[0].length,
                    'page_number': pageNumber,
                    'filedata': results[0],
                    'total_number_of_records': results[2][0].total_records
                }
            }
            //sanitise
            jsonResult = validationFn.sanitizeResult(jsonResult);
            res.status(200).json(jsonResult);
            logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        res.status(500).json({
            "message": message
        });
        logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    }



}; //End of processGetSubmissionData
exports.processGetUserData = async (req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;

    if (req.role != 'admin') {
        return res.status(403).json({ message: 'Not authorized!' })
    }

    try {
        let results = await userManager.getUserData(pageNumber, search);
        console.log('Inspect result variable inside processGetUserData code\n', results);
        if (results) {
            var jsonResult = {
                "success": true,
                "message": "Get user data successfully",
                "data": {
                    'number_of_records': results[0].length,
                    'page_number': pageNumber,
                    'userdata': results[0],
                    'total_number_of_records': results[2][0].total_records
                }
            }
            //sanitise
            jsonResult = validationFn.sanitizeResult(jsonResult);
            res.status(200).json(jsonResult);
            logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        res.status(500).json({
            "message": error
        });
        logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    }

}; //End of processGetUserData

exports.processGetOneUserData = async (req, res, next) => { //for profile
    let recordId = req.body.userId;
    try {
        let results = await userManager.getOneUserData(recordId);
        console.log('Inspect result variable inside processGetOneUserData code\n', results);
        if (results) {
            var jsonResult = {
                "success": true,
                "message": "Get one user data successfully",
                "data": {
                    'userdata': results[0],
                }
            }
            //sanitise
            jsonResult = validationFn.sanitizeResult(jsonResult);
            res.status(200).json(jsonResult);
            logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        res.status(500).json({
            "message": error
        });
        logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    }
}; //End of processGetOneUserData

exports.processGetOneUserDataAdmin = async (req, res, next) => { //for admin update user
    let recordId = req.params.recordId;

    if (req.role != 'admin') {
        return res.status(403).json({ "message": 'Not authorized!' })
    }

    try {
        let results = await userManager.getOneUserData(recordId);
        console.log('Inspect result variable inside processGetOneUserData code\n', results);
        if (results) {
            var jsonResult = {
                "success": true,
                "message": "Get user data admin successfully",
                "data": {
                'userdata': results[0],
            }
        }
            //sanitise
            jsonResult = validationFn.sanitizeResult(jsonResult);
            res.status(200).json(jsonResult);
            logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        res.status(500).json({
            "message": error
        });
        logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    }
}; //End of processGetOneUserData

exports.processUpdateOneUser = async (req, res, next) => {
    console.log('processUpdateOneUser running');
    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;

    if (req.role != 'admin') {
        return res.status(403).json({ 'message': 'Not authorized!' })
    }

    try {
        results = await userManager.updateUser(recordId, newRoleId);
        console.log(results);
        if (results) {
            var jsonResult = {
                "success": true,
                "message": "user updated successfully",
                "data": {
                    'recordId': recordId,
                    'new_role_id': newRoleId,
                }
            }
            res.status(200).json(jsonResult);
            logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        }
        return
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');
        res.status(500).json({ 'message': 'Unable to complete update operation' });
        logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    }


}; //End of processUpdateOneUser

exports.processGetOneDesignData = async (req, res, next) => {
    let recordId = req.params.fileId;

    try {
        let results = await userManager.getOneDesignData(recordId);
        console.log('Inspect result variable inside processGetOneFileData code\n', results);
        if (results) {
            var jsonResult = {
                "success": true,
                "message": "message",
                "data": {
                    'filedata': results[0],
                }
            }
            //sanitise
            // jsonResult = validationFn.sanitizeResult(jsonResult);
            res.status(200).json(jsonResult);
            logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return
        }
    } catch (error) {
        let message = 'Server is unable to process the request.';
        res.status(500).json({
            'message': 'error'
        });
        logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    }

}; //End of processGetOneDesignData

exports.processUpdateOneDesign = async (req, res, next) => {
    console.log('processUpdateOneFile running');
    //Collect data from the request body 
    let fileId = req.body.fileId;
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;

    try {
        results = await userManager.updateDesign(fileId, designTitle, designDescription);
        console.log(results);

        if (results) {
            var jsonResult = {
                "success": true,
                "message": "design updated successfully",
                "data": {
                    'file_id': fileId,
                    'new_design_title': designTitle,
                    'new_design_description': designDescription
                }
            }
        }
        res.status(200).json(jsonResult);
        // res.status(200).json({ message: 'Completed update' });
        logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');
        res.status(500).json({ 'message': 'Unable to complete update operation' });
        logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return

    }


}; //End of processUpdateOneDesign