const pool = require('../models/db');

const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, email, address, phone, items, total_amount } = req.body;

    await connection.beginTransaction();

    let [userResult] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    let userId;
    if (userResult.length === 0) {
      const [insertUserResult] = await connection.query(
        'INSERT INTO users (name, email, address, phone) VALUES (?, ?, ?, ?)',
        [name, email, address, phone]
      );
      userId = insertUserResult.insertId;
    } else {
      userId = userResult[0].id;
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, payment_method, payment_status) VALUES (?, ?, ?, ?)',
      [userId, total_amount, req.body.payment_method || 'MTN_MOMO', req.body.payment_status || 'pending']
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await connection.commit();

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orderRows] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email, u.address, u.phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [itemsRows] = await pool.query(
      `SELECT oi.*, p.name as product_name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    const order = orderRows[0];
    order.items = itemsRows;

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createOrder, getOrderById };