-- Kigali Crafts E-commerce Database Schema for Docker initialization

CREATE DATABASE IF NOT EXISTS kigali_crafts;
USE kigali_crafts;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'MTN_MOMO',
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Sample Data
INSERT IGNORE INTO categories (name, description) VALUES
('Baskets', 'Traditional woven baskets and containers'),
('Jewelry', 'Handcrafted beaded jewelry and accessories'),
('Wooden Crafts', 'Carved wood items and sculptures');

INSERT IGNORE INTO products (name, description, price, stock_quantity, category_id) VALUES
('Agaseke Basket - Medium', 'Traditional Rwandan woven basket with intricate geometric patterns. Perfect for storage or decoration.', 35000, 50, 1),
('Agaseke Basket - Large', 'Large traditional woven basket ideal for gifting or home décor. Made by skilled artisans in Kigali.', 55000, 35, 1),
('Beaded Necklace Set', 'Colorful handbeaded necklace featuring traditional Rwandan colors and patterns. Includes matching bracelet.', 18000, 100, 2),
('Wooden Drum - Small', 'Hand-carved wooden drum with traditional designs. Authentic Rwandan instrument.', 42000, 25, 3),
('Beaded Earrings Collection', 'Set of 3 pairs of unique beaded earrings with different traditional patterns and vibrant colors.', 12000, 75, 2),
('Wooden Utensil Set', 'Set of 5 hand-carved wooden spoons and spatulas with decorative patterns. Food-safe and durable.', 28000, 40, 3);

INSERT IGNORE INTO users (name, email, password_hash, address, phone) VALUES
('Amara Muhire', 'amara@example.com', '$2b$10$examplehashedpassword1', 'Kigali, Rwanda', '+250788123456'),
('Jean Ikirezi', 'jean@example.com', '$2b$10$examplehashedpassword2', 'Huye, Rwanda', '+250789234567'),
('Grace Uwamahoro', 'grace@example.com', '$2b$10$examplehashedpassword3', 'Gitarama, Rwanda', '+250790345678');

INSERT IGNORE INTO orders (user_id, total_amount, status, shipping_address) VALUES
(1, 88000, 'confirmed', 'KN 3 Ave, Kigali, Rwanda'),
(2, 47000, 'pending', 'City Centre, Huye, Rwanda'),
(3, 63000, 'shipped', 'Main Street, Gitarama, Rwanda');

INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 35000),
(1, 3, 3, 18000),
(2, 5, 2, 12000),
(2, 6, 1, 28000),
(3, 2, 1, 55000),
(3, 4, 1, 42000);