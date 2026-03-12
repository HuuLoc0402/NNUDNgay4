var express = require('express');
var router = express.Router();
var { dataRole, dataUser } = require('../utils/data2');

// GET all roles
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    message: 'Lấy danh sách tất cả roles',
    data: dataRole
  });
});

// GET role by ID
router.get('/:id', function(req, res, next) {
  const roleId = req.params.id;
  const role = dataRole.find(r => r.id === roleId);
  
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role không tìm thấy'
    });
  }
  
  res.json({
    success: true,
    message: 'Lấy thông tin role thành công',
    data: role
  });
});

// GET all users in a specific role
router.get('/:id/users', function(req, res, next) {
  const roleId = req.params.id;
  const role = dataRole.find(r => r.id === roleId);
  
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role không tìm thấy'
    });
  }
  
  const usersInRole = dataUser.filter(u => u.role.id === roleId);
  
  res.json({
    success: true,
    message: `Lấy danh sách users trong role ${role.name}`,
    data: usersInRole,
    total: usersInRole.length
  });
});

// POST create new role
router.post('/', function(req, res, next) {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Tên role là bắt buộc'
    });
  }
  
  // Generate new ID
  const newId = 'r' + (Math.max(...dataRole.map(r => parseInt(r.id.replace('r', ''))), 0) + 1);
  const now = new Date().toISOString();
  
  const newRole = {
    id: newId,
    name: name,
    description: description || '',
    creationAt: now,
    updatedAt: now
  };
  
  dataRole.push(newRole);
  
  res.status(201).json({
    success: true,
    message: 'Tạo role thành công',
    data: newRole
  });
});

// PUT update role
router.put('/:id', function(req, res, next) {
  const roleId = req.params.id;
  const role = dataRole.find(r => r.id === roleId);
  
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role không tìm thấy'
    });
  }
  
  const { name, description } = req.body;
  
  if (name) role.name = name;
  if (description !== undefined) role.description = description;
  role.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Cập nhật role thành công',
    data: role
  });
});

// DELETE role
router.delete('/:id', function(req, res, next) {
  const roleId = req.params.id;
  const roleIndex = dataRole.findIndex(r => r.id === roleId);
  
  if (roleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Role không tìm thấy'
    });
  }
  
  // Check if any users have this role
  const usersWithRole = dataUser.filter(u => u.role.id === roleId);
  if (usersWithRole.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Không thể xóa role vì còn ${usersWithRole.length} user sử dụng role này`
    });
  }
  
  const deletedRole = dataRole.splice(roleIndex, 1);
  
  res.json({
    success: true,
    message: 'Xóa role thành công',
    data: deletedRole[0]
  });
});

module.exports = router;
