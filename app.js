const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');
const connectDB = require('./config/db');
const userRouter = require('./routes/authRoutes');
const bookRouter = require('./routes/bookRoutes');
const borrowRouter = require('./routes/borrowRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { setupGraphQL } = require('./graphql/apolloServer');

dotenv.config();

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth',userRouter);
app.use('/api/books',bookRouter);
app.use('/api/borrow',borrowRouter);
app.use('/api/reports',reportRoutes);

// Setup GraphQL with Apollo Server
setupGraphQL(app);

app.get('/',(req,res)=>res.send("Nalanda Library Backend Running"));

module.exports = app