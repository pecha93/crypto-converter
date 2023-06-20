CREATE TABLE orders (
  id INT PRIMARY KEY,
  item VARCHAR(255),
  currency VARCHAR(3),
  amount DECIMAL(10, 2),
  certificateAmount DECIMAL(10, 2),
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255),
  FOREIGN KEY (item) REFERENCES product(item),
  FOREIGN KEY (currency) REFERENCES product(currency)
);