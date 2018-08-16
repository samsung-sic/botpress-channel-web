module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/andrew.wu/workspace/modules/channels/botpress-channel-web";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _moment = __webpack_require__(19);

var _moment2 = _interopRequireDefault(_moment);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _uuid = __webpack_require__(20);

var _uuid2 = _interopRequireDefault(_uuid);

var _botpress = __webpack_require__(21);

var _util = __webpack_require__(22);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (knex) {
  var getUserInfo = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId) {
      var user, name, avatar;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return knex('users').where({ platform: 'webchat', userId: (0, _util.sanitizeUserId)(userId) }).then().get(0).then();

            case 2:
              user = _context.sent;
              name = user && user.first_name + ' ' + user.last_name;
              avatar = user && user.picture_url || null;
              return _context.abrupt('return', {
                fullName: name,
                avatar_url: avatar
              });

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function getUserInfo(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var appendUserMessage = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(userId, conversationId, _ref3) {
      var type = _ref3.type,
          text = _ref3.text,
          raw = _ref3.raw,
          data = _ref3.data;

      var _ref4, fullName, avatar_url, convo, message;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              userId = (0, _util.sanitizeUserId)(userId);

              _context2.next = 3;
              return getUserInfo(userId);

            case 3:
              _ref4 = _context2.sent;
              fullName = _ref4.fullName;
              avatar_url = _ref4.avatar_url;
              _context2.next = 8;
              return getConversation(userId, conversationId);

            case 8:
              convo = _context2.sent;

              if (convo) {
                _context2.next = 11;
                break;
              }

              throw new Error('Conversation "' + conversationId + '" not found');

            case 11:
              message = {
                id: _uuid2.default.v4(),
                conversationId: conversationId,
                userId: userId,
                full_name: fullName,
                avatar_url: avatar_url,
                message_type: type,
                message_text: text,
                message_raw: (0, _botpress.DatabaseHelpers)(knex).json.set(raw),
                message_data: (0, _botpress.DatabaseHelpers)(knex).json.set(data),
                sent_on: (0, _botpress.DatabaseHelpers)(knex).date.now()
              };
              _context2.next = 14;
              return knex('web_messages').insert(message).then();

            case 14:
              _context2.next = 16;
              return knex('web_conversations').where({ id: conversationId, userId: userId }).update({ last_heard_on: (0, _botpress.DatabaseHelpers)(knex).date.now() }).then();

            case 16:
              return _context2.abrupt('return', Object.assign(message, {
                sent_on: new Date(),
                message_raw: (0, _botpress.DatabaseHelpers)(knex).json.get(message.message_raw),
                message_data: (0, _botpress.DatabaseHelpers)(knex).json.get(message.message_data)
              }));

            case 17:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function appendUserMessage(_x2, _x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  var appendBotMessage = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(botName, botAvatar, conversationId, _ref6) {
      var type = _ref6.type,
          text = _ref6.text,
          raw = _ref6.raw,
          data = _ref6.data;
      var message;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              message = {
                id: _uuid2.default.v4(),
                conversationId: conversationId,
                userId: null,
                full_name: botName,
                avatar_url: botAvatar,
                message_type: type,
                message_text: text,
                message_raw: (0, _botpress.DatabaseHelpers)(knex).json.set(raw),
                message_data: (0, _botpress.DatabaseHelpers)(knex).json.set(data),
                sent_on: (0, _botpress.DatabaseHelpers)(knex).date.now()
              };
              _context3.next = 3;
              return knex('web_messages').insert(message).then();

            case 3:
              return _context3.abrupt('return', Object.assign(message, {
                sent_on: new Date(),
                message_raw: (0, _botpress.DatabaseHelpers)(knex).json.get(message.message_raw),
                message_data: (0, _botpress.DatabaseHelpers)(knex).json.get(message.message_data)
              }));

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function appendBotMessage(_x5, _x6, _x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  }();

  var createConversation = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(userId) {
      var uid, title, conversation;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userId = (0, _util.sanitizeUserId)(userId);

              uid = Math.random().toString().substr(2, 6);
              title = 'Conversation ' + uid;
              _context4.next = 5;
              return knex('web_conversations').insert({
                userId: userId,
                created_on: (0, _botpress.DatabaseHelpers)(knex).date.now(),
                title: title
              }).then();

            case 5:
              _context4.next = 7;
              return knex('web_conversations').where({ title: title, userId: userId }).select('id').then().get(0).then();

            case 7:
              conversation = _context4.sent;
              return _context4.abrupt('return', conversation && conversation.id);

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function createConversation(_x9) {
      return _ref7.apply(this, arguments);
    };
  }();

  var patchConversation = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(userId, conversationId, title, description, logoUrl) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              userId = (0, _util.sanitizeUserId)(userId);

              _context5.next = 3;
              return knex('web_conversations').where({ userId: userId, id: conversationId }).update({
                title: title,
                description: description,
                logo_url: logoUrl
              }).then();

            case 3:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function patchConversation(_x10, _x11, _x12, _x13, _x14) {
      return _ref8.apply(this, arguments);
    };
  }();

  var getOrCreateRecentConversation = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(userId) {
      var conversations, isRecent, recents;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              userId = (0, _util.sanitizeUserId)(userId);

              _context6.next = 3;
              return listConversations(userId);

            case 3:
              conversations = _context6.sent;

              // TODO make this configurable
              isRecent = function isRecent(d) {
                var then = (0, _moment2.default)(d);
                var recent = (0, _moment2.default)().subtract(6, 'hours');
                return then.isSameOrAfter(recent);
              };

              recents = _lodash2.default.filter(conversations, function (c) {
                return isRecent(c.last_heard_on);
              });

              recents = _lodash2.default.orderBy(recents, ['last_heard_on'], ['desc']);

              if (!recents.length) {
                _context6.next = 9;
                break;
              }

              return _context6.abrupt('return', recents[0].id);

            case 9:
              return _context6.abrupt('return', createConversation(userId));

            case 10:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function getOrCreateRecentConversation(_x15) {
      return _ref9.apply(this, arguments);
    };
  }();

  var listConversations = function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(userId) {
      var conversations, conversationIds;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              userId = (0, _util.sanitizeUserId)(userId);

              _context7.next = 3;
              return knex('web_conversations').where({ userId: userId }).orderBy(['last_heard_on'], 'desc').limit(100).then();

            case 3:
              conversations = _context7.sent;
              conversationIds = _lodash2.default.map(conversations, function (c) {
                return c.id;
              });
              return _context7.abrupt('return', knex.from(function () {
                this.from('web_messages').whereIn('conversationId', conversationIds).groupBy('conversationId').select('conversationId', knex.raw('max(id) as msgid')).as('q1');
              }).innerJoin('web_conversations', 'web_conversations.id', 'q1.conversationId').innerJoin('web_messages', 'web_messages.id', 'q1.msgid').orderBy('web_messages.sent_on', 'desc').select('web_conversations.id', 'web_conversations.title', 'web_conversations.description', 'web_conversations.logo_url', 'web_conversations.created_on', 'web_messages.message_type', 'web_messages.message_text', knex.raw('web_messages.full_name as message_author'), knex.raw('web_messages.avatar_url as message_author_avatar'), knex.raw('web_messages.sent_on as message_sent_on')).then());

            case 6:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function listConversations(_x16) {
      return _ref10.apply(this, arguments);
    };
  }();

  var getConversation = function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(userId, conversationId) {
      var fromId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var condition, conversation, messages;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              userId = (0, _util.sanitizeUserId)(userId);

              condition = { userId: userId };


              if (conversationId && conversationId !== 'null') {
                condition.id = conversationId;
              }

              _context8.next = 5;
              return knex('web_conversations').where(condition).then().get(0).then();

            case 5:
              conversation = _context8.sent;

              if (conversation) {
                _context8.next = 8;
                break;
              }

              return _context8.abrupt('return', null);

            case 8:
              _context8.next = 10;
              return getConversationMessages(conversationId, fromId);

            case 10:
              messages = _context8.sent;


              messages.forEach(function (m) {
                return Object.assign(m, {
                  message_raw: (0, _botpress.DatabaseHelpers)(knex).json.get(m.message_raw),
                  message_data: (0, _botpress.DatabaseHelpers)(knex).json.get(m.message_data)
                });
              });

              return _context8.abrupt('return', Object.assign({}, conversation, {
                messages: _lodash2.default.orderBy(messages, ['sent_on'], ['asc'])
              }));

            case 13:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    return function getConversation(_x17, _x18) {
      return _ref11.apply(this, arguments);
    };
  }();

  function initialize() {
    if (!knex) {
      throw new Error('you must initialize the database before');
    }

    return (0, _botpress.DatabaseHelpers)(knex).createTableIfNotExists('web_conversations', function (table) {
      table.increments('id').primary();
      table.string('userId');
      table.string('title');
      table.string('description');
      table.string('logo_url');
      table.timestamp('created_on');
      table.timestamp('last_heard_on'); // The last time the user interacted with the bot. Used for "recent" conversation
      table.timestamp('user_last_seen_on');
      table.timestamp('bot_last_seen_on');
    }).then(function () {
      return (0, _botpress.DatabaseHelpers)(knex).createTableIfNotExists('web_messages', function (table) {
        table.string('id').primary();
        table.integer('conversationId');
        table.string('userId');
        table.string('message_type');
        table.text('message_text');
        table.jsonb('message_raw');
        table.binary('message_data'); // Only useful if type = file
        table.string('full_name');
        table.string('avatar_url');
        table.timestamp('sent_on');
      });
    });
  }

  function getConversationMessages(conversationId) {
    var fromId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var query = knex('web_messages').where({ conversationId: conversationId });

    if (fromId) {
      query = query.andWhere('id', '<', fromId);
    }

    return query.orderBy('sent_on', 'desc').limit(20).then();
  }

  return {
    initialize: initialize,
    appendUserMessage: appendUserMessage,
    appendBotMessage: appendBotMessage,
    createConversation: createConversation,
    patchConversation: patchConversation,
    getConversation: getConversation,
    listConversations: listConversations,
    getOrCreateRecentConversation: getOrCreateRecentConversation
  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _sillyname = __webpack_require__(23);

var _sillyname2 = _interopRequireDefault(_sillyname);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(bp, config) {
    var getOrCreateUser = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId) {
        var throwIfNotFound = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var realUserId, user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                realUserId = userId.startsWith('webchat:') ? userId.substr(8) : userId;
                _context.next = 3;
                return knex('users').where({
                  platform: 'webchat',
                  userId: realUserId
                }).then().get(0).then();

              case 3:
                user = _context.sent;

                if (user) {
                  _context.next = 10;
                  break;
                }

                if (!throwIfNotFound) {
                  _context.next = 7;
                  break;
                }

                throw new Error('User ' + realUserId + ' not found');

              case 7:
                _context.next = 9;
                return createNewUser(realUserId);

              case 9:
                return _context.abrupt('return', getOrCreateUser(realUserId, true));

              case 10:
                return _context.abrupt('return', user);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function getOrCreateUser(_x3) {
        return _ref2.apply(this, arguments);
      };
    }();

    var patchUserInfo = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(userId, fields) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function patchUserInfo(_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }();

    var knex, createNewUser;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            createNewUser = function createNewUser(userId) {
              var _sillyname$split = (0, _sillyname2.default)().split(' '),
                  _sillyname$split2 = _slicedToArray(_sillyname$split, 2),
                  first_name = _sillyname$split2[0],
                  last_name = _sillyname$split2[1];

              var user = {
                first_name: first_name,
                last_name: last_name,
                profile_pic: null,
                id: userId,
                platform: 'webchat'
              };

              return bp.db.saveUser(user);
            };

            _context3.next = 3;
            return bp.db.get();

          case 3:
            knex = _context3.sent;
            return _context3.abrupt('return', { getOrCreateUser: getOrCreateUser });

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fs = __webpack_require__(7);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(1);

var _path2 = _interopRequireDefault(_path);

var _umm = __webpack_require__(8);

var _umm2 = _interopRequireDefault(_umm);

var _api = __webpack_require__(11);

var _api2 = _interopRequireDefault(_api);

var _socket = __webpack_require__(24);

var _socket2 = _interopRequireDefault(_socket);

var _db = __webpack_require__(2);

var _db2 = _interopRequireDefault(_db);

var _botpressPlatformWebchatConfig = __webpack_require__(25);

var _botpressPlatformWebchatConfig2 = _interopRequireDefault(_botpressPlatformWebchatConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var createConfigFile = function createConfigFile(bp) {
  var name = 'botpress-platform-webchat.config.yml';
  var file = _path2.default.join(bp.projectLocation, name);

  if (!_fs2.default.existsSync(file)) {
    _fs2.default.writeFileSync(file, _botpressPlatformWebchatConfig2.default);

    bp.notifications.send({
      level: 'info',
      message: name + ' has been created, fill it'
    });
  }
};

module.exports = {

  config: {
    uploadsUseS3: { type: 'bool', required: false, default: false, env: 'WEBCHAT_USE_S3' },
    uploadsS3Bucket: { type: 'string', required: false, default: 'bucket-name', env: 'WEBCHAT_S3_BUCKET' },
    uploadsS3Region: { type: 'any', required: false, default: null, env: 'WEBCHAT_S3_REGION' },
    uploadsS3AWSAccessKey: { type: 'any', required: false, default: null, env: 'WEBCHAT_S3_ACCESS_KEY' },
    uploadsS3AWSAccessSecret: { type: 'any', required: false, default: null, env: 'WEBCHAT_S3_KEY_SECRET' }
  },

  init: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bp, configurator) {
      var config;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return configurator.loadAll();

            case 2:
              config = _context.sent;
              _context.next = 5;
              return (0, _socket2.default)(bp, config);

            case 5:

              bp.middlewares.load(); // TODO Fix that

              createConfigFile(bp);

              // Initialize UMM
              return _context.abrupt('return', (0, _umm2.default)(bp));

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function init(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return init;
  }(),

  ready: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(bp, configurator) {
      var config, knex, router;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return configurator.loadAll();

            case 2:
              config = _context2.sent;
              _context2.next = 5;
              return bp.db.get();

            case 5:
              knex = _context2.sent;


              // Initialize the database
              (0, _db2.default)(knex, bp.botfile).initialize();

              // Setup the APIs
              _context2.next = 9;
              return (0, _api2.default)(bp, config);

            case 9:
              router = _context2.sent;

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function ready(_x3, _x4) {
      return _ref2.apply(this, arguments);
    }

    return ready;
  }()
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = __webpack_require__(9);

var _util2 = _interopRequireDefault(_util);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = __webpack_require__(3);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = __webpack_require__(1);

var _path2 = _interopRequireDefault(_path);

var _mime = __webpack_require__(10);

var _mime2 = _interopRequireDefault(_mime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QUICK_REPLY_PAYLOAD = /\<(.+)\>\s(.+)/i;

// TODO Extract this logic directly to botpress's UMM
function processQuickReplies(qrs, blocName) {
  if (!_lodash2.default.isArray(qrs)) {
    throw new Error('Expected quick_replies to be an array');
  }

  return qrs.map(function (qr) {
    if (_lodash2.default.isString(qr) && QUICK_REPLY_PAYLOAD.test(qr)) {
      var _QUICK_REPLY_PAYLOAD$ = QUICK_REPLY_PAYLOAD.exec(qr),
          _QUICK_REPLY_PAYLOAD$2 = _slicedToArray(_QUICK_REPLY_PAYLOAD$, 3),
          payload = _QUICK_REPLY_PAYLOAD$2[1],
          text = _QUICK_REPLY_PAYLOAD$2[2];
      // <.HELLO> becomes <BLOCNAME.HELLO>


      if (payload.startsWith('.')) {
        payload = blocName + payload;
      }

      return {
        title: text,
        payload: payload.toUpperCase()
      };
    }

    return qr;
  });
}

function loginPrompt(event, instruction, options) {
  var user = getUserId(event);

  var raw = buildObjectRaw(event, instruction, options, user);

  return PromisifyEvent({
    platform: 'webchat',
    type: 'login_prompt',
    user: { id: user },
    raw: raw,
    text: instruction.text
  });
}

// - type: file
//   url: "https://exemple.com"

function uploadFile(event, instruction, options) {
  var user = getUserId(event);
  var url = instruction.url;

  // if you are working on the same url
  // you can let absolute path for your image

  var extension = _path2.default.extname(url);

  var mimeType = _mime2.default.getType(extension);

  var basename = _path2.default.basename(url, extension);

  var raw = buildObjectRaw(event, instruction, options, user);

  return PromisifyEvent({
    platform: 'webchat',
    type: 'file',
    user: { id: user },
    raw: raw,
    text: instruction.text || basename,
    data: {
      storage: 'remote',
      url: url,
      name: basename || 'unknown',
      mime: mimeType || 'unknown'
    }
  });
}

function carousel(event, instruction, options) {
  var user = getUserId(event);

  var raw = buildObjectRaw(event, instruction, options, user);

  return PromisifyEvent({
    platform: 'webchat',
    type: 'carousel',
    user: { id: user },
    raw: raw,
    text: instruction.text
  });
}

function customEvent(event, instruction, options) {
  var user = getUserId(event);
  var raw = buildObjectRaw(event, instruction, options, user);

  return PromisifyEvent({
    platform: 'webchat',
    type: 'custom',
    user: { id: user },
    raw: _extends({}, raw, { custom_type: instruction.type, custom_data: instruction.data }),
    text: instruction.text
  });
}

function defaultText(event, instruction, options) {
  var user = getUserId(event);
  var raw = buildObjectRaw(event, instruction, options, user);

  if (!_lodash2.default.isNil(instruction.text)) {
    return PromisifyEvent({
      platform: 'webchat',
      type: 'text',
      user: { id: user },
      raw: raw,
      text: instruction.text
    });
  }
}

// Build the raw obj to pass to the Promise
function buildObjectRaw(event, instruction, options, user) {
  var raw = Object.assign({
    to: user,
    message: instruction.text || null
  }, options, _lodash2.default.pick(event && event.raw, 'conversationId'));

  return raw;
}

function processForm(formElement) {
  if (_lodash2.default.isArray(formElement)) {
    throw new Error('Expected `form` to be an object!');
  }
  if (!formElement.hasOwnProperty('id') || formElement.id === null) {
    throw new Error('Expected `form.id` field');
  }
  if (!formElement.hasOwnProperty('elements') || !_lodash2.default.isArray(formElement.elements)) {
    throw new Error('Expected `form.elements` to be an Array!');
  }
  return {
    title: formElement.title,
    id: formElement.id,
    elements: formElement.elements.map(function (field) {
      if ('input' in field) {
        // Input field
        return {
          label: field.input.label,
          placeholder: field.input.placeholder || '',
          name: field.input.name,
          type: 'input',
          subtype: field.input.subtype || '',
          maxlength: field.input.maxlength || '',
          minlength: field.input.minlength || '',
          required: field.input.required || false
        };
      } else if ('textarea' in field) {
        // Textarea field
        return {
          label: field.textarea.label,
          placeholder: field.textarea.placeholder || '',
          name: field.textarea.name,
          type: 'textarea',
          maxlength: field.textarea.maxlength || '',
          minlength: field.textarea.minlength || '',
          required: field.textarea.required || false
        };
      } else if ('select' in field) {
        // Select field
        return {
          label: field.select.label,
          placeholder: field.select.placeholder || '',
          name: field.select.name,
          options: field.select.options,
          required: field.select.required || false,
          type: 'select'
        };
      } else {
        throw new Error('Cannot recognize element type!');
      }
    })
  };
}
function getUserId(event) {
  var userId = _lodash2.default.get(event, 'user.id') || _lodash2.default.get(event, 'user.userId') || _lodash2.default.get(event, 'userId') || _lodash2.default.get(event, 'raw.from') || _lodash2.default.get(event, 'raw.userId') || _lodash2.default.get(event, 'raw.user.id');

  if (!userId) {
    throw new Error('Could not find userId in the incoming event.');
  }

  return userId;
}

function PromisifyEvent(event) {
  if (!event._promise) {
    event._promise = new _bluebird2.default(function (resolve, reject) {
      event._resolve = resolve;
      event._reject = reject;
    });
  }

  return event;
}

function _processOutgoing(_ref) {
  var event = _ref.event,
      blocName = _ref.blocName,
      instruction = _ref.instruction;

  var ins = Object.assign({}, instruction); // Create a shallow copy of the instruction

  ////////
  // PRE-PROCESSING
  ////////

  var optionsList = ['typing', 'quick_replies', 'file', 'form', 'elements', 'web-style', 'settings', 'markdown'];

  var options = _lodash2.default.pick(instruction, optionsList);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = optionsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      delete ins[prop];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (options.quick_replies) {
    options.quick_replies = processQuickReplies(options.quick_replies, blocName);
  }

  // TODO : Make a Quick_replies than handle text and picture.

  if (options.form) {
    options.form = processForm(options.form);
  }
  /////////
  /// Processing
  /////////

  if (instruction.type === 'login_prompt') {
    return loginPrompt(event, instruction, options);
  } else if (instruction.type === 'file') {
    return uploadFile(event, instruction, options);
  } else if (instruction.type === 'carousel') {
    return carousel(event, instruction, options);
  } else if (instruction.type === 'location_picker') {
    // TODO
  } else if (instruction.type && instruction.type.startsWith('@')) {
    return customEvent(event, instruction, options);
  } else {
    return defaultText(event, instruction, options);
  }

  ////////////
  /// POST-PROCESSING
  ////////////

  // Nothing to post-process yet

  ////////////
  /// INVALID INSTRUCTION
  ////////////

  var strRep = _util2.default.inspect(instruction, false, 1);
  throw new Error('Unrecognized instruction on Web in bloc \'' + blocName + '\': ' + strRep);
}

////////////
/// TEMPLATES
////////////

function getTemplates() {
  return [];
}

module.exports = function (bp) {
  var _$at = _lodash2.default.at(bp, ['umm', 'umm.registerConnector']),
      _$at2 = _slicedToArray(_$at, 2),
      umm = _$at2[0],
      registerConnector = _$at2[1];

  umm && registerConnector && registerConnector({
    platform: 'webchat',
    processOutgoing: function processOutgoing(args) {
      return _processOutgoing(Object.assign({}, args, { bp: bp }));
    },
    templates: getTemplates()
  });
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("mime");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _path = __webpack_require__(1);

var _path2 = _interopRequireDefault(_path);

var _multer = __webpack_require__(12);

var _multer2 = _interopRequireDefault(_multer);

var _multerS = __webpack_require__(13);

var _multerS2 = _interopRequireDefault(_multerS);

var _awsSdk = __webpack_require__(14);

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _inject = __webpack_require__(15);

var _inject2 = _interopRequireDefault(_inject);

var _inject3 = __webpack_require__(16);

var _inject4 = _interopRequireDefault(_inject3);

var _notification = __webpack_require__(17);

var _notification2 = _interopRequireDefault(_notification);

var _serveStatic = __webpack_require__(18);

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _db2 = __webpack_require__(2);

var _db3 = _interopRequireDefault(_db2);

var _users = __webpack_require__(4);

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ERR_USER_ID_REQ = '`userId` is required and must be valid';
var ERR_MSG_TYPE = '`type` is required and must be valid';
var ERR_CONV_ID_REQ = '`conversationId` is required and must be valid';

module.exports = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(bp, config) {
    var sendNewMessage = function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(userId, conversationId, payload) {
        var sanitizedPayload, persistedPayload, message, user;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(!payload.text || !_lodash2.default.isString(payload.text) || payload.text.length > 360)) {
                  _context6.next = 2;
                  break;
                }

                throw new Error('Text must be a valid string of less than 360 chars');

              case 2:
                sanitizedPayload = _lodash2.default.pick(payload, ['text', 'type', 'data']);

                // Because we don't necessarily persist what we emit/received

                persistedPayload = Object.assign({}, sanitizedPayload);

                // We remove the password from the persisted messages for security reasons

                if (payload.type === 'login_prompt') {
                  persistedPayload.data = _lodash2.default.omit(persistedPayload.data, ['password']);
                }

                if (payload.type === 'form') {
                  persistedPayload.data.formId = payload.formId;
                }

                _context6.next = 8;
                return appendUserMessage(userId, conversationId, persistedPayload);

              case 8:
                message = _context6.sent;


                Object.assign(message, {
                  __room: 'visitor:' + userId // This is used to send to the relevant user's socket
                });

                bp.events.emit('guest.webchat.message', message);

                _context6.next = 13;
                return getOrCreateUser(userId);

              case 13:
                user = _context6.sent;
                return _context6.abrupt('return', bp.middlewares.sendIncoming(Object.assign({
                  platform: 'webchat',
                  type: payload.type,
                  user: user,
                  text: payload.text,
                  raw: Object.assign({}, sanitizedPayload, {
                    conversationId: conversationId
                  })
                }, payload.data)));

              case 15:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function sendNewMessage(_x14, _x15, _x16) {
        return _ref14.apply(this, arguments);
      };
    }();

    var diskStorage, upload, awsConfig, s3, s3Storage, knex, _db, listConversations, getConversation, appendUserMessage, getOrCreateRecentConversation, _ref2, getOrCreateUser, router, asyncApi, modulePath, staticFolder, validateUserId;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            validateUserId = function validateUserId(userId) {
              return (/[a-z0-9-_]+/i.test(userId)
              );
            };

            diskStorage = _multer2.default.diskStorage({
              limits: {
                files: 1,
                fileSize: 5242880 // 5MB
              },
              filename: function filename(req, file, cb) {
                var userId = _lodash2.default.get(req, 'params.userId') || 'anonymous';
                var ext = _path2.default.extname(file.originalname);

                cb(null, userId + '_' + new Date().getTime() + ext);
              }
            });
            upload = (0, _multer2.default)({ storage: diskStorage });


            if (config.uploadsUseS3) {
              /*
                You can override AWS's default settings here. Example:
                { region: 'us-east-1', apiVersion: '2014-10-01', credentials: {...} }
               */
              awsConfig = {
                region: config.uploadsS3Region,
                credentials: {
                  accessKeyId: config.uploadsS3AWSAccessKey,
                  secretAccessKey: config.uploadsS3AWSAccessSecret
                }
              };


              if (!awsConfig.credentials.accessKeyId && !awsConfig.credentials.secretAccessKey) {
                delete awsConfig.credentials;
              }

              if (!awsConfig.region) {
                delete awsConfig.region;
              }

              s3 = new _awsSdk2.default.S3(awsConfig);
              s3Storage = (0, _multerS2.default)({
                s3: s3,
                bucket: config.uploadsS3Bucket || 'uploads',
                contentType: _multerS2.default.AUTO_CONTENT_TYPE,
                cacheControl: 'max-age=31536000', // one year caching
                acl: 'public-read',
                key: function key(req, file, cb) {
                  var userId = _lodash2.default.get(req, 'params.userId') || 'anonymous';
                  var ext = _path2.default.extname(file.originalname);

                  cb(null, userId + '_' + new Date().getTime() + ext);
                }
              });


              upload = (0, _multer2.default)({ storage: s3Storage });
            }

            _context9.next = 6;
            return bp.db.get();

          case 6:
            knex = _context9.sent;
            _db = (0, _db3.default)(knex, bp.botfile), listConversations = _db.listConversations, getConversation = _db.getConversation, appendUserMessage = _db.appendUserMessage, getOrCreateRecentConversation = _db.getOrCreateRecentConversation;
            _context9.next = 10;
            return (0, _users2.default)(bp, config);

          case 10:
            _ref2 = _context9.sent;
            getOrCreateUser = _ref2.getOrCreateUser;
            router = bp.getRouter('botpress-platform-webchat', { auth: false });

            asyncApi = function asyncApi(fn) {
              return function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
                          _context.next = 3;
                          return fn(req, res, next);

                        case 3:
                          _context.next = 8;
                          break;

                        case 5:
                          _context.prev = 5;
                          _context.t0 = _context['catch'](0);

                          res.status(500).send(_context.t0 && _context.t0.message);

                        case 8:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined, [[0, 5]]);
                }));

                return function (_x3, _x4, _x5) {
                  return _ref3.apply(this, arguments);
                };
              }();
            };

            router.get('/inject.js', function (req, res) {
              res.contentType('text/javascript');
              res.send(_inject2.default);
            });

            router.get('/inject.css', function (req, res) {
              res.contentType('text/css');
              res.send(_inject4.default);
            });

            modulePath = bp._loadedModules['@botpress/channel-web'].root;
            staticFolder = _path2.default.join(modulePath, './static');

            router.use('/static', (0, _serveStatic2.default)(staticFolder));

            // ?conversationId=xxx (optional)
            router.post('/messages/:userId', asyncApi(function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
                var _ref5, userId, payload, _ref6, conversationId;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _ref5 = req.params || {}, userId = _ref5.userId;

                        if (validateUserId(userId)) {
                          _context2.next = 3;
                          break;
                        }

                        return _context2.abrupt('return', res.status(400).send(ERR_USER_ID_REQ));

                      case 3:
                        _context2.next = 5;
                        return getOrCreateUser(userId);

                      case 5:
                        // Just to create the user if it doesn't exist

                        payload = req.body || {};
                        _ref6 = req.query || {}, conversationId = _ref6.conversationId;

                        conversationId = conversationId && parseInt(conversationId);

                        if (_lodash2.default.includes(['text', 'quick_reply', 'form', 'login_prompt'], payload.type)) {
                          _context2.next = 10;
                          break;
                        }

                        return _context2.abrupt('return', res.status(400).send(ERR_MSG_TYPE));

                      case 10:
                        if (conversationId) {
                          _context2.next = 14;
                          break;
                        }

                        _context2.next = 13;
                        return getOrCreateRecentConversation(userId);

                      case 13:
                        conversationId = _context2.sent;

                      case 14:
                        _context2.next = 16;
                        return sendNewMessage(userId, conversationId, payload);

                      case 16:
                        return _context2.abrupt('return', res.sendStatus(200));

                      case 17:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x6, _x7) {
                return _ref4.apply(this, arguments);
              };
            }()));

            // ?conversationId=xxx (required)
            router.post('/messages/:userId/files', upload.single('file'), asyncApi(function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
                var _ref8, userId, _ref9, conversationId, payload;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _ref8 = req.params || {}, userId = _ref8.userId;

                        if (validateUserId(userId)) {
                          _context3.next = 3;
                          break;
                        }

                        return _context3.abrupt('return', res.status(400).send(ERR_USER_ID_REQ));

                      case 3:
                        _context3.next = 5;
                        return getOrCreateUser(userId);

                      case 5:
                        // Just to create the user if it doesn't exist

                        _ref9 = req.query || {}, conversationId = _ref9.conversationId;

                        conversationId = conversationId && parseInt(conversationId);

                        if (conversationId) {
                          _context3.next = 9;
                          break;
                        }

                        return _context3.abrupt('return', res.status(400).send(ERR_CONV_ID_REQ));

                      case 9:
                        payload = {
                          text: 'Uploaded a file [' + req.file.originalname + ']',
                          type: 'file',
                          data: {
                            storage: req.file.location ? 's3' : 'local',
                            url: req.file.location || null,
                            name: req.file.originalname,
                            mime: req.file.contentType || req.file.mimetype,
                            size: req.file.size
                          }
                        };
                        _context3.next = 12;
                        return sendNewMessage(userId, conversationId, payload);

                      case 12:
                        return _context3.abrupt('return', res.sendStatus(200));

                      case 13:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x8, _x9) {
                return _ref7.apply(this, arguments);
              };
            }()));

            router.get('/conversations/:userId/:conversationId', function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
                var _ref11, userId, conversationId, conversation;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _ref11 = req.params || {}, userId = _ref11.userId, conversationId = _ref11.conversationId;

                        if (validateUserId(userId)) {
                          _context4.next = 3;
                          break;
                        }

                        return _context4.abrupt('return', res.status(400).send(ERR_USER_ID_REQ));

                      case 3:
                        _context4.next = 5;
                        return getConversation(userId, conversationId);

                      case 5:
                        conversation = _context4.sent;
                        return _context4.abrupt('return', res.send(conversation));

                      case 7:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, undefined);
              }));

              return function (_x10, _x11) {
                return _ref10.apply(this, arguments);
              };
            }());

            router.get('/conversations/:userId', function () {
              var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
                var _ref13, userId, conversations;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _ref13 = req.params || {}, userId = _ref13.userId;

                        if (validateUserId(userId)) {
                          _context5.next = 3;
                          break;
                        }

                        return _context5.abrupt('return', res.status(400).send(ERR_USER_ID_REQ));

                      case 3:
                        _context5.next = 5;
                        return getOrCreateUser(userId);

                      case 5:
                        _context5.next = 7;
                        return listConversations(userId);

                      case 7:
                        conversations = _context5.sent;
                        return _context5.abrupt('return', res.send([].concat(_toConsumableArray(conversations))));

                      case 9:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, undefined);
              }));

              return function (_x12, _x13) {
                return _ref12.apply(this, arguments);
              };
            }());

            router.post('/events/:userId', asyncApi(function () {
              var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
                var _ref16, type, payload, _ref17, userId, user;

                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _ref16 = req.body || {}, type = _ref16.type, payload = _ref16.payload;
                        _ref17 = req.params || {}, userId = _ref17.userId;
                        _context7.next = 4;
                        return getOrCreateUser(userId);

                      case 4:
                        user = _context7.sent;

                        bp.middlewares.sendIncoming(_extends({
                          platform: 'webchat',
                          type: type,
                          user: user,
                          text: payload.text,
                          raw: _lodash2.default.pick(payload, ['text', 'type', 'data'])
                        }, payload.data));
                        res.status(200).send({});

                      case 7:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, undefined);
              }));

              return function (_x17, _x18) {
                return _ref15.apply(this, arguments);
              };
            }()));

            router.post('/conversations/:userId/:conversationId/reset', asyncApi(function () {
              var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
                var _req$params, userId, conversationId, user, payload;

                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _req$params = req.params, userId = _req$params.userId, conversationId = _req$params.conversationId;
                        _context8.next = 3;
                        return getOrCreateUser(userId);

                      case 3:
                        user = _context8.sent;
                        payload = {
                          text: 'Reset the conversation',
                          type: 'session_reset'
                        };
                        _context8.next = 7;
                        return sendNewMessage(userId, conversationId, payload);

                      case 7:
                        _context8.next = 9;
                        return bp.dialogEngine.stateManager.deleteState(user.id);

                      case 9:
                        res.status(200).send({});

                      case 10:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, undefined);
              }));

              return function (_x19, _x20) {
                return _ref18.apply(this, arguments);
              };
            }()));

            return _context9.abrupt('return', router);

          case 26:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("multer-s3");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "'use strict';\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nfunction _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }\n\nvar injectDOMElement = function injectDOMElement(tagName, targetSelector) {\n  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n\n  var element = document.createElement(tagName);\n  Object.keys(options).forEach(function (key) {\n    return element[key] = options[key];\n  });\n  document.querySelector(targetSelector).appendChild(element);\n  return element;\n};\n\nwindow.addEventListener('message', function (_ref) {\n  var data = _ref.data;\n\n  if (!data || !data.type || data.type !== 'setClass') return;\n  document.querySelector('#bp-widget').setAttribute('class', data.value);\n});\n\nvar init = function init(_ref2) {\n  var _ref2$host = _ref2.host,\n      host = _ref2$host === undefined ? '' : _ref2$host,\n      _ref2$hideWidget = _ref2.hideWidget,\n      hideWidget = _ref2$hideWidget === undefined ? false : _ref2$hideWidget,\n      config = _objectWithoutProperties(_ref2, ['host', 'hideWidget']);\n\n  var cssHref = host + '/api/botpress-platform-webchat/inject.css';\n  injectDOMElement('link', 'head', { rel: 'stylesheet', href: cssHref });\n\n  var options = encodeURIComponent(JSON.stringify({ hideWidget: hideWidget, config: config }));\n  var iframeSrc = host + '/lite/?m=channel-web&v=embedded&options=' + options;\n  var iframeHTML = '<iframe id=\\'bp-widget\\' frameborder=\\'0\\' src=\\'' + iframeSrc + '\\' />';\n  injectDOMElement('div', 'body', { id: 'bp-web-widget', innerHTML: iframeHTML });\n\n  var iframeWindow = document.querySelector('#bp-web-widget > #bp-widget').contentWindow;\n  var configure = function configure(payload) {\n    return iframeWindow.postMessage({ action: 'configure', payload: payload }, '*');\n  };\n  var sendEvent = function sendEvent(payload) {\n    return iframeWindow.postMessage({ action: 'event', payload: payload }, '*');\n  };\n\n  window.botpressWebChat = _extends({}, window.botpressWebChat, { configure: configure, sendEvent: sendEvent });\n};\n\nwindow.botpressWebChat = { init: init };"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = ".bp-widget-web {\n  border: none;\n  display: block;\n  position: fixed;\n  visibility: none;\n  z-index: 100000;\n  max-height: 100vh;\n  max-width: 100vw;\n  transition: none;\n  background: none transparent;\n  opacity: 1;\n  font-size: 16px;    \n  letter-spacing: 0;\n  -webkit-font-smoothing: antialiased;\n  padding: 0;\n}\n\n.bp-widget-widget {\n  top: auto;\n  left: auto;\n  bottom: 24px;\n  right: 36px;\n  width: 76px !important;\n  height: 76px !important; \n}\n\n.bp-widget-convo {\n  top: auto;\n  left: auto;\n  bottom: 24px;\n  right: 36px;\n  width: 420px !important;\n  min-height: 382px !important;\n  max-height: 500px !important;\n}\n\n.bp-widget-side {\n  top: 0px;\n  left: auto;\n  bottom: 0px;\n  right: 0px;\n  width: 460px;\n  height: 100% !important;\n}\n\n@media only screen and (max-device-width: 768px) {\n  .bp-widget-side {\n    width: 100%;\n  }\n}\n"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "ID3\u0002\u0000\u0000\u0000\u0000\u001fvTSS\u0000\u0000\r\u0000Logic 10.2.2COM\u0000\u0000h\u0000engiTunNORM\u0000 000001D5 00000166 000004F8 000003C9 0000009C 00000082 00006323 000058B8 0000001A 00000000\u0000COM\u0000\u0000�\u0000engiTunSMPB\u0000 00000000 00000210 0000078C 0000000000005064 00000000 000030FB 00000000 00000000 00000000 00000000 00000000 00000000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0004\u0019)7�l`\u0000u�\u0016�\u0000\u001e�A\u0004\u0019z�\u0003�H �/P\u0000/\u001aa�9n�$T�KL�\f�V͝��\rɐԏ��`\u0014\u0018�o�w�\u0000\u0000\t@�\u0012�\u0003\u0003\u0003s�߈����b����\u0011\u0013�̿�D\u0016\u000f��+\u0002\u0002\u000e�\u0003���\u0003�p�\u000f�� �\\\u0010qs���P \b`��\be��|\u0010v$\fr���&\u001f(\b\u001c\u0004\u001d��\u0013����\u000f��A�y{�$T�KL�\f�VM���\rɐԏ��`\u0014\u0018�sX\u0013'�\u0010�\u0000\u0010����wz�\u0010 L�;\u0007���p|\u0010\f`�����88\b8N\u001f���>��?�\b\u00061\u0018~\b\u001c��|\u001c\fe�\u0000@1(\b\u0006*\u0007��\u0001\u0007u�\u0010|\u001f\u0007\u0001\b�>2\u0003�\f\u0003�\f��s\u0000�\f/��@󇰬\f\u0002�\u0000\u0000\b\u0001�0\u0006�|\u0003\u0000h\u0000p5��M\u0003\u0003tErq@`$�Z\r�\u0003\u0010�\u001d00\u000b\u0000x.\u001f\u0002��H\u0001�X@p�#Tb;\u0013\u0002I�0i$\f�74���D\u001b\u0003\u001c\n��@���M5\u0007�\u0017V@\u0000��P08'�\u000bg��<5`7P1�\r\u0001����d@\\�6A��@bAJooz� �\\�K\u000b<d��3\u0004C��7E\u0015�A2\u000en��\u0003(8\b9\u0017��{W�ꛎ\u0003D\f\r\u0012\"�\\�\"��\"﮿�\rk�����W�m��ɗȡ0N\u0017���D\u00107u� �\b-7/���  `)\u0000�\u0006\u0004X\u0002�e\u0013?�\u0007�>[``\u0015\u0000\u0000\u0000@\u000e���\u0004�\u0018\f�\u0004���f�\u0019\\��\u0013�\u0003\u0001�\u0005�\u0016\u00000\f/\u0010Y��\u0014\u0004P�l\u0001Cp�\u0000zQp\u001b��:2\u0006`c\u00008\t(��K���k���`baP\u0018�<\u0003\u0001�]k\\\f\u0012\u0001\ffp\\�����\u0010\fG��D\bp�?�\u0017\u0014�XxZ8r�\u0014\u0000\u000b�\u0011����]Y\\ܙ\u0010�Ɇ�\rX'\u000f���[\u0014\u0018�\u0016A\u0014A3\u0002�\u0007\"�������p�\u0004�\u0010\"�\\�'\u0019�љ���WZ�mj�^���/�r|�\u0010\u0002psȹ>A\b�8A����\u0019�t\u00104'�`\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���`\u0000\u0000\u0006�:F�\u0000\u0000�G(��`\u0000\u0010T�\u0016o�k�c�a\t��p\u0000\u0001�\u00194d3\n�&�\r��3\u0013���*lPc\u0006�\n0(\rf\u0003�\u0005�\u0004�\u0017F\u0003\u0010\u0003�\u0004�\u0014F\u0006�\f\u0006\u00038\n�\u0002(\u0006F\u0000h\u0005�@\u0013+�\u0000t\u0004\u0003��@���-�\u0000]�`R�MQ��KE�k���L3\u000eԿJ�2��M��P�����=Z��Uk,��+[�\u001a��.\u001d���9e�]�jᎻ̲��8q�\u001c��˺�xh\n\u0019V�J\u0006���c���0�G�J��,�T4%�\r<$\r\u000e\u000e�E����X�w�����\u001cSy33���M�??m�DC\u000f2�C�\u001c\u0010�2&\u00113\u00132n\u0003\u0016)�\b{\u00185�)��\u0003\u0018\u0017��p\u0005��\u0000�����-�6�,���P�I@+�\"\\��%t�0�̭��Ƒ�ʥ��wg-eM^�5��֗SZ�xF�٦�W�֦�7gXZ�R��o/�̷�8�-㬿/ǝ�g )\u0002$�\u0011*\"${\u000e�\u001f,��0Kg��>X\u0017e�\u0003\u0004�ړ\u001a?_�q3\u0006(\u0018c\u0001�)\u0013\u0003�\f\u0001 ;�@�0(@\u0001*\u0000\u0006\t\u0000\\�\u0013\u0000�_�\u0000>g\u000b ��a��\fIDh4�1���=\u001e�;�D��B�\t����ʒ!9iO\u000e]�DxF@�\f\r$�\u0018\u0000\\$�r��%�\u0016\u0003��9�Fl�������`*�a\u0018\u001d�b��Vp�\t:a1��`�\u0004�`7\u0005�`�\u0001n`1��`Q\u0000���z`$�\t\u0012�yKGaiB��o�\ru9����\f���'>�\u001a/\u001f��:|�NC��N���}X�\u0016JZ\u001e���\u001fψn\u0013hT�\u0014�\b��Nk\u001c�\u0013X�i�K�Ů�\u0016�z\u001d��*\u001a�\u0002�*�_&���4�kroj\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0002Q\u0013ŋ�Q�d\u0003\bp�8\u0010<�\u0012/�)B\u000b��U��(@\f< �LH��N\u0010��\u001a`n����  5\u0018\u0002�&�\u0000�S\u0013�\u0018H�$(�b��9��+{�2\u000er\u0000��2�GɓJ�������������E�{��\u001fa��#\n�~��\u0018\b`�\u0018+\"\u0017\u0007\u0003�\u0016\u0000P�Q\u0018,08\u000e��\u0005\u001f�1�T�@\u0014I�lIcd��Y�%\u000fb�W˽OFW\u0000\u0017o���7n��}\u001f�U�zY�������ǫ�y_���\u0006\u0018Z\u0018Ƴ3 ���HF%�\u0013�\u000eHCF\u0004\u0018\na��\u0018\u0006@1\u0018\" !�\u0005`\u001a��\u0000��pť\u0003#i/\u0000�\u0002���a��\u0010\u001cjSrL��:H��P�x\u001b\u0012,%\u0002�A\u0004l4zEM\u0018����I� �+\u0015\u0004ȥ�`��{�\u0015G/TC`\u0012��g�u������\u00008\u0001�\u000e[�ܫ��>!a�\u0018\u0011��\u001e\u001a�2\u00129�|\u0003��8\u0001�\u0018\u0010#\u0000`\u0001�.#\u0016S$\u000419RNV�\u0017!S�\u001aq0���I逤\f��S\b!������KY�\bҵf��_�\u001d�\u001b���\fd,\u0001\u000f\t�Ҋr�\u0016��w�M����7�[���l�����\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0003x\u001bC��y�n��pL8\u000f�G\n\u000f�\u0001��!A��1�N\f0Vߖ?*F�0�\u0001�0�CV\b\u0005\u0014��\u0001��6\u0000X\\\f`\u0001�_\u0019�\f��\u00100\u0001W\u0014�^�̱�1\u001c�>�����\n5��~�^\u000f�?\u0018�]\\��I\u001e�X�܊�:E�Z��w���I�����S���[���1\u0019I�2WsT<\u0013G�0q��0nA�0���\b\u00004�0\u0000���\u0014\u0002\\��Q{��H&��_�(�uF#�2�PYv\u0005̺��\u0017]�@d64T�\b���΋��P(kO��1�߳/Ρ[����������'�\u001f-�Q�n>٦\u0005�a�E��H\u0014)��\u0011!�\u0000\u0002Y�*\u0003��`\u0001���\u0000\u0004���1\u000eʋ'I6 \u000b�r����\u0016N`<7i<�@bdc�-⧖����=�Y��D�u�R\u0010W�*�e\b�,��#��T�9\u0007��v����QT����C�\u001a�\u0018t!癮�n\u001c{$@\u0018\"�6�\u001a��A����q�=���$�AF�!�\b��)�F'I�cV���n�0��8���;+�ƿZ8\u0016��cj�1ů��o\u0013ԧ�L�w\u001c��P誒�'\\�3{��\u0016�.�tޣ��\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0002�\u0011C�}�\u0000j�\u0018`��\u0000\u001fvA\u0018\u0019{\u0000\u0003�H\"�/P\u00002\u0011\u0001^0o4f6U�S1\u001e�\u00130\u0003�L0S\u0000�09��0\u0000�m0\u001c�\u0006\u000e\u0000��\u0000@�$U�֤?N�\t!l4\u0006!�æ7�i����n�/����_����U�5��_]��l��\u0006=@[�>��I�H�\u0013�\n�\u0011�\u001e�\u0006@-\u0006\u0002�\u0006�\u0003�\u0014��?�\u0000P��@*�J\u0010\u0010\u00021��@D\t\u00014\u0005�����^��H1��\u0018��\u001c�����o��UV\u0000?���ekz�W�$�\u0010����Wo��Lr\u0000�}6�\fa�O\u0000�\u0018LD\f5���Ȳ<X\ff�m��\u000f\u0003T\f\u0015� �˓\u000f�\f%p�\u0000��\u0004�\f\u0000�(���\bT\f#�H@�q\u0010�\fА����\u0018�\f\u001d��\u0000ѹU\u0003\u0005`�\fԯ�1 \u000f\u0000��\u0003\"@d\u001b\u0019\u0000�\u001e\u0000�l\f\u0003\u0001�0&\u0006�8\u0001\u0004�x���\nP\"�L\u0001P\u0002\u000b\u0000�hO\"�$ès���A\u0003�NQ\u001c��\u0017Q1\"�0.\u001a\u0013�b�D�O\u0017Ȫ�&RI3D\u00107k\u0015��|�b����� ���\u001fJ�fk�*�wA��{2I��Z����3և���u2+W_W�_W���}/R�������\u0006�ha�d\u0011\u0001�\u0006dB��e���\u0006)b��b��\u0006\u001dxH�a�\u0003�\u0006r�-\u0000`z\u0006P\u0006\u0016й�`7��\u0006\b�\\�a��Z\u0006\u0019���i��h\u0006;x��hY�p\u0007]4��\u0012@w�p\u001bx\u0000\u0006\u0003�\u0001�\u0000 a@(\u000b\u0006��!�1pt\u0000�@�l-H���\u001aX�\u0014\u0001 \"�\u0000���\fp\u0004\u0006\u0000�88�g�L�\\.\b&l&$�\u0002\u0014Ar��E��D\u000b鎡�.���p�b]�. �t�\u0017\u00104+�yT���ކ�R\u000e̚h�JZ(k�;ڥl�\nR���_�d��������.���]���uz�����]x\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0005�:B�~�\u0000�\u0007h0��\u0000\u001c�\u001d\u0006\u000f�K��8�����0�͚1�f�6W\u0005Q1`\u0003�0�\u000411l\u0005\u001d7M�\"0�C�0��\u00160\t\u0001o0e�\u000b0�\u0002s0\u0018\r\u00191?\u0003�1:\u0004`8�\u0003�0��G06�'\u0003���ª@0�$\fB[\u0003\u001f\u0004@��0�\u000e!�\u0019\u0013\u0016M���c*'P�DII\t��(`�J�g��Ó7GB�R��V�B����Lp%S2����.?B�S �\u001f�W��7�2Ͼ���\rԇ�Ocڕ�W�\u0019\u0015q}\u001c�D^�\u0015����\u0002#�|��\u001c�\b*�\" ��WA��?��\u0018\u0004�t�\u0016\u0002\u0011�T�\u0004��\"\\�#�'��\u000e�\u0018ȢY\u0018k`�\u0019t�h��((�\u0010c��\u0017�\u0006+\u0004���-[ѼjG�S�\u0010\\\u000004�C�u?��b�M��e������~���:���/���]�����\u001dʴ�/��[�z���Y�������A`\u0004\u0005Y�!�m�d�B�\u0006�U�mIh\\\b�\r R,˚\u0017X�G���u�$r�`��\u0007aBl�uƘ\u000b�\u0019�n�\u001c���\u0018��/�r\u0018J��\u001c/�P�h�s\u0018\u001c@\u0011���0\u0019�Q0�@�\u0014C���\f���&8�#j|�\u0011\b��\u001e\u00024\u0002\u00041��\b����\u0004�\u0007\u0006\u0000p\u0001��W��f53$�\"\u000e���(�\u0003$@\u000f�\"�� \u0001Z\u000e࢓�Mɳ$K�\u0017\u00195�f�)\u0019\u0000$!377Nftݎ��\u00137M&Z��5&�7^�wS7R\n�Z�e �ޒ�nu��������ȃD=Y|���n+�\u0015\u001a���&��t��[Z����_W]tF�]��f\u000b��y���k\u0010D�$�7f\u0001�b�\u0011�B'�9J\u0006\u001eh\u0014�\b�\u0015\u0006\u0004�\n�\u0002�\u0006&\u00018\u0011f\u001c�\u0016�|8|f\u001a�\u0006�CЦ\u001d�c�\u000b(5�\u0007H\u001b&\tP\u0019�C5\u0018\u0017 \f��@/�1�8���Th\r!�>�V�F�`\u0010�:<\u0003\u0004\r)���hv(\u00006�q����3�<���y{Ry��]UO�Sܞz\f\u0003bs�vdC��\"29�\u000b\"\f\nRe\u0017c\r�s&\u001e�m粚�\u001fy�ݍ^�wE��c�S�.ښ�=�9��Wu]݈[�c���f��7W�y�\u000bv�Gt����\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���`\u0000\u0000\tyUB\u000b���ĉh�{�^ �\u0011\u0002\u000f�\r�T !\u0005��p\u0003\f)��������\"�̯\"�\ft���(A$NQ�n�L\u0000 L\u0014�\u0015\f\u000e`\u0014�\u0011�D�*`6L;\u0002���0%�(�mM�v�\f\u001bPG�\u0016\u0000G�\u0005�2\f\t�*L,�\u0018��r\u0015�2`\u0007�\u001c\n\u0000�\u000f�\u0002\u0010\b�\u00000\u0006S\b��@\u0006�2\u0013�\u0000\u0010\u0001\u0000\u0016��wFc\u0000�\u0000\u0006�w�Ơ*\u0000[в\u0011���FC\f=�N�^#rK,��'�3�-��������\u001d�\u0004�A=^�\rgA��\u001d\u0004��q�^���j�t�r��L\u0011\u0005P�Z�����\u0011�T��ue\u0013y�H�U�\u0017jԕؿ-��~��_��-w��5����nE���a�� %g�\t\u0007D\t�_Z�a0�\u001803ت��_\u0010��l�+\u0015�x�izF�\b\u0000%A��m�링���˂�\u0010�\u0018\u0004�i�M�\u0018r����K�\u0016�ɀ�\u000b\u0018�\u0002\u0011��;��\u0004хҩ��P\u0011��]�\u0011����\u0003�\u001e�ч�\u0001���1�j]&\n}:�&\u001a��F��J\u0004�1\u0001�\fQ\u0018��u��n�һ�IO��ᡫ�ɇ��\u0007ة!7�,�<��A\u0004N��\u0012�2]�>���EϘi�\u001f؋���5C�twOAk�u~�����Rlr�0,�������?]���Y��\u0014��\u000e^9��?)��\u001eq��\r��\u001aG���dɅ4\u0013���\u0001\u0019��\u0003q�T\u0000q��\u0012ሐ?Q��\u001a���*9�L���\fɃJ\u0005\t�:\b��J\u000eQ��\u0004��0\u0002x\u0014\u0000�\u0000\u0018\u0000�\u0010\u0000H�\u0000\u0000<X\u0000\"���\u0011#w[���_\u0016*`\u0016�\u0018<\u0000dm�p�\u0000\u0006�`C�\u000fճ��ޕX�w\u001cu�g*p0\u0002\u0011�k\u000b\u0012l,\u0015b��~���HBk@�)�j\"#��4�8��\u000bL��\u000f�ꮴ��x\u001f\u001d9�+�E�D4ܺ潴�se_�����?���s<�\u0010�]�RM����~�\u001a7�L�ŵ��D�W�������̈́�!�\u001c\u00079�z\b���\f���\u0012y�\u0000\n9�x\u0001Y�\u0014���\u0014\u0002��\b�\u0001\u0004\u00053\u0001P\u0005C\u0006\f\u0015�\u0002��\u0013\u0010�#�\n\bn�M�(S\r�\u0018�\u0003�\r�\u00024\bs\u0002h\n#\u0007l\u0004�\u0001|\u0001��\u0004\u0014e��ݛ\\�:�E�l�C,`\n\u0002��\u0000�ۓ�.�F�kT�`�\r��v�\"�\u0007��s�{a��\r�u��lm�ws�m��~�O�Z�%� \u0010T��\u0013#�on��.\u0000\u001e*�w@X�g^�e8r\u0019��^�I�\u0006��\u0016\u0013@ŎY�\\��\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007v����+r�\b\u0000�n\u001b\t=\u0004\u000f�Kˠ� A�-�0[�'0K�m0L��0\u0019�+04\u0001\u00120��+4�g~0�A�0Q\u0000�0&��00��0�\u00160S\u0003\u00122bAY0�Kx;�Jq1�A�0Y\u0000\u000f\u0015\u0002���\u0005L�Q\u0002\u0000��\u0001(�\u0012\u00004�K���M;��R��4�x�\u0001�,�\u0000�\u000fR�T�i\u0010\u0002Y���=��߭��E�E2��Y�\u001f�\u000e��`W#�ҙIѦs\u0016�F*1U\n[��k��nʫFch�V)h�s���>��\u001d�\u0011)VDg�ԨB;�ЦDU3���gaS�.��nw4�6��r�\n�\u001d\u0016U=J�\u0019\u001eEe\u0018���\u0003l��\u001d�Å\u0001��\u0012\u0001��\u0006\u0007\u0000��\u0018d�\u0014b��p\b��J\u0003\u0010�L\u00010��\u0001\\ O\u0003\u0001�R�+L\u001b�\u0007\u0000l�\u0005](3\u0002p c\u0002�\u000b�\u0002$\u0004�\u0002�\u0002�\u0007�\b�P\u001fc�\f)��\u0017��|u�Y\u0019�`\u0000y@\b��=*7��ɀ\u000e�Wu����,2�n�S�ձ�\u0015\u0011\u00113\\���\u0001(5��a�-&��f��SX�i��ާ���ꐹJ�����������I��)*t���bV�\u0011o\u0019\u0015��v���C݈�˭�c�ܲ=�ޑU�$쑹7��_E\u001d5m\r:Ϲ��HL\u0019�dL;\u0010\f�\b�\u000e�\n�\u0002�\u0019�]\rZF�L1 6�\u000bp\u0019L\u0006p\u000b�\u0007 \u000e\f'�&�\u0004�F\fc��\f\tr�Lwe1�\u0006 ��\u0006�2�\b`\u0010���0�\u0000o(\u0004��\u0002�*͢�x]����))��f\u0000@\b\"�\u0001�Z�yql*���,k��Y�|�]*�=\u0014��wUUP���|�=�Ͳ�T;f��Q�S^b�٬zn|�W(���ޮ\u0013�O2v��(ڑ-��\u0017R�������S���?ԓKl\u0016��\u0006��\u001aȐ/�\u000e�g�$8\u0006&\u0003\u0010\bF\u0003�\u0017f\u0007Pl��:�f\u0002�/�\u0002X\u0011f\u0002h\u0002&\u0002�\u0002�\u000fh1�\u0013)��\n�C\u0006\u001082'ٵ�d�\u001c�\u0017@�`�\f�\t��b\f\u0000�\u0000@\f��\u0012{��GdVi�����Z�\\\u0017���5�fŪ�Ws��n������k��nvM���کz�#L%�����x�tt΢]W\u0014ȷ�=���\u001b�C�殯V�z8oq0�Uk�n)���/�����\u0019�u.���j�u퇹�\\�o�mq�eT�s3-��L�\u0010�tɊ~�\r(�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007��@\u0003�+p�q���nZ��\u0002\u000f�m�WG�\u0001�\r�0\t\u0000�0\f��18�\u0018\n\u0000*`5\u0000�`́Nol�pa���`y\u0000�`\u0016\u0000�`\u0005�za\u0003\u0002\u0000`,\u000f�b���a�\nlo\u0019%�b-\u0003�`���`M��`R\u0001�`�T`+�Z\u0002\u0000\u0011L���S��j�*���`\u0004\u0000\\<\u0001��\u000e}��Ű�u���\u001c�kZ��~2�\u0018R�\u0019\u000eVs\u0019�@\u0000Vu:fc\u001dh͜�!��=�B�бd���\u0012U9�8���;�]HK�̗dr\u0015\u0011�QK\u0014��\u0015).U#��]�󪔦�vY]���/Ub���cܔ�9\n���\"3;\u001d\u001d��BR�q\u0013\u0001\u0010\f�\u0001\f*�\u0016L\n� \f&\u0000P\u0012\u0006\u00068i&BC_�\t8,�\u0003�\u0010�\u0002�\t�\u0004H\u0010�\u0016p\u0000�\u00169��C�1�\u0006�d&� I�\u0012�\n&\u0003h\u0001d\u0000\u001a�\u0001�7\u0003@\u00190\u0002�\u000b`Q\u0018{<w߻vb\n���T�\u001d\u0000\u0014�\u0002�>x-)bm���ￆ=���m�ǒ뿫����\u0012�$\u0006��l�\u0013L�)ԥZ�\u0015�^�9�.��v����������޷17Dk,Ѓ�t�:D�����I,�s\u001d\u001c\u0010�Q#�U�\"&���V�Z�-FE3\u001c��V��\u0013\u001d%�K�sn�����RR`\n��`b\u0001@aހl\u000e\u0002��}\u0000��P\u0000�۔8�¦\u0001@�}\u0001D�\t\u0001d�\u0003\u0002(��\u0002���\u0017��s\u0000T\u0013 �-\f�Ç\u0001���\u0000��\u001e\u0001��\u001c\u0002��_\u0000p�3\u0000y\u0013]��m�\u001da�kvŗ�\u001a\u0001�jJ�g\u0019�%�����[����\u001cӽ�\u0015\\�C�\u0014��i�0����{�\u0014R�2;�6[J��S�؞gN�\u0018���\u0006�u?����O�������#��5�H\"}9snBF˼�q\u0002���5f�i\u0014�n�Y���\u0000>0%\u0002�0��P0\r\u0000\u00100\r@�0/\u0002L1G\u0015\u000f0S\u0000�0\u0013�i0\u0004@I\u0002\u0000�`ʀRa0��d�\u0001\u0006`p��n�f\u001b�<<\u0005%�0(\u0001�\t\u0010\"\u0016\u0003�k\"���o�<�:�\b4�\u0010\t�ZM��c2,��r�����\u0002s!\u001d�8}��G�\r���b\r\n\u0011!%�w�\u0016!�\u0013EO/'ߛ+�@�8�/Vʚ��U_�\r\u0010�*{��\n\u0019�����9�D��\u0005]%�Ρ��m\u00155x[b�\u001e��TIK�\f�'8�\n�D\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007Q����\u001br����n]�\t\u0002\u000f�m��G \u0001�\u0019�\b\u0000x��\u0010@�o\u0002\b�\u0000S\u0001p\u0006�\u0005�\u000f\u0003�${����\f\u0000\u0017\f\u0000@!�\u0001@0L\u0007 Q\f\rq[\f!\u0000s�\u0003�1L��(\f\u0010�@�W\u0013\u0000�`O��`�\u0000�\u001c\u0006�\u0003�,�Ȑ���4\t\u000f�Ln�a�\u0000T\u0001q�\fb�\u000e¯q�������YT�\u000e��w'\u000f�aƍ�ls\n{��\u0019�\u0011*5α�l d�F\u0013Q�62��B@v�R!�%�\t���\u001d�-D��>.��R2\u001emD��ګfoװ�.B���T VK+�\u0019�{���(R\u0004�j�O�\u0011�4G%k\u0005��\u0004ˊ�P`#\tXa!�4 \u0000��2\u0000��\u0001\u0006�̝Qp��\u0003L��\u0001��>\u0000��-\u0000t��\u0002d��\u001b��\u0002\u0002��S\b����\f+C��D\u0015�\u0012�\u0004F\u0003\u0006\u0015@^(\u0000�\u0000\b���2�:q(\u0011ߏX��yCJ�b�p�\u001a/;ܳ�Y������uz�V��]���/���\b|ًi�2�/�v+bє)�#�\"/����U-���|�L>.�J���͝��|ly�}�5�*��w5�-�&%�Z�jc7�7kƷ�}�hh}z|���\u0013\u0015g�^|ɬ�|�@��t\u00003\u0001�/#\u0005\u001c\t#\u0000\u001c\t�\u0000�\u0001#\u0003@\u0003#gPHc\u0003�\u0003C\u0001�\u0001�\u0000�\b\u0003\u0001,\u0005S\u0002�\n�\u0002$2�\t�\u0006�\t�&\u0003��k3\u0004-C\u0018�c1\u0003\t�\u000b�0�\u0001�\u0005P\u0017`�\u0000�\t\u001f�\r\u00002Ӕ\u0000(�\u0005'J�~ޙu$\u000fP\u0010\u0007�lRZM�Z�v�B3=��Y�mɛw%3����\u000e\u0010;���栨@l\u001c#�Q&y\u000b\"��r=J�7b\u0017r���a2�e�*��f��\u001c�\u0015y�N\u0014]�gU�ȕ$���m\u001c�Tȴ�VR:�uO������؎��\u001dP�H�U�d]#��\b\u0000\u0013\t�&0\u0015\u0004\u0003\u000b��0&\u0006�\b!\u0002=���\u0010p�03\u0004�\n�N0:\u0003�\u000e�-1���J�\u001f2\u001e\u001d�\u0010��0�\u001dC\u001c0�1;\u0005#\u0005��0\t\u0004\u0003\u0007P\u00110\"\u0001p�\r!.\u0018E�\u0001P�\u0000\u0010\u0000.k8F5�\u001e��2\u0003\u0000�Je��J��-\u001d\f\u0011v?\u0001L�z޲�S:[�\"���a~���s\u000f3�u\u001eLKD�����\u001b��Q��\"*��v�\u000e�r��#�l���~��)���D\\V|��O���fgݗ̟��ݶx�W޼�|�������*��e�?��}n����[�U?�@W@\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007R����\u001br�q���nZ��\b�w\t��\u001a!\u0001�=p\u0005\u0000`:\u001a���\u0002���\u0000\u0011��\u0000邦\b��>q���\u0003A�$\u0002!��\u0002A�^\u00049��\u0007a��\u000bI�l\by��\u0019��i�\u0018Ԃ)�`(\u0018\u001b\u0001� 2�\u0002A��\u0006\u0000\u0000%b2�i��6�ÐSK�t�2X�p\u0012\u000f\u0001��Q���K,�׵��1�,y�����z\u0012jl\n��Ȝ⋾O\u000b\t���\u000f\u0004�e\u0007%۠�1E�$s�\t)_3���d9\\�UH��l/�E0�ū\t�\u0012�PCWg'fwZ(��3����Z�+*�\u001a�$9\u001c��)�$-\u001b23\u001dO�٪\u0005(�,��\f\n\u0005\\`�\u0000|\u0017\u0001���\u0000���\u00064��;H��\u0001���\u00008�F\u00000�!\u0000��f\u00014�\b4l��\u0004���\tD�e�\fEA��\u001e\u0001\u0000\u001cH\u0006!\u0002p`\u001c\u0001\u0003 \u0006��^1\r��\u0013rK�]Y\u0001��\u0010\u0000���k�'fL_._�8[�\u001d厲���mO�ͨ��F#l�ŒT�:��Y5�q��/�;��ϰU\u001d��K�E���\u001f�6_ݶ��υ#\u0010���\b������ּL��\u0011��6c�27��f�C-l�m�g�|j3*�W��q]�m�>\u001ffw�\u0015�\u0017���\u0018\u0000\u0000\u0000 �H\u0007\f\u001d�0Ð\u001a�'�\u001c��a\f?Y��\u001b\r!Ŝ��\rL\u0014\u0001���p̄l�9L;�4\u0000�11�<u�\u0007\u000e�q\u0002���&\u001e��\"كE\u0001�\u0000Ƀ� �w\u001e\"Àb�\"\u0018\u0007\u00174x\u0002@d8����H3B���dΊZ&5����=/|9r���0�AK~�\u0003.�Mzb��q����y���}��X���2\u0016\r��\u000e0��\u0018\u0016ʽ��1TIY�8,���+�䠡�q�Ԟ8�\u001c�ΧR�({\u001d�M�N\u001a���\u0000\u001a0C\u000e#\u000f \u00060�\u0010�\t��0�&3���1E\f\u0000�-0�\t�\u000b�h0\u0002\b3\u001f�K2C\u001a�\u0007�07�\u0004�\u001a��1O\u0006�\u0006�20\u0015\nQ!C0\u001a\u0000�P.\b\u0005�*\u0019\u0001\u0010�\u001fP@h\u0006�\u0000;\u0013\u0004\u0000Rx�\u0002@\u001dM���\u0000y0\u000e&�T\u0000T.\u0019U\u0000�h]\u0007I73�p�bC�õ)�BXQ��W\u0012w��}�=�\u0013Y���H\u0013Oy��g\u000b�<O<M��d\u0013\u0012\u0005���EM\\.��5�\u0001�ZLX���/��sǆ\u0005��cċ\u0017\"Y�!@i�p�d_UN(� �Fq�\u001b���\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007p@��Crا\b w�\\\\�<�\u000fxm���\u001fA�\u0019�\u0000�1��)�~\u0004���]\u0018\b���\u0000��]�����\u0018\u0001�ك�\b�\bA��)\u0018,\u001bI�\u0000\u001c�=���[\u0014\u0018�A��o�_�!��\"�c\u00029��\u0018�\u001b\u0001(�\u0003�\u0005@���\u0004\u0002�:\u001c\u0001O�\u0013a�ʬ\r�^5�\u0014\u0000ť\u0003ڒ�K/\rj���\u0011�ȧ��zUOY巀KD\u0014sg\u0012��P��g0�\"�\u000bU\u001bw�-v�L�,�[E��M|薶���'<�A�\u0014�IU\u001a%D�]����\f��\u001dw\u0015ݍ�h��FX�k\u001d\u001f@Z�%�\u0013\u001bIz/\u0001h\u0010�����>\r�`\u0010\bcy�hp^e�Pc�f\u0018����\u0019R;��7�(<��\u0014��F\u0017�bcZ3#F\bn\n\t�E\"\u001c`�\u001cf\u000f�0`X\u0003d��` \u0003��\u001d%\u0000�\u0000\u0010\u0002\u0016\u0000$_J��J�$�\u0001�Y�/�\u0016g�\u0000\u0001oS�>���%$��\u0000���\u0004��i���1�g���~kZͶ�m4��6�%f�V�\u000f�9�������w'r�\u001dW\u00176p�W=��E��!���.��D�\u000b�|���㥹�\u0007j�8�\u0000�Vc�ܗ�Y��\u000f]���'�`\u00030\u001a\n�\n@?0.\u0001��\u0014\u0018\u0018\u0007i�\u0001\u0010\u0018!\u0001Yu�\u0000\u0014�\u0007H\u0000����LK@X�0z��\u0007��H\u0014L\u0016@t�,\n��\"\u0001S\u0000�\u0007z�_\u0007�\t}�ڙ�zU3R3!\u001a\u0000d`�n������o۫Kn�2�r���J���\u000bD\n�^�j\u001cY\u0011+�t.H\u0011�<F�4|*\fL�;�т��\u0004F�\f¤PmP��5v\u0018{����$2@�f��F|�WG*�\u001c���F%G�r\u00137!QEj!�\b\u0010ߝs�;E��L�i�p�h~@�)+��K�� DU,�\u000f�\u0004� \u001fL\u0001�h�4\u001e\u001bScEC0�\u0003Ҩ\b�\u0001\u0011��\u0006�\u0006��\u0010Ԛ.�a�y^�\t/Q�\u0010Y�\u000b\u0000�\u0010\u0000\u000f\u0002���\u0015�\u0001�>�8Qz�\u0014��V�_}]��\u0004�\u0003S΃,Z�2�\u0016<�\u000b�����\u0014unkq�Lm\u000b槸�Ȅmmy�\u001a�Π995\bRM�{\f���\u000f�萝���ﳯO����\u0014e�\u001d�\fF\\��/Y\u000f\u0013�����\\\u001eF\u0016Ih�_�b��ZΦ(�sq\u001c{d\u001b]��6\u000512�ta�v�!�Qt��Y�:��\u0017��{�Z�j-�wGw�\u0014M�\r$\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u00074�>��3r��\u0007�{�n\u001c�@�\u000e��ì�\u001f\u0001�\u0019�A�\u0001\u0010�0<\u0000�\u0018\u0002\u0015\u0000\u001ct2�e�,��\u000f\u0002�\u0002��@\u0000\u0012\u000b�\u0006��1�\f\u0013\u0004\u0013�8Om\u0013\u000e��0\u0002\u0003�`\u001e0:\u0001�\u000b\u0010\u001a\u0012\u0004���s)��jaI�\u000e}�\u001f\u0018\u0002Wvř��޸O0�n�\\���3��I�&\nw\u001fu؅��\u0015\u0016E���\u0014\f�(Nq�UP|Q��BG�զ�N|�Lx�g\\�F$�^��pNj�\"̳_c�.���[r�Z)f�Li�{ҵ���q6C�#x�'Ŗ�Y5\u0015*O\u000f#�M����7��U��2��\u0010,��@�A�pT�0\u000b\rq�\u0003P\"�\u001c���\u000b\nqm\u0004`\u0010`\u0004\u0003c��aXZ\u0006�`La�\u001fF�ʊa�\f�\u0007 v`\"\u0003&\u0002�8`�\u0000\bW\u0002[��^R}{u���ؐ\u0000\u0003\u0011�v,�L�\u0018gZ��9��1��y�=\u0019�P�+`�\u001e�=\u0013�����8I\u000eZ\u0010�+&x��0����#��G����\u0005-\u0001�\u0017�ܺRK��\u001f8�w���\u0004�\u000bT�k�\u0013\u0007��I��u\u0013�&�\n�O$�j�\u0007)'*\b���\u0018X��\n�v�<���dl���*3O�1\u0014��-��fJ\u0012'�\u001a��, }�E%��`Q�L\u0011.ѐ8@J�\u0015�\u0018\u0004\u0013��e�\u0001\u0002�J\u0001\f6%M�\u001e\f���|ژ�\\'�\u0011\u0001\u0000��\u0006�\u000b�|�x\u0001�\u0000���I��9g�b3~�z4�J;\u0016�p��0����X�\\��\u0017h�ߵM����\u0015ɖ�D��\u001d��:x0\u001bw\f�����B�<\u0011^w�\nj��K]՗\u0017�G7�4\u0016�D��S�mn{�*�n\u001d��b�ڠƒ�=�ˌ�6;\u001e��1���:�L��\f�8Lܛ|\u0002S�KSu|�V�\u001aE�\u0018T�_�)�TQWf�}��!��\u001b��l�p/ɂ�\u0001��&`t\nf�B�`�\u0001�@5id���P�������'�sG�\u00141f\u0005@\u0004\u0000\u0000��\u0015\"\u0002\u0016\u0015\f�nS=�e{U�˪���\u0000�\u0014o+Rۯ��\u000e�k+\u001d���匭^��n-�j̜&��F}�t��n\u0010�s4:�����R&c\u0018\u0001�3@f3\u0016��O���T\u0012�v\u0011��W��\u0018��\bJ�\"\t�0�\u0003ɞ�0��dF\u0010�짪�7\t1�5\u001e���'�v�vw)�n�]\u001a�2d��\u0002�6���\u00061��9��iH�\r\u0016��`�����4�\u001a)\u001d4�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0006��?\u0003�3r�\u0007�{�n\u001a�@�\u000e��ïǞ�ޥ��`\u0000�\u001c9�`�\u000f0\u0000Z67s\u0006\u0001�@\u001a�\u0013\u0001&\"�\u0006\u0014\u0014\u0006���`\u0010��C�b\u0004\u0000�\u0007 \u0006`\u0002\u0002�\u0000$\u001a\u0002u�5\u001d�϶r�kY~\\�@X\u0000�����و�X��U��e�u�a��h{���/Q�\u0005����\u001b�T�չ�^c7�U�3����lȖ\"�\u0018��ޫP���z�d;~��y�\u000e�M\u0007C-E\u001f\u000fQ�\u001d�Ք�8�7OiC�$�@͚��\u0012��\u0015���V{��N���9\u0015t�]�\u0015*kmȦ�)\r��\u0001\u0000|�:�\u0010�\u0004�\bA�М\u001d�\u0010�\n�#�\u00004�\u0007�\b�\f`�\u000f\u0006\u0002�\u0012{B�b�J\u0017\u0001�\u0012�\u0001��C*�6Svuj~��\u0005�刨\u0016�r��g(�&�6�X����5W�e-��H\u001c�-ŚX�3\u000fҞN�E�&BE\u001e.�Vz\u00049ZY�PF\\��@��c��'�\u000eƠr\u0016�A2�ӟ:�,�ɒ���H\u0017��\u0016ET�\u0002\u0007[j'��\f���ә虎��^\u001e\\%kI�\u0013�t`�E�H�9�(a+ܚ�!\u0006�n\n\u0019��qg\u0010bHRx\u0004�'���B�\u0012m�N\u0010�1\"'��80\u0004U0\u001f�0D\u0013VŚ�BD\t\nHfxZb��j�ef\u0013 �`\u0004\u0000(�`\u0018\u0001`�\u0016\u0000�m=�X��3��Z�l%�Vϝ�޹O�~{ξ\u0017�RU��6���\u001e���I)�u�4׵�2Ѣ��[�\u000b����!���[�5\u0019x�y.˛CZ'\u0010��RӉ\"ɓ��c�YnJ� C�T�\u001c_Fcf4�jTZ\u0016��b���7�G��\u000b[R�MUշ����&��\u001e�e��r�W��\u0006R5�YH�J]\u0001�R�Ib\u0001\\�����-�;�X�E1��5�\u0018\u001d1\f\u0010���!r��6\u0005����k�ν[�g�7t�Y\u001d.SQ,k�[�\fl�,������w^Ջ�dcP`�*�֒��\u001b%/FX�A]q;�>\n\"B����ZJ�#�\fť\"�+�u �KM0�Y����Ut�\"cqr�M��b�a[9\u0017�����n$���P�dJa�ڵl��KvP�36\u001de�R�ܔ1�Jفrub�\u0017\r#s1˹�E���$E2q�I9��\u000f�Q\u001fOsM�\u0004i,z�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007u�>\u0003�3p�R\u0007�w�n\u001d�8�\u000e��˲ǟAޙ�r�\u0004\u0005\u0007��\b�3\u0001\u0004�o�3\t���-$١� \u0001�iA�����)�\n\u0018\u00186�فp\u000e\u0018\u0011\u0000q�(\b�\u0006\b�\u0004��w��\u0015y�\u0018�\u0014ի�P��k�G�ڜ�Ξ�\u000b�g�X��x�7�&5�G�\u0014y�I�6�#��}\u0001\u001f��4⫓'\u00079�2\u0019\b\u001b�y�(��I4\u001d\u0004|�%�b��\u0015�j\"}��K\u000fB�KS����\u001c�\\�cn�\u001cA�\u0003�+G�# dqH�\u0010mSs��\u0006BN�\u0005*q�\u0011�)K[��i�\u0018�\u000e�M\u0014R��\nBH$HD,ؽ�N�P\u001b�\u0016Z�d\u0004\b\u0010��(�0\r\r�U�L\u000b\u0000�{\u0013z���\u001dO`wpb(Np\n�\u0006%ÄC\u0006\u0000C\u0004@�0X�n\u0013�=EOVԚ_MV����\n�5�s\u0015g1�Z{�OXʷ{v)�%5:}�1(q�<��N-e�+#G���X� q�`6,��\u0017vR\tjU7(�8��\n��\u001c4��x\t��w1�]Or�RF\u001eY�9��a��\f! �\u0019\u0003� �\b\u001cA��d\f\u0017RLԫ4e �X\"V�\u0001ǡc�ɇ.4X\u000f�1���tҞ��\n=欁BYf\u0015JW�6��\u0005\u000b\u0014\u0018� �\u0012\u001d\r\u0000Bq\b\u0012#\u0001\f\r\u0001N\r�\f4\r�+\u0000IB�\b�\"c\u0004�E`��p�A�Ι\u0002�]�8��\u000b@Br`�\u0001�\u0007�\u0016`\u0010\u0000�(L\u0000�>�\u0019�ڄ�m\\͎��\u0000��đ\u0016�ˇ)��ۼ���7WYF3�_�\"����H�ܴ\u001c̈́�s\u000e.�L��PN��R��s�\u001aRM�U��U*[z^6��,��Q���R�\rʶ���\u0019F�:1�FDr٫k(�F�4��y��ƥjO�\u0019���-��hƷ�i�J,1�g]k�Vi��O4Hr�*\u0018���\u001a�sK��L8��|$\u0011\u0001A�\u0001@``\u0014n$�b`V�\u0005�\u0013\f@�\u0010\u0004S\u0006�Q�T΂�����p��T�!<\u001a\u001c\u0018�5�\u0002e\u0003\u000e\u0003\u0012N�qPT�O�\u001aik�\u001b���\u0014\u0004\u0001\u000b�H�;v���|����!j�����t���o\t�����\u0018ԕ���i7*��L�6���rnU��v��\u0015���ɓ\u0017uw&�/\f�Q�M�ls\u0018�ha,�F-�\b��,\u001a\u00172�Ґ��ؾ_����c\u0016ھ�\u0001����\u000f��af�1S�e�ҭ�:&\u0011�\u001f�#]���٦���j��.ǀ\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007E��\u0003�3p�\u0012\u0007�w�n\u001d\"@�\u000e��úǟA�\u0019��x4\r/%\u00030\bX=#_0�\u000e*\u0002�@\u001a�\u0007\u000b�5���\n�\u0018\u0005�\r�\u0006\u0017��\u0013\u0003�����$\f>��zÝ皞U��v��=əi $������\u0017;t��Z���.O]��\u0019�)��\u0001S�T�.9�w!�9&��\u0007m\u001b�pcO���N�>h\u0018�&b�5��d��\u0017PS���e(�\"UZ�C9۵�g,���I\u0012&UB\u0011��ȱ\u000f.a�2\u001f���Ix\\��jrxIE�*\fʜ���56<���<�\u0002L�x�;)�vY�t�h�W���+�rfN%@�IQTp27.�0\u001c\u0014F�\u000bx�0\u0014�:d�l�3\fլ�\f(��\u0000\b\u0006\u0001\u00008\u0006\u0003� L@֢�F�e~]3�9A.�\t��\u000b\u001e\u0001[\u0012�T�4�\u001b���u^�v�/p�A�i*]Q�y�'�ѧմ����%*�}�Է\t��s(��+EU\rf\u0018q�\u0007�\"��K[�\u00100�<��Y��Ώ@��:G�v3\nS�s����Jl$\r�\u000e{$dd��\u0017$�y,�\u0011\b\u0018��<�3��aw\u001a�\u0011GKI7\"΃�g\u001a��ᖑɫ4�&\u0019h\u001e��mfF\u0003!�\u0010\u000b�a�1�Á�4pA@8\u0001\u0018\u0002\u0000\t\u0002�P|�Ql��,��X�c\f��t\f]�\n\u001c\u0018�/\u0018\u0006\u0018�\u0012\f\u0006\b��L\u0000\u0001\u0005A���Қ,;dj.��.w.ht\u0000j0{\f��P�y#�R����a��g���ϓS�P�=��C��_�9\b�2���aN^�\\{�Y�\u001fRַY�8��v\u001a�\u0013D�7��\u0016���1+ۉ�(������u3a՗El]\u001e�>��N��G�S����Mx�Xr�<Ӫq���m�-����\b�.)\u000e�S�ݷ6�ԧo!\fw�uA��x\b\n�`�LF)�\u0001,\u0018�*�\u000e\u0000\u0018\b\u0018\u0018 \u0012�^\u0014��b�lH�\u0000�V�\u00141\u001a\u0004s\u000bPk0\u0000\u0002\u0010\u0000%\t\u0004\u0004�\u0014\u0001\tW\u0003$zI�\"�r���x�uI\u000bX2�\n��\u0014��/`Vi\u00039\u0012���˚�2�֕�Qv�q��N�G;j�\u00170�[N\u0019\tC����B6t|)��y(\u0015/jA��k ׷m�R\f�\u001b9)�U\u0019檱)roL�vBM\u0015/�����\\�Bi�9\n���G�(C]\u0017.�]Z��wy�\\d/穃�[<<\u0016H����?��'��Z-����񧓙@\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007|�>��3r�\u0011��s�nZ�@�\u000ex�ûH\u001e�Υ��\u0005\u0002&\b\\\u0000\b\u0003\u0018\\\bqKxb\u0000�<\n\n�\f(`1\bZ�\n��lJ\u0005F$ �`~\tF\u0006�>\u001c\u0003&\u0004`L�@P\u0000\u0000�\u00004\u0000�\u0000\u0019!�\u001f\u0007�\u001av��}ܛ�ɘC�\u0018�T��X�T�\u0012�jL崜��S��Xt�hT\u0006\"yͭ\t��\u001bD㝉:m�\u000f�d\u001b\"?�N�MM��o e�\u0017)D2��L�ʽ��m�t���lY\u0016!\u001bf\u0016�I��-򅒒O\u001bf�uW��fMI\u0019\u0007�d\u0010,3Ca\u0018R�L6\u000b�Y\u0018�9�H�4�$�\\��򲬲\u0005QX�>�{Z��Ѽ�����8h\u0012`\u0001\u0001�\u0001f\u0012\r�..c\u00111�@@Pp\u0014`V7\u0014�\u0016�i\u001ckL�vP\u0018�\u0012\u0018\f\b�\u0005�\"���X h\u0000ə�;��\u0012*,���5�]�;[���^G��/�#�\u001e��f[SXٔ公>]r���o�M�s\u0012X\u0005���a��Z2k2~�UC\rq\u0013r�ց\u0012�q�\u001aMc\f�$w?��ʙO\n5\u0012\u0005�E�U�lĒ[��_\f�Ӭ�7I\u0014G�\u0001m���g��Ȣ���\u000bCJk�9�\u001bNw׆ݙ��aU7�r�iZd��32�00\u001d\u001c�Tx��j�����+\t\u0001�\u0005�}��\u0011=2�X�\u0018SB\"�0$\u00010P\u0001+�6\u0005\u0002�xŨ#��v\u0019Z�5j��Բ��\u0007�jV�\u0001evAf�;��\\����̻Ɠ˨\u0010�5��\u0002�m\u0019��W�1H�W��E&\\�T[��: �֊ͺ-\u0006}�k\u001br�{ƽ �,�d��i�F�\"n%SU�Y\u0015\u0016�]���\r���\b��e��EF�\u0016CWI*���sZp�\u000b�>�CJ\u0019\nB��[�f���}s\u0005\u0018�o<\u0014�FԚ\u000e�&�A(�z�6\u0004.p\\beK@a\te0[���[����§:\u001f\u00181�\u00030\u0010\u0004-an�C�\u001c��?�O���j5�32�m?��^w,�V+�;K��b�9\\���\\�\u000eٔ\u0011�9\u001a\u001e0�-\u0016��Vh.l�n\u00120Y\u001aYh�pԢ�S�R��4q���2�\u001e�4���Xê�\u0015\u0011�d����R'��==j��qW\u0015\u001dCH�2Sze��DR��=Bb���$A9[\u0005��Te�Q���T\u0013�G�e��5a&%&\u0015H������\"���M�6\u0012��\u0011B�7���\b�����\u0018�\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007\u0013�=\u0003�3r�Q�s�n^V@�\u000ey-å�\u001d��%�Tk-�UbF\u0002\u0018���\n ˠ4�0X\u0004�ϰ�<�\u0011c��3\u0018\u0005#\u0007��\u0000@s\u0002�C\u0013A\u0004��˻���K��v�.6�5��S:�\u0007~�v����v�\u0017���Ļ���:$'M0\t�2Ptl\u001a\u0013R��\b頒��0���w��)(����y4��X9:��Dk)�$f�x�\u0014W�xJq�^��%\u0012�>9\u001761��$9\"W�>��M�ZX���Y\rI�\u0014�\u0004R`����\u001aX\u0004�Ό7\u000bpfIܹy rga�\u0019�GBgш�\u001e�q�a*�?�\nM����;\b\u0006\u0019J\u000e$0S�\rBL.\u000e2 ���\u0003+-��bF�\u0012 =Y�@!�I��aMMMR�4������d\u0006���v3n�+{}��˲ƛS�����U��\u001a8.ґ��I$�\u0017Ц�ڋlb�<�嫱\r�\u001b}�)\"��\u0014�z�&��~Ռ�\u0013-^1!c-\u001c�V0�]\n\u0004�\u0014^�:�\u0017���l\u000b\u000f?�\fnD�$���.A&�F顛sG\u000e�yn�p� ��=�������I$t�RW\u0010S1��$���Z��-\tn&�Jrel�_\t�E\u0017TY8��?W�\u0014�\u0011\u0019 �j�\u0010�����`aC�T\"g����p\u0000���x\u0001\u0002�\f2\u0002�\u0000�����\u001a:�ծگ�ܥ�J\u0000LZSKR�l�ν�-���|��k�fg~�4�Si\u001c\u0015C�WChX��U%�k(���E\u0011{�H�\u0013'wB\u0015A!V�*KS�8�\t��)�s��Thʹ�,H��\raE\u000b2C���Ԑ�*ғ؃4�jMY�\u001cR�$\u0019et8��s\u000ef,�kJM8�\\Z�Xfq\u0014�'��u�\r+f�$��!gnKx�:\u001a\u0015-8$��g���M�s�^��T6�w5z�\n�*; �e�\t\u0005\u001a��<Cd��;���K�\u000e*\u00102��\"1�:\u001dkJڍ�zS��ƽLl�Ջ}ܥ����.MWΖ�X�7�b婪j�uq�W\u0012�*���Z�f���ې��/\u0010Zo�ȆiI5�ZVڬ�\u0012������R�WꜱcS�u��\u0005�\"�R\u0017*�6�\u0015�*֝f�I���oj\u0013-\u0018ȉ\u0013pU'�8�ڈ�%���-z�P�)j��̖\u000bmoƒD�֒',�e\u0002�j\u0010\"�hU,h�Ka��\u0013!Bʰb� �\r$���)h[��8�p\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0007l�7��Kr�R\u0006�oIn\u0002�,�\f��*\u0001\u001b��\u0000\u0001\b[,V̲�\u0001B\u0003����P\u0001��)����.b󱗸�7>&r\u0003i�D\u0004�\u001e\u0007\u0016\u0000ѠV\u0017z�{5��\\e�y�Y�\\ε�U�jfvUnSb��o�l�vuM�:���ĄTԈ�ƕ�y�(qb$1�M\f5fUg���L�őJRY�ԕ�ٵ�4�6u\f���l\b�����M\rb�o�i\f�����\u000b�����r5y$B���B�M\fR\u0000ī\n�\u0015Y�A���\u001c�䦅�\"f1Zp�E$ɡ�nIY&�\u000eF�ƵVVz\u001a�\"iX5H�m�\u0016}M\u0013]f�P0�&��I\u001c`��ib-P,\u0016���#��>w�\u001b ;����\u0014\u0010�\b\u001e\u0002\n�E��\u001a����--�ie2��B�[ۥ�K�uܻ��[,�����*�UȚU�X��\u0002D�*��%HB��H�\t��\"��'�1Ȑ��D*z�V1���Q�\u001cD�5R�b�$��=�,M+�\u00114�r��C)*)%��Ȑ��\\YU�lի\u0006�g\u001fx�DD�$S�2�R��,\"iT?��y(�ei\u001a�ȑ4��rV�ق$I���\\V&�K�JX4�l��*5�8Ш\\�\u0016՚�A\u0007F\u0012\u0004\"�AQ@�(\u0013\r�\u001dH��QL\u0012VOE2]\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000���@\u0000\u0000\u0000\u001a\u0001��\u0001\u0000\u0000\u0003\u00006�` \u0000\u0000@\u0004�\u0007�\u0000\u0000\b\u0000���\u0000\u0000\"u�H�e�uHu@\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("serve-static");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("botpress");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var sanitizeUserId = exports.sanitizeUserId = function sanitizeUserId(userId) {
  return userId.replace(/webchat:/ig, '');
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("sillyname");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = __webpack_require__(3);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _users = __webpack_require__(4);

var _users2 = _interopRequireDefault(_users);

var _db2 = __webpack_require__(2);

var _db3 = _interopRequireDefault(_db2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var outgoingTypes = ['text', 'login_prompt', 'file', 'carousel', 'custom'];

module.exports = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(bp, config) {
    var outgoingHandler = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event, next) {
        var userId, user, typing, conversationId, socketId, message;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(event.platform !== 'webchat')) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', next());

              case 2:
                if (_lodash2.default.includes(outgoingTypes, event.type)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', next('Unsupported event type: ' + event.type));

              case 4:
                userId = event.user && event.user.id || event.raw.to;
                _context.next = 7;
                return getOrCreateUser(userId);

              case 7:
                user = _context.sent;
                typing = parseTyping(event);
                _context.t0 = _lodash2.default.get(event, 'raw.conversationId');

                if (_context.t0) {
                  _context.next = 14;
                  break;
                }

                _context.next = 13;
                return getOrCreateRecentConversation(user.id);

              case 13:
                _context.t0 = _context.sent;

              case 14:
                conversationId = _context.t0;
                socketId = user.userId.replace(/webchat:/ig, '');

                if (!typing) {
                  _context.next = 20;
                  break;
                }

                bp.events.emit('guest.webchat.typing', {
                  timeInMs: typing,
                  userId: null,
                  __room: 'visitor:' + socketId,
                  conversationId: conversationId
                });

                _context.next = 20;
                return _bluebird2.default.delay(typing);

              case 20:
                _context.next = 22;
                return appendBotMessage(botName, botAvatarUrl, conversationId, event);

              case 22:
                message = _context.sent;


                Object.assign(message, {
                  __room: 'visitor:' + socketId // This is used to send to the relevant user's socket
                });

                bp.events.emit('guest.webchat.message', message);

                // Resolve the event promise
                event._promise && event._resolve && event._resolve();

              case 26:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function outgoingHandler(_x3, _x4) {
        return _ref4.apply(this, arguments);
      };
    }();

    var knex, _db, appendBotMessage, getOrCreateRecentConversation, _ref2, getOrCreateUser, _ref3, _ref3$botName, botName, _ref3$botAvatarUrl, botAvatarUrl;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return bp.db.get();

          case 2:
            knex = _context2.sent;
            _db = (0, _db3.default)(knex, bp.botfile), appendBotMessage = _db.appendBotMessage, getOrCreateRecentConversation = _db.getOrCreateRecentConversation;
            _context2.next = 6;
            return (0, _users2.default)(bp, config);

          case 6:
            _ref2 = _context2.sent;
            getOrCreateUser = _ref2.getOrCreateUser;
            _ref3 = config || {}, _ref3$botName = _ref3.botName, botName = _ref3$botName === undefined ? 'Bot' : _ref3$botName, _ref3$botAvatarUrl = _ref3.botAvatarUrl, botAvatarUrl = _ref3$botAvatarUrl === undefined ? null : _ref3$botAvatarUrl;


            bp.middlewares.register({
              name: 'webchat.sendMessages',
              type: 'outgoing',
              order: 100,
              handler: outgoingHandler,
              module: 'botpress-platform-webchat',
              description: 'Sends out messages that targets platform = webchat.' + ' This middleware should be placed at the end as it swallows events once sent.'
            });

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function parseTyping(msg) {
  if (msg.raw && !!msg.raw.typing) {
    if (isNaN(msg.raw.typing)) {
      return 1000;
    } else {
      return Math.max(msg.raw.typing, 500);
    }
  }

  return false;
}

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "uploadsUseS3: true\n#uploadsS3Bucket: bucket-name\n#uploadsS3Region: eu-west-1\n#uploadsS3AWSAccessKey: your-aws-key-name\n#uploadsS3AWSAccessSecret: secret-key\n"

/***/ })
/******/ ]);
//# sourceMappingURL=node.bundle.js.map