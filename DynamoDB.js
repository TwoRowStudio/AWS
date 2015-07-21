// JavaScript source code

/* this file contains functions to translate ordinary JS objects
into the format needed for interactions with AWS DynamoDB 
Written by Eric Groft 
Does not include handling for Binary, String set or number set data types*/

// JSON source file for variable listings that are to be stored 
// in a type other than string

// individual item conversion code - type defaults to String
function convertItemToDynamo (value, type) {
    var dynamoObject;
    var stringKey, stringValue, stringType;
    stringValue=String(value);
    switch (type) {
        case 'number':
            stringType = 'N';
            break;
        case 'null', 'undefined':
            stringType = 'NULL';
            break;
        case 'boolean':
            stringType = 'BOOL';
        default:
            stringType = 'S';
    }
    dynamoObject = {};
    dynamoObject[stringType] = stringValue;
    console.log(dynamoObject);
    return dynamoObject;
}

    // array loop conversion code
function convertArrayToDynamo(array, type) {
    var stringType = String(type);
    var passedArray = array;
    var passedKeys = [];
    var currValue;
    var dynamoArray = {};
    var returnObj;


    // use for loop creating an object for any array element that is an object
    //use Object.keys to get each key name and loop through on that basis until the elements are no longer objects
    if (stringType=='undefined' && passedArray.length===undefined) {
        stringType = 'object';
    }
    passedKeys = Object.keys(passedArray);
    console.log(passedKeys);
    for (var i = 0; i < passedKeys.length; i++) {
        currValue = passedArray[passedKeys[i]];
        if (typeof (currValue) == 'object') {
            stringType = 'object';
            dynamoArray[passedKeys[i]] = convertArrayToDynamo(currValue, 'object');
        } else {
            dynamoArray[passedKeys[i]] = convertItemToDynamo(currValue, typeof (currValue));
        }
    }


    
    if (stringType == 'object') {
        returnObj = {
            'M':dynamoArray
        };
    }
    else {
        returnObj = {
            'L':dynamoArray
        };    
    }
    console.log(returnObj);
    return returnObj;
}


// Dynamo --> JS object code - returns an array of results from dynamo queires

//function decodeDynamoToObject(dynamoObj) {
//    var items;
//    var containArray = [];
//    var containIndex = 0;
//    var keys = [];
//    var currKey;
//    var subKey;
//    var subValue;
//    var rtnKey;
//    var rtnValue;
//    items = dynamoObj.Items;
//    $.each(items, function (data) {
//        keys = Object.keys(this);
//        for (var i; i < keys.length; i++){
//            // examine value object for data type
//            currKey = data[keys[i]];
//            subKey = Object.keys(currKey)[0];
//            switch (subKey) {
//                // if a list create and define array
//                case 'L', 'NS','SS':
//                    subValue = currKey.subKey;
//                    for (var j; j < subValue.length; j++){
//                        rtnKey
//                    }
//                    break;
//                    // if map, call decode function and return result as value for key
//                case 'M':
//                    break;
//                    // if string - stringify
//                case 'S':
//                    break;
//                    // if numeric - use value only
//                case 'N':
//                    break;
//                default:
//            }
//        }
//        containIndex++;
//    });
//}