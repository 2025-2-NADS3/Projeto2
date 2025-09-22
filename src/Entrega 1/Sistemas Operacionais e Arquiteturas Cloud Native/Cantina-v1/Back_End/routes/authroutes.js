import express from 'express'
import db from '../db.js'
// import fs from 'fs'
// import path from 'path'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const router = express.Router()

/*************************
      crud de login
*************************/

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Validação básica
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            error: 'Email e senha são obrigatórios' 
        });
    }

    try {
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Email não encontrado'
            });
        }
        
        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Senha incorreta'
            });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno no servidor'
        });
    }
});


/*************************
     crud de cadastro
*************************/

router.post('/register', async (req, res) => {
    try {
        const {name, email, phone, birthdate, cpf, password} = req.body;

        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            "INSERT INTO users (name, email, phone, birthdate, cpf, password) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, phone, birthdate, cpf, hashedPassword]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            message: 'Usuário cadastrado com sucesso!'
        });
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const [users] = await db.execute("SELECT * FROM users");
        res.status(200).json(users);
    } catch (error) {
        console.error("Erros ao buscar item: ", error)
        res.status(500).json({ error: error.message });
    }
});

//Middleware
function authMiddleware(req,res,next){
    const auth = req.headers.authorization
    if(!auth) return res.status(401).send('Token Ausente.')
    const token = auth.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch{
        res.status(403).send('Token Inválido ou Expirado')
    }
}
//Rota Privada
router.get('/private', authMiddleware, (req, res) => {
    res.json({message: `Bem vindo, ${req.user.username}`})
})

export default router;