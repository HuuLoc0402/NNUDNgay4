var express = require('express');
var router = express.Router();
var { dataRole, dataUser } = require('../utils/data2');

// GET all users
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    message: 'Lấy danh sách tất cả users',
    data: dataUser,
    total: dataUser.length
  });
});

// GET user by username
router.get('/:username', function(req, res, next) {
  const username = req.params.username;
  const user = dataUser.find(u => u.username === username);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User không tìm thấy'
    });
  }
  
  res.json({
    success: true,
    message: 'Lấy thông tin user thành công',
    data: user
  });
});

// POST create new user
router.post('/', function(req, res, next) {
  const { username, password, email, fullName, avatarUrl, status, roleId } = req.body;
  
  // Validation
  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: 'Username, password, và email là bắt buộc'
    });
  }
  
  // Check if username already exists
  if (dataUser.find(u => u.username === username)) {
    return res.status(400).json({
      success: false,
      message: 'Username đã tồn tại'
    });
  }
  
  // Get role information
  let role = dataRole.find(r => r.id === (roleId || 'r3'));
  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Role không tìm thấy'
    });
  }
  
  const now = new Date().toISOString();
  
  const newUser = {
    username: username,
    password: password,
    email: email,
    fullName: fullName || '',
    avatarUrl: avatarUrl || '',
    status: status !== undefined ? status : true,
    loginCount: 0,
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    },
    creationAt: now,
    updatedAt: now
  };
  
  dataUser.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'Tạo user thành công',
    data: newUser
  });
});

// PUT update user
router.put('/:username', function(req, res, next) {
  const username = req.params.username;
  const user = dataUser.find(u => u.username === username);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User không tìm thấy'
    });
  }
  
  const { password, email, fullName, avatarUrl, status, roleId } = req.body;
  
  if (password) user.password = password;
  if (email) user.email = email;
  if (fullName) user.fullName = fullName;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (status !== undefined) user.status = status;
  
  // Update role if provided
  if (roleId) {
    const newRole = dataRole.find(r => r.id === roleId);
    if (!newRole) {
      return res.status(400).json({
        success: false,
        message: 'Role không tìm thấy'
      });
    }
    user.role = {
      id: newRole.id,
      name: newRole.name,
      description: newRole.description
    };
  }
  
  user.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Cập nhật user thành công',
    data: user
  });
});

// DELETE user
router.delete('/:username', function(req, res, next) {
  const username = req.params.username;
  const userIndex = dataUser.findIndex(u => u.username === username);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User không tìm thấy'
    });
  }
  
  const deletedUser = dataUser.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'Xóa user thành công',
    data: deletedUser[0]
  });
});

module.exports = router;
