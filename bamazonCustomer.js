var connection = require('./js/config');
var inquirer = require('inquirer');

var FirstQuestion = {
	type: 'rawlist',
	name: 'productName',
	message: 'Which product do you want to buy?',
	choices: []
}
var SecondQuestion = {
	type: 'input',
	name: 'quantity',
	message: "Please enter quantity to buy.",
	validate: function(value) {
		var pass = value.match(/^\d+$/);
		if (pass) {
			return true;
		}
		return 'Only whole numbers accepted';
	}
};

var askContinue = {
	type: 'confirm',
	name: 'continue',
	message: 'Do you wanna continue with this app?'
}

function makeConnection() {
	connection.connect(function(err) {
		if (err) {
			console.log("Error connecting to database. \n" + err);
		} else {
			console.log("Successfully connected to database.");
			getProducts("products");
		}
	});
}

// Function to detect has manager completed working with this application
function continueApp() {
	inquirer.prompt(askContinue).then(answers => {
		if (answers.continue) {
			promptFirstQuestion(FirstQuestion);
		} else {
			console.log("Thank you for using this application. Bye.")
		}
	});
}

function getProducts(tableName) {
	connection.query("SELECT * FROM " + tableName, function(err, res) {
		if (err) throw err;
		FirstQuestion.choices = [];
		for (var i = 0; i < res.length; i++) {
			id = res[i].item_id;
			name = res[i].product_name;
			price = res[i].price;
			FirstQuestion.choices.push(id + " " + name + " ($" + price + ")");
		};
	});
}

function checkQuantity(id, quantity) {
	connection.query("SELECT stock_quantity, price FROM products WHERE item_id=" + id, function(err, res) {
		if (err) throw err;
		if (res[0].stock_quantity >= quantity) {
			totalPrice = res[0].price * quantity;
			totalPrice = totalPrice.toFixed(2)
			console.log("Order successfully completed.");
			console.log("You were charged $" + totalPrice);
			var newQuantity = res[0].stock_quantity - quantity;
			updateSales(id, totalPrice);
			updateQuantity(id, newQuantity);
			continueApp();
		} else {
			console.log("Sorry. We don't have enough quanitity in stock to complete your order.")
			continueApp();
		}
	});
}

function updateQuantity(id, quantity) {
	connection.query("UPDATE products SET stock_quantity =" + quantity + " WHERE item_id=" + id, function(err, res) {
		if (err) throw err;
	});
}

function updateSales(id, totalPrice) {
	connection.query("SELECT product_sales FROM products WHERE item_id=" + id, function(err, res) {
		if (err) throw err;
		var updatedSales = parseFloat(res[0].product_sales) + parseFloat(totalPrice);
		connection.query("UPDATE products SET product_sales =" + updatedSales + " WHERE item_id=" + id, function(err, res) {
			if (err) throw err;
		});
	});
}

function promptFirstQuestion(question) {
	inquirer.prompt(question).then(answers => {
		selectedId = answers.productName.substring(0, 5);
		promptSecondQuestion(SecondQuestion, selectedId);
	});
}

function promptSecondQuestion(question, selectedId) {
	inquirer.prompt(question).then(answers => {
		checkQuantity(selectedId, answers.quantity);
	});
}
makeConnection();
setTimeout(function() {
	promptFirstQuestion(FirstQuestion);
}, 200)