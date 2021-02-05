const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
//winston
const logger = require('../services/loggingService.js');

//login
exports.processLogin = async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    
    try {
        let results = await auth.authenticate(email);
        console.log("GOT RESULTS")
        if (results.length == 1) {
            if ((password == null) || (results[0] == null)) {
                res.status(500).json({ "message": 'login failed' });
                logger.error(`${res.statusCode || 500} - Login Failed - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return
            }
            if (bcrypt.compareSync(password, results[0].user_password) == true) {
                console.log("CORRECT PASSWORD")
                let today = new Date()
                // console.log(new Date())
                today.setDate(today.getDate() + 1);
                let data = {
                    "success": true,
                    "message": "design updated successfully",
                    "data": {
                        role_name: results[0].role_name,
                        token: jwt.sign({ user_id: results[0].user_id, role: results[0].role_name, expiresOn: today.toISOString().slice(0, 19).replace('T', ' ') }, config.JWTKey, {
                            expiresIn: 86400 //Expires in 24 hrs
                        })
                    }
                }
                res.status(200).json(data);
                logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return
            } else {
                res.status(500).json({'message':'error' });
                logger.error(`${res.statusCode || 500} - Login Failed (Catch) - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return
            }// end
        }//end

    } catch (error) {
        res.status(500).json({"message":"error" });
        logger.error(`${res.statusCode || 500} - Login Failed - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    }//end of try/catch
}; 

//settle validation for register(regex)
//added async
exports.processRegister = async (req, res, next) => {
    console.log('processRegister running');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;


    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log('Error on hashing password');
            res.status(500).json({ 'message': 'Unable to complete registration' });
            logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return

        } else {
            try {
                results = await user.createUser(fullName, email, hash);
                console.log(results);

                res.status(200).json({
                        "success": true,
                        "message": 'Completed registration',
                        "data": {}
                    });
                logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return
            } catch (error) {
                console.log('processRegister method : catch block section code is running');
                console.log(error, '=======================================================================');
                res.status(500).json({ 'message': 'Unable to complete registration' });
                logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return
            }
        }
    });


}; //End of processRegister

//logout
exports.processLogout = async (req, res, next) => {
    console.log('Process logout is currently running');
    // console.log(req.headers['authorization'])
    let token = req.token;
    let user_id = req.body.userId;
    let timestamp = req.tokenExpiry;

    // console.log(user_id)
    // console.log(token)
    // return res.status(200).json({ message: 'Completed logut' });
    try {
        let results = await auth.logout(user_id, token, timestamp);
        console.log(results);
        res.status(200).json({
            "success": true,
            "message": 'Logout Succesfully',
            "data": {}
        });

        logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    } catch (error) {
        console.log('processLogout method : catch block section code is running');
        console.log(error, '=======================================================================');
        res.status(500).json({ 'message': 'Unable to complete logout' });
        logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return
    }


}; //End of process

