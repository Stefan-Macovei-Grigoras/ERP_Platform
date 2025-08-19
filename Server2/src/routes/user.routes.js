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
const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, authorizeRole(['admin']), createUser);        
router.get('/', authenticateToken, authorizeRole(['admin']), getUsers);           
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateUser);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteUser);

module.exports = router;