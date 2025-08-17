// // const express = require('express');
// // const router = express.Router();
// // const { createUser, getUsers, login } = require('../controllers/user.controller');
// // const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// // router.post('/auth/login', login);
// // router.post('/users', authenticateToken, requireRole('admin'), createUser);
// // router.get('/users', authenticateToken, requireRole('admin'), getUsers);

// // module.exports = router;
// // 📁 src/routes/user.routes.js
// const express = require('express');
// const router = express.Router();
// const { createUser, getUsers, updateUser ,deleteUser} = require('../controllers/user.controller');
// const { login } = require('../controllers/loginController');
// //const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// // ❗️ NO /users prefix here!
// router.post('/', createUser);        
// router.get('/', getUsers);           
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser)

// module.exports = router;


// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, requireRole('admin'), createUser);        
router.get('/', authenticateToken, requireRole('admin'), getUsers);           
router.put('/:id', authenticateToken, requireRole('admin'), updateUser);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteUser);

module.exports = router;