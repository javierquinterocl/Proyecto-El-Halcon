require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 4000;

//  CORS 
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

//  Parse JSON
app.use(express.json());

// PostgreSQL pool
const pool = new Pool();

// --- CRUD ENDPOINTS FOR PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pawn.products ORDER BY product_id');
    res.json(rows);
  } catch (err) {
    console.error('Error GET /api/products:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Create a new product
app.post('/api/products', async (req, res) => {
  const { product_id, product_name, stock, brand, status, image, jewelry_id, non_jewelry_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO pawn.products (product_id, product_name, stock, brand, status, image, jewelry_id, non_jewelry_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [product_id, product_name, stock, brand, status, image, jewelry_id, non_jewelry_id]
    );
    res.status(201).json({ message: 'Producto creado' });
  } catch (err) {
    console.error('Error POST /api/products:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  const { product_name, stock, brand, status, image, jewelry_id, non_jewelry_id } = req.body;
  try {
    await pool.query(
      `UPDATE pawn.products SET product_name=$1, stock=$2, brand=$3, status=$4, image=$5, jewelry_id=$6, non_jewelry_id=$7
       WHERE product_id=$8`,
      [product_name, stock, brand, status, image, jewelry_id, non_jewelry_id, id]
    );
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    console.error('Error PUT /api/products/:id:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(
        'SELECT * FROM pawn.products WHERE product_id = $1',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error GET /api/products/:id', err);
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  });


//BORRAR UN SOLO PRODUCTO 
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'DELETE FROM pawn.products WHERE product_id = $1 RETURNING *',
        [id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json({ message: 'Producto eliminado' });
    } catch (err) {
      console.error('Error DELETE /api/products/:id', err);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  });

// --- CRUD CUSTOMERS ---
app.get('/api/customers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pawn.customers ORDER BY customer_id');
    res.json(rows);
  } catch (err) {
    console.error('Error GET /api/customers:', err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

app.post('/api/customers', async (req, res) => {
  const { first_name, middle_name, last_name, address, phone, email, country_id, department_id, city_id, document_id } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO pawn.customers (first_name, middle_name, last_name, address, phone, email, country_id, department_id, city_id, document_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING customer_id`,
      [first_name, middle_name, last_name, address, phone, email, country_id, department_id, city_id, document_id]
    );
    res.status(201).json({ message: 'Cliente creado', customer_id: rows[0].customer_id });
  } catch (err) {
    console.error('Error POST /api/customers:', err);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  const id = req.params.id;
  const { first_name, middle_name, last_name, address, phone, email, country_id, department_id, city_id, document_id } = req.body;
  try {
    await pool.query(
      `UPDATE pawn.customers SET first_name=$1, middle_name=$2, last_name=$3, address=$4, phone=$5, email=$6,
       country_id=$7, department_id=$8, city_id=$9, document_id=$10 WHERE customer_id=$11`,
      [first_name, middle_name, last_name, address, phone, email, country_id, department_id, city_id, document_id, id]
    );
    res.json({ message: 'Cliente actualizado' });
  } catch (err) {
    console.error('Error PUT /api/customers/:id:', err);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM pawn.customers WHERE customer_id=$1', [id]);
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    console.error('Error DELETE /api/customers/:id:', err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

// --- CRUD PROVIDERS ---
app.get('/api/providers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pawn.providers ORDER BY provider_id');
    res.json(rows);
  } catch (err) {
    console.error('Error GET /api/providers:', err);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

app.post('/api/providers', async (req, res) => {
  const { provider_id, first_name, middle_name, last_name, phone, email, address, country_id, department_id, city_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO pawn.providers (provider_id, first_name, middle_name, last_name, phone, email, address, country_id, department_id, city_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [provider_id, first_name, middle_name, last_name, phone, email, address, country_id, department_id, city_id]
    );
    res.status(201).json({ message: 'Proveedor creado' });
  } catch (err) {
    console.error('Error POST /api/providers:', err);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

app.put('/api/providers/:id', async (req, res) => {
  const id = req.params.id;
  const { first_name, middle_name, last_name, phone, email, address, country_id, department_id, city_id } = req.body;
  try {
    await pool.query(
      `UPDATE pawn.providers SET first_name=$1, middle_name=$2, last_name=$3, phone=$4, email=$5, address=$6,
       country_id=$7, department_id=$8, city_id=$9 WHERE provider_id=$10`,
      [first_name, middle_name, last_name, phone, email, address, country_id, department_id, city_id, id]
    );
    res.json({ message: 'Proveedor actualizado' });
  } catch (err) {
    console.error('Error PUT /api/providers/:id:', err);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

app.delete('/api/providers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM pawn.providers WHERE provider_id=$1', [id]);
    res.json({ message: 'Proveedor eliminado' });
  } catch (err) {
    console.error('Error DELETE /api/providers/:id:', err);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});


// cliente por id
app.get('/api/customers/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(
        'SELECT * FROM pawn.customers WHERE customer_id = $1',
        [id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      console.error('Error GET /api/customers/:id', err);
      res.status(500).json({ error: 'Error al obtener cliente' });
    }
  });
  
  //  proveedor por id
  app.get('/api/providers/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(
        'SELECT * FROM pawn.providers WHERE provider_id = $1',
        [id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      console.error('Error GET /api/providers/:id', err);
      res.status(500).json({ error: 'Error al obtener proveedor' });
    }
  });

// Start server
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
