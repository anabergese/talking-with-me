import express from 'express';
import audioRoutes from './routes/audioRoutes.js';
import indexRoutes from './routes/indexRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(express.static('src/public'));

app.use('/', indexRoutes);
app.use('/', audioRoutes);

app.listen(PORT, () => {
  console.log(`API RUNNING ON PORT ${PORT}`);
});
