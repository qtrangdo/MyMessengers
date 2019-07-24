const app = require('../backend/app');
const port = process.env.port || 3000;

app.get('/', (req, res) => res.send('Testing'))

app.listen(port, () => console.log(`app is running on ${port}`))