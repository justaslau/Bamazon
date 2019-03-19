use bamazon;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS departments;

CREATE TABLE products (
item_id int PRIMARY KEY AUTO_INCREMENT,
product_name VARCHAR(255) NOT NULL,
department_name VARCHAR(255) NOT NULL,
price DOUBLE NOT NULL,
stock_quantity INT,
product_sales DOUBLE DEFAULT 0
);

CREATE TABLE departments (
department_id INT UNIQUE AUTO_INCREMENT,
department_name VARCHAR(255) PRIMARY KEY NOT NULL,
over_head_costs DOUBLE
);

INSERT INTO `departments` VALUES
(1, 'Laptops', 2000),
(2, 'Accessories', 480),
(3, 'Smart Phones', 1200),
(4, 'Monitors', 214.56),
(5, 'Personal Computers', 4500);

INSERT INTO `products` VALUES
(11763, 'Apple iPhone 7 512 GB', 'Smart Phones', 499.99, 0, 0),
(26073, 'Dell XPS 15', 'Laptops', 899.99, 3, 899.99),
(27382, 'Apple iPhone 10 XS', 'Smart Phones', 1199.99, 10, 0),
(39937, 'Asus VivoBook 14 in.', 'Laptops', 499.99, 19, 0),
(42400, 'HP Workstation Z420', 'Personal Computers', 1999.85, 5, 1999.85),
(44297, 'Apple iPhone 8 64 GB', 'Smart Phones', 879.89, 9, 0),
(56959, 'Apple Macbook Pro', 'Laptops', 1689.99, 1, 6759.96),
(58530, 'Apple Macbook Air', 'Laptops', 1199.99, 16, 2399.98),
(58718, 'Apple Magic Mouse 2', 'Accessories', 99, 25, 297),
(59967, 'Bose QuietComfort 3', 'Accessories', 349.95, 3, 0),
(63265, 'Bose Companion 2', 'Accessories', 99.89, 12, 0),
(64741, 'Samsung Galaxy S9', 'Smart Phones', 879.99, 6, 2639.97),
(78048, 'Apple Magic Keyboard', 'Accessories', 129, 21, 516),
(82885, 'DELL Monitor 36\"', 'Monitors', 455.99, 3, 1367.97);