CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES users (id),
);