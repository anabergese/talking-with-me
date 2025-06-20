import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index.ejs');
});

router.get('/hello', (req, res) => res.send('Hello World!'));

export default router;
