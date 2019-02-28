// Application for manager, to work with products.

var connection = require('./js/config');
var inquirer = require('inquirer');
var Table = require('cli-table');

var managerOptions = {
	type: 'rawlist',
	name: 'managerOption',
	message: 'Please select option from this menu.',
	choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
}
var askProductId = {
	type: 'input',
	name: 'productId',
	message: 'Please enter product ID. (5 digits)',
	validate: function(value) {
		var pass = value.match(/^[0-9]{5,5}$/);
		if (pass) {
			return true;
		}
		return 'ID is not correct, has to be 5 digits';
	}
}
var askQuantity = {
	type: 'input',
	name: 'productQty',
	message: 'Please enter TOTAL product quantity you have in stock. (from 1 to 999)',
	validate: function(value) {
		var pass = value.match(/^[0-9]{1,3}$/);
		if (pass) {
			return true;
		}
		return 'Quantity is not correct.';
	}
}
var askProductName = {
	type: 'input',
	name: 'productName',
	message: 'Please enter product name.',
}
var askProductDep = {
	type: 'input',
	name: 'productDep',
	message: 'Please enter product department.',
}
var askProductPrice = {
	type: 'input',
	name: 'productPrice',
	message: 'Please enter product price.',
	validate: function(value) {
		var pass = value.match(/^\d*(\.\d+)?$/);
		if (pass) {
			return true;
		}
		return 'Price is not correct.';
	}
}
var askContinue = {
	type: 'confirm',
	name: 'continue',
	message: 'Do you wanna continue with this app?'
}
// Function making connection with database and starting app.
function makeConnection() {
	connection.connect(function(err) {
		if (err) {
			console.log("Error connecting to database. \n" + err);
		} else {
			console.log("Successfully connected to database.");
			promptManagerOptions(managerOptions);
		}
	});
}
// Function to detect managers choice from list and call function by selected option
function promptManagerOptions(question) {
	inquirer.prompt(question).then(answers => {
		if (answers.managerOption === managerOptions.choices[0]) {
			allProducts();
		} else if (answers.managerOption === managerOptions.choices[1]) {
			lowProducts();
		} else if (answers.managerOption === managerOptions.choices[2]) {
			promptGetProductId(askProductId);
		} else if (answers.managerOption === managerOptions.choices[3]) {
			getProductInfo();
		}
	});
}
// Function to get products ID to continue with updating quantity
function promptGetProductId(question) {
	inquirer.prompt(question).then(answers => {
		selectedId = answers.productId;
		addInventory(selectedId);
	});
}
// Function to select all products from database and print in table
function allProducts() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		var table = new Table({
			head: ['#', 'ID', 'Name', 'Price $', 'Qty'],
			colWidths: [5, 10, 50, 20, 5]
		});
		for (var i = 0; i < res.length; i++) {
			id = res[i].item_id;
			name = res[i].product_name;
			price = res[i].price.toFixed(2);
			quantity = res[i].stock_quantity;
			table.push([(i + 1), id, name, price, quantity]);
		};
		console.log(table.toString());
		continueApp();
	});
}
// Function to select products with less than 5 quantity and display in table
function lowProducts() {
	connection.query("SELECT * FROM products HAVING stock_quantity < 5", function(err, res) {
		if (err) throw err;
		var table = new Table({
			head: ['#', 'ID', 'Name', 'Price $', 'Qty'],
			colWidths: [5, 10, 50, 20, 5]
		});
		for (var i = 0; i < res.length; i++) {
			id = res[i].item_id;
			name = res[i].product_name;
			price = res[i].price.toFixed(2);
			quantity = res[i].stock_quantity;
			table.push([(i + 1), id, name, price, quantity]);
		};
		console.log(table.toString());
		continueApp();
	});
}
// Function to update products' quantity
function addInventory(selected) {
	inquirer.prompt(askQuantity).then(answers => {
		quantity = connection.escape(answers.productQty);
		selected = connection.escape(selected);
		connection.query("UPDATE products SET stock_quantity =" + quantity + " WHERE item_id=" + selected, function(err, res) {
			if (err) throw err;
			if (res.changedRows > 0) {
				console.log("Product quantity successfully updated.")
				continueApp();
			} else {
				console.log("Please check product ID. 0 records were updated.")
				continueApp();
			}
		});
	});
}
// Function to get new products information entered by manager
function getProductInfo() {
	var productName;
	var productDep;
	var productPrice;
	var productQty;
	inquirer.prompt(askProductName).then(answers => {
		productName = answers.productName;
		inquirer.prompt(askProductDep).then(answers => {
			productDep = answers.productDep;
			inquirer.prompt(askProductPrice).then(answers => {
				productPrice = answers.productPrice;
				inquirer.prompt(askQuantity).then(answers => {
					productQty = answers.productQty;
					generateId(productName, productDep, productPrice, productQty);
				});
			});
		});
	});
}
// Function to generate random product ID, it checks database for dublicate as well 
function generateId(name, dep, price, qty) {
	var min = 10000;
	var max = 99999;
	var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
	connection.query("SELECT COUNT(*) as cnt FROM products WHERE item_id=" + randomNum, function(err, res) {
		if (err) throw err;
		if (res[0].cnt === 0) {
			addToDatabase(randomNum, name, dep, price, qty);
		} else {
			generateId(name, dep, price, qty);
		}
	});
}
// Function to add product to database
function addToDatabase(randomNum, name, dep, price, qty) {
	name = connection.escape(name);
	dep = connection.escape(dep);
	console.log(randomNum, name, dep, price, qty);
	connection.query("INSERT INTO products SET ?", {
		item_id: randomNum,
		product_name: name,
		department_name: dep,
		price: price,
		stock_quantity: qty
	}, function(err, res) {
		if (err) throw err;
		console.log("Product successfully added to database.");
		continueApp();
	});
}
// Function to detect has manager completed working with this application
function continueApp() {
	inquirer.prompt(askContinue).then(answers => {
		if (answers.continue) {
			promptManagerOptions(managerOptions);
		} else {
			console.log("Thank you for using this application. Bye.")
		}
	});
}

// Calling function to make connection with database
makeConnection();