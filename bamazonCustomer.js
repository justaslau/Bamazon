var connection = require('./js/config');
var inquirer = require('inquirer');
var dataFromDatabase;

FirstQuestion = {
    type: 'rawlist',
    name: 'productName',
    message: 'Which product do you want to buy?',
    choices: []
}

 function makeConnection () {
    connection.connect(function(err){
        if (err) {
            console.log("Error connecting to database. \n" + err);
        } else {
            console.log("Successfully connected to database.");
            getProducts("products");
        }
    });
}

function getProducts (tableName) {
    connection.query("SELECT * FROM " + tableName, function(err, res){
        if (err) throw err;
       for (var i=0; i < res.length; i++) {
            id = res[i].item_id;
            name = res[i].product_name;
            price = res[i].price;
            FirstQuestion.choices.push(id + " " + name + " ($" + price + ")");
       };
    });
}

function promptQuestion (question) {
    inquirer.prompt(question)
    .then(answers => {
       selectedId = answers.productName.substring(0, 5);
    });
}

makeConnection();


setTimeout(function() {
    promptQuestion(FirstQuestion);
}, 200)


