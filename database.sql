-- Database setup for vulnerable web application
-- FOR EDUCATIONAL PURPOSES ONLY

CREATE DATABASE IF NOT EXISTS vulnerable_db;
USE vulnerable_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
  quantity INT,
  total DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_user INT,
  to_user INT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user) REFERENCES users(id),
  FOREIGN KEY (to_user) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (username, password, email, role) VALUES
('admin', 'admin123', 'admin@example.com', 'admin'),
('user1', 'password123', 'user1@example.com', 'user'),
('user2', 'pass456', 'user2@example.com', 'user'),
('testuser', 'test', 'test@example.com', 'user');

INSERT INTO products (name, description, price) VALUES
('Laptop', 'High performance laptop', 999.99),
('Mouse', 'Wireless mouse', 29.99),
('Keyboard', 'Mechanical keyboard', 79.99),
('Monitor', '27 inch 4K monitor', 399.99);

INSERT INTO orders (user_id, product_id, quantity, total) VALUES
(2, 1, 1, 999.99),
(2, 2, 2, 59.98),
(3, 3, 1, 79.99),
(3, 4, 1, 399.99);
