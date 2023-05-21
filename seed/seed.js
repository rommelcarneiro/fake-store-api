// carrrega os dados no banco de dados a partir dos arquivos json

const Product = require('../model/product');
const User = require('../model/user');
const mongoose = require('mongoose');
const fs = require('fs');

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
    try {
        await Product.create(products);
        await User.create(users, { validateBeforeSave: false });
        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

const deleteData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// node seed -i
if (process.argv[2] === '-i') {
    importData();
}
// node seed -d
else if (process.argv[2] === '-d') {
    deleteData();
}



