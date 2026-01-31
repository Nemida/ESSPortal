const bcrypt = require('bcryptjs');

const password = 'password'; 
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Your new password hash is:');
console.log(hash);