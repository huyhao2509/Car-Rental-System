const express = require('express');
const router = express.Router();
const XeRouterController = require('../controllers/XeRouterController');
// const { verifyToken, checkPermission } = require('../middlewares/auth');
router.get('/get-all', XeRouterController.getAll.bind(XeRouterController));
router.get('/detail/:id', XeRouterController.getDetail.bind(XeRouterController));
// Route công khai - không cần đăng nhập

// Route yêu cầu đăng nhập và phân quyền
// router.use(verifyToken);
router.get('/get-all', XeRouterController.getAll.bind(XeRouterController));
router.post('/create', XeRouterController.create.bind(XeRouterController));
router.post('/update', XeRouterController.update.bind(XeRouterController));
router.delete('/delete/:id', XeRouterController.delete.bind(XeRouterController));



module.exports = router;