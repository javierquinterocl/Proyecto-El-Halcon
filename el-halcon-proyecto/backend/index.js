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

//empleados
app.get('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(
        'SELECT * FROM pawn.employees WHERE employee_id = $1',
        [id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      console.error('Error GET /api/employees/:id', err);
      res.status(500).json({ error: 'Error al obtener proveedor' });
    }
  });


app.get('/api/employees', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pawn.employees ORDER BY employee_id');
    res.json(rows);
  } catch (err) {
    console.error('Error GET /api/employees:', err);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM pawn.employees WHERE employee_id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error GET /api/employees/:id', err);
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
});

app.post('/api/employees', async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    phone,
    email,
    address,
    salary,
    experience_years,
    expertise_level,
    speciality,
    certification,
    emp_type,
    mgr_id
  } = req.body;

  const parsedMgrId = mgr_id ? parseInt(mgr_id) : null;

  try {
    const { rows } = await pool.query(
      `INSERT INTO pawn.employees (
        first_name, middle_name, last_name, phone, email, address,
        salary, experience_years, expertise_level,
        speciality, certification, emp_type, mgr_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING employee_id`,
      [
        first_name, middle_name, last_name, phone, email, address,
        salary, experience_years, expertise_level,
        speciality, certification, emp_type, parsedMgrId
      ]
    );
    res.status(201).json({ message: 'Empleado creado', employee_id: rows[0].employee_id });
  } catch (err) {
    console.error('Error POST /api/employees:', err);
    res.status(500).json({ error: 'Error al crear empleado' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  const id = req.params.id;
  const {
    first_name,
    middle_name,
    last_name,
    phone,
    email,
    address,
    speciality,
    certification,
    emp_type,
    mgr_id
  } = req.body;

  const parsedMgrId = mgr_id ? parseInt(mgr_id) : null;

  try {
    await pool.query(
      `UPDATE pawn.employees SET 
        first_name=$1, middle_name=$2, last_name=$3, phone=$4, email=$5,
        address=$6, speciality=$7, certification=$8, emp_type=$9, mgr_id=$10
      WHERE employee_id=$11`,
      [first_name, middle_name, last_name, phone, email, address, speciality, certification, emp_type, parsedMgrId, id]
    );
    res.json({ message: 'Empleado actualizado' });
  } catch (err) {
    console.error('Error PUT /api/employees/:id:', err);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM pawn.employees WHERE employee_id = $1', [id]);
    res.json({ message: 'Empleado eliminado' });
  } catch (err) {
    console.error('Error DELETE /api/employees/:id:', err);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

//sales 
app.get('/api/sales', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM pawn.detail_sales
      ORDER BY invoice_sale_id, line_item_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error GET /api/sales:", err);
    res.status(500).json({ error: "Error al obtener ítems de venta" });
  }
});

app.get('/api/sales/:invoiceId', async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM pawn.detail_sales WHERE invoice_sale_id = $1 ORDER BY line_item_id`,
      [invoiceId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error GET /api/sales/:invoiceId:', err);
    res.status(500).json({ error: 'Error al obtener los ítems de la venta' });
  }
});

app.post('/api/sales', async (req, res) => {
  const items = req.body;
  const client = await pool.connect();

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Se requiere al menos un ítem de venta.' });
  }

  try {
    await client.query('BEGIN');

    for (const item of items) {
      await client.query(
        `INSERT INTO pawn.detail_sales
         (line_item_id, quantity, price, sub_total, product_id, invoice_sale_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          item.line_item_id,
          item.quantity,
          item.price,
          item.sub_total,
          item.product_id,
          item.invoice_sale_id
        ]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Ítems de venta agregados correctamente.' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error POST /api/sales:', err);
    res.status(500).json({ error: 'Error al agregar ítems a la venta' });

  } finally {
    client.release();
  }
});


//sales factura

app.get('/api/saleinvoices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pawn.invoice_sales ORDER BY date DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('Error GET /api/saleinvoices:', err)
    res.status(500).json({ error: 'Error al obtener facturas de ventas' })
  }
})


app.post('/api/saleinvoices', async (req, res) => {
  const { date, total, comment_sales, provider_id, payment_id, employee_id } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO pawn.invoice_sales (date, total, comment_sales, provider_id, payment_id, employee_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [date, total, comment_sales, provider_id, payment_id, employee_id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error POST /api/saleinvoices:', err)
    res.status(500).json({ error: 'Error al crear la factura de venta' })
  }
})


app.delete('/api/saleinvoices/:id', async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM pawn.invoice_sales WHERE invoice_sale_id = $1', [id])
    res.json({ message: 'Factura eliminada correctamente' })
  } catch (err) {
    console.error('Error DELETE /api/saleinvoices:', err)
    res.status(500).json({ error: 'Error al eliminar la factura de venta' })
  }
})


//purchases factura 

app.get('/api/purchaseinvoices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pawn.invoice_purchases ORDER BY date DESC')
    res.json(result.rows)
  } catch (err) {
    console.error("Error GET /api/purchaseinvoices:", err)
    res.status(500).json({ error: "Error al obtener facturas de compra" })
  }
})


app.post('/api/purchaseinvoices', async (req, res) => {
  const { date, total, comment_purchases, customer_id, payment_id, employee_id } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO pawn.invoice_purchases 
        (date, total, comment_purchases, customer_id, payment_id, employee_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [date, total, comment_purchases, customer_id, payment_id, employee_id]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error POST /api/purchaseinvoices:', err)
    res.status(500).json({ error: 'Error al crear la factura de compra' })
  }
})


app.get('/api/purchaseinvoices/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM pawn.invoice_purchases WHERE invoice_purchase_id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error GET /api/purchaseinvoices/:id:', err)
    res.status(500).json({ error: 'Error al obtener la factura' })
  }
})


app.put('/api/purchaseinvoices/:id', async (req, res) => {
  const { id } = req.params
  const { date, total, comment_purchases, customer_id, payment_id, employee_id } = req.body

  try {
    const result = await pool.query(
      `UPDATE pawn.invoice_purchases
       SET date = $1, total = $2, comment_purchases = $3, customer_id = $4, payment_id = $5, employee_id = $6
       WHERE invoice_purchase_id = $7
       RETURNING *`,
      [date, total, comment_purchases, customer_id, payment_id, employee_id, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error PUT /api/purchaseinvoices/:id:', err)
    res.status(500).json({ error: 'Error al actualizar la factura' })
  }
})


app.delete('/api/purchaseinvoices/:id', async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM pawn.invoice_purchases WHERE invoice_purchase_id = $1', [id])
    res.json({ message: 'Factura de compra eliminada correctamente' })
  } catch (err) {
    console.error('Error DELETE /api/purchaseinvoices/:id:', err)
    res.status(500).json({ error: 'Error al eliminar la factura' })
  }
})

//purchaases 
app.get('/api/purchases', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM pawn.detail_purchases
      ORDER BY invoice_purchase_id, line_item_id
    `)
    res.json(result.rows)
  } catch (err) {
    console.error("Error GET /api/purchases:", err)
    res.status(500).json({ error: "Error al obtener ítems de compra" })
  }
})


app.post('/api/purchases', async (req, res) => {
  const items = req.body;
  const client = await pool.connect();

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Se requieren ítems para registrar compra.' });
  }

  try {
    await client.query('BEGIN');

    for (const item of items) {
      await client.query(
        `INSERT INTO pawn.detail_purchases 
         (invoice_purchase_id, line_item_id, quantity, price, sub_total, product_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          item.invoice_purchase_id,
          item.line_item_id,
          item.quantity,
          item.price,
          item.sub_total,
          item.product_id
        ]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Ítems de compra registrados correctamente.' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error POST /api/purchases:', err);
    res.status(500).json({ error: 'Error al registrar los ítems de compra' });
  } finally {
    client.release();
  }
});

//pawn
app.get('/api/pawns', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.pawn_id,
        p.pawn_date,
        p.return_date,
        p.expiration_date,
        p.fee_rate,
        p.total_amount,
        p.status,
        c.customer_id,
        c.first_name || ' ' || c.last_name AS customer_name,
        e.employee_id,
        e.first_name || ' ' || e.last_name AS employee_name
      FROM pawn.pawns p
      JOIN pawn.customers c ON p.ctr_id = c.customer_id
      JOIN pawn.employees e ON p.epe_id = e.employee_id
      ORDER BY p.pawn_date DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error("Error en GET /api/pawns:", err.message)
    res.status(500).json({
      error: "No se pudieron obtener los empeños",
      detail: err.message,
    })
  }
})


app.post('/api/pawns', async (req, res) => {
  const {
    pawn_date,
    return_date,
    expiration_date,
    fee_rate,
    total_amount,
    status,
    epe_id,
    ctr_id
  } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO pawn.pawns
        (pawn_date, return_date, expiration_date, fee_rate, total_amount, status, epe_id, ctr_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [pawn_date, return_date, expiration_date, fee_rate, total_amount, status, epe_id, ctr_id]
    )

    res.status(201).json({ message: "Empeño guardado correctamente", data: result.rows[0] })
  } catch (err) {
    console.error("Error POST /api/pawns:", err)
    res.status(500).json({ error: "No se pudo guardar el empeño" })
  }
})

// GET individual sale invoice
app.get('/api/saleinvoices/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM pawn.invoice_sales WHERE invoice_sale_id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura de venta no encontrada" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error GET /api/saleinvoices/:id:', err)
    res.status(500).json({ error: 'Error al obtener la factura de venta' })
  }
})

// PUT sale invoice
app.put('/api/saleinvoices/:id', async (req, res) => {
  const { id } = req.params
  const { date, total, comment_sales, provider_id, payment_id, employee_id } = req.body

  try {
    const result = await pool.query(
      `UPDATE pawn.invoice_sales
       SET date = $1, total = $2, comment_sales = $3, provider_id = $4, payment_id = $5, employee_id = $6
       WHERE invoice_sale_id = $7
       RETURNING *`,
      [date, total, comment_sales, provider_id, payment_id, employee_id, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura de venta no encontrada" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error PUT /api/saleinvoices/:id:', err)
    res.status(500).json({ error: 'Error al actualizar la factura de venta' })
  }
})

// GET individual sale detail by composite key
app.get('/api/sales/detail/:invoiceId/:lineItemId', async (req, res) => {
  const { invoiceId, lineItemId } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM pawn.detail_sales WHERE invoice_sale_id = $1 AND line_item_id = $2',
      [invoiceId, lineItemId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Detalle de venta no encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error GET /api/sales/detail/:invoiceId/:lineItemId:', err)
    res.status(500).json({ error: 'Error al obtener el detalle de venta' })
  }
})

// PUT sale detail by composite key
app.put('/api/sales/detail/:invoiceId/:lineItemId', async (req, res) => {
  const { invoiceId, lineItemId } = req.params
  const { quantity, price, sub_total, product_id, invoice_sale_id } = req.body

  try {
    const result = await pool.query(
      `UPDATE pawn.detail_sales
       SET quantity = $1, price = $2, sub_total = $3, product_id = $4, invoice_sale_id = $5
       WHERE invoice_sale_id = $6 AND line_item_id = $7
       RETURNING *`,
      [quantity, price, sub_total, product_id, invoice_sale_id, invoiceId, lineItemId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Detalle de venta no encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error PUT /api/sales/detail/:invoiceId/:lineItemId:', err)
    res.status(500).json({ error: 'Error al actualizar el detalle de venta' })
  }
})

// GET individual purchase detail by composite key
app.get('/api/purchases/detail/:invoiceId/:lineItemId', async (req, res) => {
  const { invoiceId, lineItemId } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM pawn.detail_purchases WHERE invoice_purchase_id = $1 AND line_item_id = $2',
      [invoiceId, lineItemId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Detalle de compra no encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error GET /api/purchases/detail/:invoiceId/:lineItemId:', err)
    res.status(500).json({ error: 'Error al obtener el detalle de compra' })
  }
})

// PUT purchase detail by composite key
app.put('/api/purchases/detail/:invoiceId/:lineItemId', async (req, res) => {
  const { invoiceId, lineItemId } = req.params
  const { quantity, price, sub_total, product_id, invoice_purchase_id } = req.body

  try {
    const result = await pool.query(
      `UPDATE pawn.detail_purchases
       SET quantity = $1, price = $2, sub_total = $3, product_id = $4, invoice_purchase_id = $5
       WHERE invoice_purchase_id = $6 AND line_item_id = $7
       RETURNING *`,
      [quantity, price, sub_total, product_id, invoice_purchase_id, invoiceId, lineItemId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Detalle de compra no encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error PUT /api/purchases/detail/:invoiceId/:lineItemId:', err)
    res.status(500).json({ error: 'Error al actualizar el detalle de compra' })
  }
})

// DELETE sale detail by composite key
app.delete('/api/sales/detail/:invoiceId/:lineItemId', async (req, res) => {
  const { invoiceId, lineItemId } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM pawn.detail_sales WHERE invoice_sale_id = $1 AND line_item_id = $2 RETURNING *',
      [invoiceId, lineItemId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Detalle de venta no encontrado" })
    }

    res.json({ message: "Detalle de venta eliminado exitosamente" })
  } catch (err) {
    console.error('Error DELETE /api/sales/detail/:invoiceId/:lineItemId:', err)
    res.status(500).json({ error: 'Error al eliminar el detalle de venta' })
  }
})

// DELETE purchase detail by composite key
app.delete('/api/purchases/detail/:invoiceId/:lineItemId', async (req, res) => {
  const { invoiceId, lineItemId } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM pawn.detail_purchases WHERE invoice_purchase_id = $1 AND line_item_id = $2 RETURNING *',
      [invoiceId, lineItemId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Detalle de compra no encontrado" })
    }

    res.json({ message: "Detalle de compra eliminado exitosamente" })
  } catch (err) {
    console.error('Error DELETE /api/purchases/detail/:invoiceId/:lineItemId:', err)
    res.status(500).json({ error: 'Error al eliminar el detalle de compra' })
  }
})

// GET individual pawn
app.get('/api/pawns/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM pawn.pawns WHERE pawn_id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Empeño no encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error GET /api/pawns/:id:', err)
    res.status(500).json({ error: 'Error al obtener el empeño' })
  }
})

// PUT pawn
app.put('/api/pawns/:id', async (req, res) => {
  const { id } = req.params
  const { pawn_date, return_date, expiration_date, fee_rate, total_amount, status, epe_id, ctr_id } = req.body

  try {
    const result = await pool.query(
      `UPDATE pawn.pawns
       SET pawn_date = $1, return_date = $2, expiration_date = $3, fee_rate = $4, 
           total_amount = $5, status = $6, epe_id = $7, ctr_id = $8
       WHERE pawn_id = $9
       RETURNING *`,
      [pawn_date, return_date, expiration_date, fee_rate, total_amount, status, epe_id, ctr_id, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Empeño no encontrado" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error PUT /api/pawns/:id:', err)
    res.status(500).json({ error: 'Error al actualizar el empeño' })
  }
})

// DELETE pawn
app.delete('/api/pawns/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM pawn.pawns WHERE pawn_id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Empeño no encontrado" })
    }

    res.json({ message: "Empeño eliminado exitosamente" })
  } catch (err) {
    console.error('Error DELETE /api/pawns/:id:', err)
    res.status(500).json({ error: 'Error al eliminar el empeño' })
  }
})

// Start server
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
