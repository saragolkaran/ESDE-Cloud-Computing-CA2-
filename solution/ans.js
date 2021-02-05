//add_index.js
var 
    AWS = require("aws-sdk"),                              
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });                                                    

(function addIndex(){
    var 
        params = {
            TableName: "lostcats",
            AttributeDefinitions: [{
                AttributeName: "breed",
                AttributeType: "S"
            }],
            GlobalSecondaryIndexUpdates: [{
                Create: {
                    IndexName: "breed_index",
                    KeySchema: [{
                        AttributeName: "breed",
                        KeyType: "HASH"
                    }],
                    Projection: {
                        ProjectionType: "ALL"
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1, 
                        WriteCapacityUnits: 1
                    }
                }
            }]
        };
     DDB.updateTable(params, function(err, data){
         console.log(err, data);             
     });
})();


//create table
var 
    AWS = require("aws-sdk"),                               // Bring in the aws-sdk
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });                                                     // Create an S3API object

(function createADataBaseTable(){
    var 
        params = {
            AttributeDefinitions: [{
                AttributeName: "petname", 
                AttributeType: "S"
            }], 
            KeySchema: [{
                AttributeName: "petname", 
                KeyType: "HASH"
            }], 
            ProvisionedThroughput: {
                ReadCapacityUnits: 1, 
                WriteCapacityUnits: 1
            }, 
            TableName: "lostcats"
        };
     DDB.createTable(params, function(err, data){
         console.log(err, data);             
     });
})();

//edit_item.js
var
    AWS = require("aws-sdk"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });
(function editItemInDynamo(){
    var params = {
        TableName: "lostcats",
        Key:{
            petname: {
                S: "Hosepipe"
            }
        },
        UpdateExpression: "set breed = :b",
        ExpressionAttributeValues: {
            ":b": {
                "S": "British Shorthair"
            }
        },
        ReturnValues: "UPDATED_NEW"
    };
    DDB.updateItem(params, function(err, data){
        console.log(err, data);
    });
})();

//query_table.js
var 
    AWS = require("aws-sdk"),                            
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });                                                   

(function queryTable(){
    var 
        params = {
            ExpressionAttributeValues: {
                ":catname": {
                    S: "Puddles"
                }
            },
            KeyConditionExpression: "petname = :catname",
            ProjectionExpression: "notable_features",
            TableName: "lostcats"
        };
     DDB.query(params, function(err, data){
         if(err){
             throw err;
         }
         console.log(data.Items[0].notable_features.S); 
     });
})();

//upload_item
var 
    AWS = require("aws-sdk"),                               
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });                                                     

(function uploadItemstoDynamoDB(){
    var 
        cat_1 = {
            Item:{
                "petname":{
                    S: "Puddles"
                },
                "breed":{
                    S: "Russian Blue"
                }
            }, 
            ReturnConsumedCapacity: "TOTAL", 
            TableName: "lostcats"
        };
     DDB.putItem(cat_1, function(err, data){   
         console.log(err, data);         
     });
     var 
        cat_2 = {
            Item:{
                "petname":{
                    S: "Hosepipe"
                },
                "breed":{
                    S: "Scottish Fold"
                }
            }, 
            ReturnConsumedCapacity: "TOTAL", 
            TableName: "lostcats"
        };
     DDB.putItem(cat_2, function(err, data){   
         console.log(err, data);         
     });
})();

//test 

