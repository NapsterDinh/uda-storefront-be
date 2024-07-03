CREATE TABLE orderProducts (
    orderId INTEGER NOT NULL REFERENCES orders (id),
    productId INTEGER NOT NULL REFERENCES products (id),
    quantity INTEGER NOT NULL
);