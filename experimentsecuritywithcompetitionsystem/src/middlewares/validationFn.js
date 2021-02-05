var validator = require('validator');
const logger = require('../services/loggingService.js');

//settle
var validationFn = {
    validateUpdateDesign: function (req, res, next) {
        var designTitle = req.body.designTitle;
        var designDescription = req.body.designDescription;

        designTitlepattern = new RegExp('^[\\w.-\\s]+$');

        if (designTitlepattern.test(designTitle) && designTitlepattern.test(designDescription)) {
            next();
        } else {
            console.log("validation error")
            logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.status(500);
            res.send(`{'message':'Invalid Design Title and/or Design Description'}`);
        }

    },

    //settle
    validateDesignSubmission: function (req, res, next) {
        var designTitle = req.body.designTitle;
        var designDescription = req.body.designDescription;

        designTitlepattern = new RegExp('^[\\w.-\\s]+$');
        console.log(designTitlepattern.test(designTitle))
        console.log(designTitlepattern.test(designDescription))

        if (designTitlepattern.test(designTitle) && designTitlepattern.test(designDescription)) {
            next();
        } else {
            console.log("validation error")
            
            res.status(500);
            res.send(`{'message' :'Error !!'}`);
            logger.error(`${res.statusCode || 500} - Submit Failed - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        }

    },


    validateRegister: function (req, res, next) {

        var fullName = req.body.fullName;
        var email = req.body.email;
        var password = req.body.password;

        reUserName = new RegExp(`^[a-zA-Z\\s,']+$`);
        rePassword = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})`);

        console.log(fullName, email, password);

        if (reUserName.test(fullName) && rePassword.test(password) && validator.isEmail(email)) {
            console.log('validate is running');
            next();
        } else {
            console.log("validation error")
            logger.error(`${res.statusCode || 500} - Register Failed - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.status(500).json({'message':'Invalid Name and/or email and/or password' });
        }
    },

    validateLogin: function (req, res, next) {


        var email = req.body.email;
        var password = req.body.password;

        var rePassword = new RegExp('^[a-zA-Z0-9_.!-]*$');
        console.log(validator.isEmail(email) + "email");
        if (validator.isEmail(email) && rePassword.test(password)) {
            console.log('validate is running');
            next();
        } else {
            console.log("validation error")
            logger.error(`${res.statusCode || 500} - Login Failed - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.status(500);
            res.send(`{'message' :'Error !!'}`);
        }
    },

    sanitizeResult: function (result) {
        if (result.filedata) {
            for (file of result.filedata) {
                file.design_title = validator.escape(file.design_title);
                file.design_description = validator.escape(file.design_description);
            }
        } else if (result.userdata) {
            if (result.userdata.length > 1) {
                for (user of result.userdata) {
                    user.fullname = validator.escape(user.fullname);
                    user.email = validator.escape(user.email);
                    user.role_name = validator.escape(user.role_name);
                }
            } else {
                result.userdata.fullname = validator.escape(result.userdata.fullname);
                result.userdata.email = validator.escape(result.userdata.email);
                result.userdata.role_name = validator.escape(result.userdata.role_name);
            }
        }
        return result;
    }


}



module.exports = validationFn;
