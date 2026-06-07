const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

app.post('/save-log', (req, res) => {
  const { logs } = req.body;
  
  if (!logs) {
    return res.status(400).json({ error: 'No logs provided' });
  }

  const logFilePath = path.join(logsDir, 'user_logs.txt');
  
  // Format log entry
  const timestamp = new Date().toISOString();
  const logEntry = `\n--- Log Session: ${timestamp} ---\n${logs}\n--------------------------------------\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error saving log:', err);
      return res.status(500).json({ error: 'Failed to save log' });
    }
    
    res.status(200).json({ message: 'Log saved successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
