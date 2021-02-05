config = require('../config/config');
const pool = require('../config/database')

module.exports.authenticate = (email) => {
    return new Promise((resolve, reject) => { 
        pool.getConnection((err,connection) => {
            if (err) {
                console.log('Database connection errror ', err);
                resolve(err);   
            } else {
                connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                FROM user INNER JOIN role ON user.role_id=role.role_id AND email= ?`, [email], (err, results) => {
                    if(err) {
                        reject(err);
                    }else {
                        if(results.length == 1){
                            console.log(results);
                            resolve(results);
                        }else {
                            reject('Login has failed');
                        }
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
} //end of authenticate

module.exports.logout = (userID, token, timestamp) => {
    console.log("LOGOUT FUNCTION CALLED")
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`INSERT INTO blacklistedjwt (fk_user_id, jwt_token_blacklist, Timestamp) VALUES (?, ?, ?)`, [userID, token, timestamp], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of logout

module.exports.getBlacklistedTokens = () => {
    console.log("getBlacklistedTokens FUNCTION CALLED")
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Database connection error ', err);
                resolve(err);
            } else {
                connection.query(`SELECT jwt_token_blacklist FROM blacklistedjwt`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of getBlacklistedTokens



