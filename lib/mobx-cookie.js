'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _mobx = require('mobx');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MobxCookie = function () {
  function MobxCookie(name, options) {
    _classCallCheck(this, MobxCookie);

    _initialiseProps.call(this);

    this.name = name;
    this.options = options;
    this._timeout = null;

    (0, _mobx.extendObservable)(this, {
      value: _jsCookie2.default.get(name) });

    this._syncTimeout();
  }

  _createClass(MobxCookie, [{
    key: 'get',
    value: function get() {
      return this.value;
    }
  }, {
    key: '_expiresToMs',
    value: function _expiresToMs(expires) {
      if (typeof expires === 'number') {
        var duration = _moment2.default.duration(expires, 'days');
        var ms = duration.asMilliseconds();
        return (0, _moment2.default)().add(ms, 'ms').diff((0, _moment2.default)());
      } else {
        return (0, _moment2.default)(expires).diff((0, _moment2.default)());
      }
    }
  }, {
    key: '_expiresToDateTime',
    value: function _expiresToDateTime(expires) {
      if (typeof expires === 'number') {
        var duration = _moment2.default.duration(expires, 'days');
        var ms = duration.asMilliseconds();
        return (0, _moment2.default)().add(ms, 'ms').format();
      } else {
        return (0, _moment2.default)(expires).format();
      }
    }
  }, {
    key: '_syncTimeout',
    value: function _syncTimeout() {
      var expires = _jsCookie2.default.get(this.name + '-expires');
      if (expires) {
        this._startTimeout(expires);
      }
    }
  }, {
    key: '_startTimeout',
    value: function _startTimeout(expires) {
      var _this = this;

      var timeoutDuration = this._expiresToMs(expires);

      this._timeout = setTimeout(function () {
        return _this.remove();
      }, timeoutDuration);
    }
  }, {
    key: '_clearTimeout',
    value: function _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }]);

  return MobxCookie;
}();

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.set = (0, _mobx.action)('[MOBX-COOKIE] Set', function (value, options) {
    _this2._clearTimeout();
    _this2.value = value;
    _jsCookie2.default.set(_this2.name, _this2.value, options);
    if (options.expires) {
      var expires = _this2._expiresToDateTime(options.expires);
      _jsCookie2.default.set(_this2.name + '-expires', expires, {
        expires: options.expires
      });
      _this2._startTimeout(options.expires);
    }
  });
  this.remove = (0, _mobx.action)('[MOBX-COOKIE] Remove', function () {
    _this2._clearTimeout();
    _this2.value = undefined;
    _jsCookie2.default.remove(_this2.name);
    _jsCookie2.default.remove(_this2.name + '-expires');
  });
};

exports.default = MobxCookie;