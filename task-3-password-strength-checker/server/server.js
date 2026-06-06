import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passwordRoutes from './routes/passwordRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', passwordRoutes);

app.get('/', (req, res) => {
  res.send('Password Strength Checker API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
