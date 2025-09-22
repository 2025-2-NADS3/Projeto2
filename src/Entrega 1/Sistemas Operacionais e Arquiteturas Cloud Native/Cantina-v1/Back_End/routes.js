import express from 'express'
import db from './db.js'
import authRouts from './routes/authroutes.js'

const router = express.Router()

router.use(authRouts)

/*************************
      Rota de produtos
*************************/

router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.execute("SELECT * FROM categories ORDER BY name ASC");
        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
});

router.post('/categories', async (req, res) => {
    try {
        const { name, icon } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
        }
        const [existing] = await db.execute('SELECT * FROM categories WHERE name = ?', [name]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Categoria já existe.' });
        }
        const [result] = await db.execute(
            "INSERT INTO categories (name, icon) VALUES (?, ?)",
            [name, icon || '📁']
        );
        res.status(201).json({ id: result.insertId, message: 'Categoria adicionada com sucesso!' });
    } catch (error) {
        console.error("Erro ao adicionar categoria:", error);
        res.status(500).json({ error: 'Erro interno ao adicionar categoria.' });
    }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
        }
        const [result] = await db.execute(
            "UPDATE categories SET name = ?, icon = ? WHERE id = ?",
            [name, icon || '📁', id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoria não encontrada.' });
        res.status(200).json({ message: 'Categoria atualizada com sucesso!' });
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        res.status(500).json({ error: 'Erro interno ao atualizar categoria.' });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [products] = await db.execute("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [id]);
        if (products[0].count > 0) {
            return res.status(400).json({ error: 'Não é possível remover. Categoria está em uso por produtos.' });
        }

        const [result] = await db.execute("DELETE FROM categories WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoria não encontrada.' });
        res.status(200).json({ message: 'Categoria removida com sucesso!' });
    } catch (error) {
        console.error("Erro ao remover categoria:", error);
        res.status(500).json({ error: 'Erro interno ao remover categoria.' });
    }
});

router.get('/products', async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.name ASC
        `;
        const [products] = await db.execute(query);
        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
});

router.post('/products', async (req, res) => {
    try {
        const { name, price, image, category_id } = req.body;
        if (!name || !price || !category_id) {
            return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios.' });
        }

        const [result] = await db.execute(
            "INSERT INTO products (name, price, image, category_id) VALUES (?, ?, ?, ?)",
            [name, price, image || '📦', category_id]
        );

        res.status(201).json({ id: result.insertId, message: 'Produto adicionado com sucesso!' });
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        res.status(500).json({ error: 'Erro interno ao adicionar produto.' });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, image, category_id } = req.body;

        if (!name || !price || !category_id) {
            return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios.' });
        }

        const [result] = await db.execute(
            "UPDATE products SET name = ?, price = ?, image = ?, category_id = ? WHERE id = ?",
            [name, price, image || '📦', category_id, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.status(200).json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ error: 'Erro interno ao atualizar produto.' });
    }
});


router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute("DELETE FROM products WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.status(200).json({ message: 'Produto removido com sucesso!' });
    } catch (error) {
        console.error("Erro ao remover produto:", error);
        res.status(500).json({ error: 'Erro interno ao remover produto.' });
    }
});

export default router;