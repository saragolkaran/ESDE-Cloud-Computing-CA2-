// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const validationFn = require('./middlewares/validationFn');
const verifyToken = require('./middlewares/verifyToken');

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', validationFn.validateLogin,  authController.processLogin);
    router.post('/api/user/register', validationFn.validateRegister, authController.processRegister);
    router.post('/api/user/logout', verifyToken, authController.processLogout);
    router.post('/api/user/process-submission',verifyToken, validationFn.validateDesignSubmission, userController.processDesignSubmission);
    router.put('/api/user/', verifyToken, userController.processUpdateOneUser);
    router.put('/api/user/design/', verifyToken, validationFn.validateUpdateDesign,userController.processUpdateOneDesign);

    router.get('/api/user/process-search-design/:pagenumber/:search?', verifyToken,userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?', verifyToken, userController.processGetUserData);
    router.get('/api/user/', verifyToken, userController.processGetOneUserData); //for profile
    router.get('/api/user/:recordId', verifyToken, userController.processGetOneUserDataAdmin); //for admin update user
    router.get('/api/user/design/:fileId', verifyToken, userController.processGetOneDesignData);

    // router.use((req,res,next) => { //if route doesnt exist
    //     return res.status(500).json({"message":"route does not exist"})
    // })
};

