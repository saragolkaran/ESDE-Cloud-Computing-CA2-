var AWS = require("aws-sdk"),                               
DDB = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    region: "us-east-1"
});                                                     

// (function uploadItemstoDynamoDB(){
    //  var 
    //     cat_2 = {
    //         Item:{
    //             "petname":{
    //                 S: "Hosepipe"
    //             },
    //             "breed":{
    //                 S: "Scottish Fold"
    //             }
    //         }, 
    //         ReturnConsumedCapacity: "TOTAL", 
    //         TableName: "lostcats"
    //     };
    //  DDB.putItem(cat_2, function(err, data){   
    //      console.log(err, data);         
    //  });
// })();

var file_1 = {
    Item:{
        "file_id":{
            S: "Puddles"
        },
        "file_name":{
            S: "Russian Blue"
        }
    }, 
    ReturnConsumedCapacity: "TOTAL", 
    TableName: "files"
};
DDB.putItem(file_1, function(err, data){   
    console.log(err, data);         
});