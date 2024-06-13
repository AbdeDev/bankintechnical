import express from 'express';
import bodyParser from 'body-parser';
import { authenticate, fetchAccounts } from './services/authService';

const app = express();
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const authResponse = await authenticate({ username, password });
        const accountsResponse = await fetchAccounts(authResponse.access_token, username);
        res.json({
            token: authResponse.access_token,
            accounts: accountsResponse.accounts
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
