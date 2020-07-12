const express = require('express');
const path = require('path');

const DbConnect = require('./config/config');
const userApi = require('./routes/user');
const authApi = require('./routes/auth');
const propertyApi = require('./routes/property');

const app = express();

app.use(express.json());

DbConnect();

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

//Routes
app.use('/api/auth', authApi);
app.use('/api/user', userApi);
app.use('/api/property', propertyApi);

//Sever Static  Content

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server in listing at ${PORT}`));
