const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWTKEY;
const auth = require('../services/authService');
const logger = require('../services/loggingService.js');


async function verifyToken(req, res, next){
    console.log("verifyToken is Running")
    let blacklisted_tokens;
    // console.log(req.headers)
    let token = req.headers['authorization']; //retrieve authorization header's content
    // console.log(token);

    if(!token || !token.includes('Bearer')){ //process the token
       res.status(403);
       res.send({auth:'false', 'message':'Not authorized!'});
       logger.error(`${res.statusCode || 403} - User not authorized - ${req.originalUrl} - ${req.method} - ${req.ip}`);
       return
    }else{
        token=token.split('Bearer ')[1]; //obtain the token's value
        // console.log(token);
        try {
            blacklisted_tokens = await auth.getBlacklistedTokens();
            blacklisted_tokens = blacklisted_tokens.map((token)=>{ return token.jwt_token_blacklist });

            // for (x in blacklisted_tokens) {
            //     blacklisted_tokens[x] = blacklisted_tokens[x].jwt_token_blacklist;
            // }

        } catch (error) {
            let message = 'Server is unable to process your request.';
            res.status(500).json({ 'message': message });
            logger.error(`${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return
        }
        // console.log(blacklisted_tokens)

        if (blacklisted_tokens.length > 0) {
            for (tkn of blacklisted_tokens) {
                if (tkn == token) {
                    console.log('error')
                    res.status(403);
                    res.send({auth:'false', 'message':'Not authorized!'})
                    logger.error(`${res.statusCode || 403} - User not authorized - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    return
                }
            }
        }

       jwt.verify(token, JWT_SECRET, function(err, decoded){ //verify token
        if(err){
            res.status(403);
            res.send({auth:false, 'message':'Not authorized!'});
            logger.error(`${res.statusCode || 403} - User not authorized - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return
        }else{
            req.body.userId=decoded.user_id;   //extracted from token
            req.role = decoded.role;  //extracted from token
            // console.log(decoded);
            req.tokenExpiry = decoded.expiresOn;
            req.token = token;
            next();
            console.log("VALID TOKEN ACCEPTED")
        }
       });
    }
}


module.exports = verifyToken;

//checks thru the stuff in the deocoded token to see if its valid.. 
// is sets the user id and role to the information found in the decoded token, thats why no need local storage cos decoding from the token
// if decode from the token, 