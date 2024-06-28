import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static('dist/public'))

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
  });

app.post('/create-json', (req: Request, res: Response) => {
    res.json({ message: 'Hello, world!' });
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
