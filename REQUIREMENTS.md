# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index `'/api/products' [GET]`
- Show `'/api/products/:id' [GET]`
- Create (args: Product)[token required] `'/api/products' [POST]`
- [NEW] Delete [token required] `'/api/products/:id'  [DELETE]`

#### Users

- Index [token required]: `'/api/users' [GET]`
- Show [token required]: `'/api/users/:id' [GET]`
- [NEW] Delete [token required]: `'/api/users/:id' [DELETE]`
- Create (args: User): `'/api/users/register' [POST]`
- [NEW] Login `'/api/users/login' [POST]`

#### Orders

- Index [token required]: `'/api/orders' [GET]`
- Current Order by user [token required]: `'/api/orders/user/:id' [GET]`
- [NEW] Create order [token required]: `'/api/orders/:id [DELETE]`
- [NEW] Delete order [token required]: `'/api/orders [POST]`
- [NEW] Update order [token required]: `'/api/orders/:id [DELETE]`

## Data Shapes

#### Product

- id
- name
- price

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    price INTEGER NOT NULL
);
```

#### User

- id
- username
- password
- fullName
- phoneNumber
- email

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders

- id of each product in the order
- quantity of each product in the order
- userId

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES users (id),
);
```

#### order_products

- orderId
- productId
- quantity

```sql
CREATE TABLE orderProducts (
    orderId INTEGER NOT NULL REFERENCES orders (id),
    productId INTEGER NOT NULL REFERENCES products (id),
    quantity INTEGER NOT NULL
);
```
