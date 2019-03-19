var connection = require('./js/config');
var inquirer = require('inquirer');
var Table = require('cli-table');

var supervisorOptions = {
	type: 'rawlist',
	name: 'supervisorOption',
	message: 'Please select option from this menu.',
	choices: ['View Product Sales by Department', 'Create New Department']
}

var askDepName = {
	type: 'input',
	name: 'depName',
	message: 'Please enter department name.',
}

var askDepCosts = {
	type: 'input',
	name: 'depCosts',
	message: 'Please enter over head costs.',
	validate: function(value) {
		var pass = value.match(/^\d*(\.\d+)?$/);
		if (pass) {
			return true;
		}
		return 'Input format is not correct.';
	}
}

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
			promptSupervisorOptions(supervisorOptions);
		}
	});
}

function promptSupervisorOptions(question) {
	inquirer.prompt(question).then(answers => {
		if (answers.supervisorOption === supervisorOptions.choices[0]) {
			viewDepSales();
		} else {
			getDepInfo();
		}
	});
}

// Function to detect has manager completed working with this application
function continueApp() {
	inquirer.prompt(askContinue).then(answers => {
		if (answers.continue) {
			promptSupervisorOptions(supervisorOptions);
		} else {
			console.log("Thank you for using this application. Bye.")
		}
	});
}

function viewDepSales() {
	var table = new Table({
		head: ['ID', 'Department', 'Costs', 'Sales', 'Profit'],
		colWidths: [5, 20, 10, 10, 10]
	});

	connection.query("SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(products.product_sales) as product_sales, COALESCE(SUM(products.product_sales),0)-COALESCE(departments.over_head_costs,0) AS total_profit FROM products INNER JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name ORDER BY departments.department_id ASC", function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales.toFixed(2), res[i].total_profit.toFixed(2)]);
		}
		console.log(table.toString());
		continueApp();
	});
}

function getDepInfo() {
	var depName;
	var depCosts;
	inquirer.prompt(askDepName).then(answers => {
		depName = answers.depName;
		inquirer.prompt(askDepCosts).then(answers => {
			depCosts = answers.depCosts;
			addDepartmentDb(depName, depCosts);
		});
	});
}

function addDepartmentDb (depName, depCosts) {
	connection.query("INSERT INTO departments SET ?", {
		department_name: depName,
		over_head_costs: depCosts
	}, function(err, res) {
		if (err) {console.log("Department with this name already exists.")}
		console.log("Department successfully added to database.");
		continueApp();
	});
}
makeConnection();