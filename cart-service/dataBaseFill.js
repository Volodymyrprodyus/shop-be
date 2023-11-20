/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require('pg');
require('dotenv').config();
const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const users = [
  { id: '0b846046-2081-40b7-8365-bf273c17b32e', name: 'User1', password: 'password1', email: 'user1@email.com' }, // Basic VXNlcjE6cGFzc3dvcmQx
  { id: '1c3567be-1406-4fd9-ab02-f100df60c73d', name: 'User2', password: 'password2', email: 'user2@email.com' }, // Basic VXNlcjI6cGFzc3dvcmQy
];

const products = [
  '509182b7-f92f-482a-ac68-d2ff629c84de',
  'd7808ff9-1734-46de-99c7-748e590a00af',
  'b856d0c2-4b7f-425a-8968-3e925cf98164',
  '48c9102b-d5c2-4da7-b789-1fc56516095d',
  '134a4ecb-4df3-445d-9169-8b3880bc360c',
  '5cf83aa7-a20f-4584-8d6b-ba11c620ecc2',
  '515c0d05-55d9-4da5-98c7-8333b3b0d774',
  '317a0346-a988-4bf4-a8f9-3c20d11dc0a4',
  '506c0e52-27f4-409a-be79-073f4d3d627b',
  '506c0e52-27f4-409a-be79-143f4d3d627b',
];

const carts = [
  {
    id: '5c775110-be38-48a5-a302-eed57c2e1ac6',
    user_id: users[0].id,
    created_at: '2023-11-02',
    updated_at: '2023-11-02',
    status: 'ORDERED',
  },
  {
    id: '93d9f74a-7bc9-4892-b9a3-a6a51a507e60',
    user_id: users[0].id,
    created_at: '2023-11-02',
    updated_at: '2023-11-02',
    status: 'OPEN',
  },
  {
    id: 'bc379c81-9b51-4a87-88cb-266a9766e0ba',
    user_id: users[1].id,
    created_at: '2023-11-02',
    updated_at: '2023-11-02',
    status: 'ORDERED',
  },
  {
    id: '2fec4468-7f7b-4a30-86e3-62dd36041c8e',
    user_id: users[1].id,
    created_at: '2023-11-02',
    updated_at: '2023-11-02',
    status: 'OPEN',
  },
];

const cartItems = [
  { cart_id: carts[0].id, product_id: products[0], count: 1 },
  { cart_id: carts[0].id, product_id: products[1], count: 1 },
  { cart_id: carts[1].id, product_id: products[2], count: 1 },
  { cart_id: carts[1].id, product_id: products[3], count: 1 },
  { cart_id: carts[1].id, product_id: products[4], count: 1 },
  { cart_id: carts[2].id, product_id: products[5], count: 1 },
  { cart_id: carts[2].id, product_id: products[6], count: 1 },
  { cart_id: carts[3].id, product_id: products[7], count: 1 },
  { cart_id: carts[3].id, product_id: products[8], count: 1 },
  { cart_id: carts[3].id, product_id: products[9], count: 1 },
];

const getInsertQuery = (table, values, data) =>
  `insert into ${table} (${values.join(', ')}) values
${data.map(item => `(${values.map(value => `'${item[value]}'`).join(', ')})`).join(',\n')};
`;

(async () => {
  const dbClient = new Client({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  await dbClient.connect();
  await dbClient.query(getInsertQuery('users', ['id', 'name', 'password', 'email'], users));
  await dbClient.query(getInsertQuery('carts', ['id', 'user_id', 'created_at', 'updated_at', 'status'], carts));
  await dbClient.query(getInsertQuery('cart_items', ['cart_id', 'product_id', 'count'], cartItems));

  process.exit();
})();
