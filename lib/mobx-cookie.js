'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
  }

  _createClass(MobxCookie, [{
    key: 'get',
    value: function get() {
      return this.value;
    }
  }, {
    key: '_startTimeout',
    value: function _startTimeout() {
      var _this = this;

      var timeoutDuration = 0;
      if (typeof this.options.expires === 'number') {
        timeoutDuration = (0, _moment2.default)().add(this.options.expires, 'days').diff((0, _moment2.default)());
      } else {
        timeoutDuration = (0, _moment2.default)(this.options.expires).diff((0, _moment2.default)());
      }
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
    _this2.options = _extends({}, options);
    _jsCookie2.default.set(_this2.name, _this2.value, _this2.options);
    if (_this2.options.expires) {
      _this2._startTimeout();
    }
  });
  this.remove = (0, _mobx.action)('[MOBX-COOKIE] Remove', function () {
    _this2._clearTimeout();
    _this2.value = undefined;
    _jsCookie2.default.remove(_this2.name);
  });
};

exports.default = MobxCookie;