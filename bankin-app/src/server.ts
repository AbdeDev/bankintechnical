import express from 'express';
import { authenticate, fetchAccounts } from './services/authService';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const authResponse = await authenticate({ username, password });
        const accountsResponse = await fetchAccounts(authResponse.access_token);
        res.json({
            token: authResponse.access_token,
            accounts: accountsResponse.accounts
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});