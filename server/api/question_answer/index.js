'use strict';

var express = require('express');
var controller = require('./question_answer.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.put('/:id/ratings', auth.isAuthenticated(), controller.addRating);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
