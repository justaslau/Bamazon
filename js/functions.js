var connection = require('./config');
var inquirer = require('inquirer');

var Functions = function() {

    this.makeConnection = function () {
        connection.connect(function(err){
            if (err) {
                console.log("Error connecting to database. \n" + err);
                return false;
            } else {
                console.log("Successfully connected to database.");
            }
        });
    }

    this.getProducts = function (tableName) {
        connection.query("SELECT * FROM " + tableName, function(err, res){
            if (err) throw err;
            console.log(res[0].product_name);
            return res;
        });
    }

    this.promptQuestion = function () {
        inquirer.prompt({
            type: 'list',
            name: 'productName',
            message: 'Which product do you want to buy?',
            choices: ['Test', 'Test2']
        })
        .then(answers => {
            console.log(answers.productName);
        });
    }
    this.makeConnection();
}



module.exports = Functions;