const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
router.use(express.json());

const dataPath = path.join(__dirname, '../../data.json');

const readData = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { users: [] };
    }
};

const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

router.post('/login', (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }

        console.log('Request body:', req.body);

        const { email, password } = req.body;

        const data = readData();

        const user = data.users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { email: user.email, name: user.name }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
});

router.post('/signup', (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }
        console.log('Request body:', req.body);

        const { email, password, name } = req.body;


        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const data = readData();

        if (!data.users) {
            data.users = [];
        }

        if (data.users.some(u => u.email === email)) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const newUser = { email, password, name };
        data.users.push(newUser);
        writeData(data);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { email, name }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Signup failed",
            error: error.message
        });
    }
});

module.exports = router;