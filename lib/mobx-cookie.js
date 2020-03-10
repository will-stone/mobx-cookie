"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsCookie = require("js-cookie");
var mobx_1 = require("mobx");
var DAY_IN_MS = 86400000;
var MobxCookie = (function () {
    function MobxCookie(name) {
        var _this = this;
        this.get = function () {
            console.warn("[MOBX-COOKIE] The 'get' method has been deprecated.\n      Observe the value directly, e.g. store.cookie.value");
            return _this.value;
        };
        this.set = function (value, options) {
            if (options === void 0) { options = {}; }
            _this._clearTimeout();
            _this.value = value;
            jsCookie.set(_this._name, _this.value, options);
            if (options.expires) {
                var expires = _this._expiresToDateTime(options.expires);
                jsCookie.set(_this._name + "-expires", expires, {
                    expires: options.expires,
                });
                _this._startTimeout(options.expires);
            }
        };
        this.remove = function () {
            _this._clearTimeout();
            _this.value = undefined;
            jsCookie.remove(_this._name);
            jsCookie.remove(_this._name + "-expires");
        };
        this._expiresToMs = function (expires) {
            if (typeof expires === 'number') {
                return expires * DAY_IN_MS;
            }
            var nowInMs = Number(new Date());
            return Number(expires) - nowInMs;
        };
        this._expiresToDateTime = function (expires) {
            if (typeof expires === 'number') {
                return new Date(Number(new Date()) + expires * DAY_IN_MS).toString();
            }
            return expires;
        };
        this._syncTimeout = function () {
            var expires = jsCookie.get(_this._name + "-expires");
            if (expires) {
                _this._startTimeout(new Date(expires));
            }
        };
        this._startTimeout = function (expires) {
            var timeoutDuration = _this._expiresToMs(expires);
            _this._timeout = setTimeout(_this.remove, timeoutDuration);
        };
        this._clearTimeout = function () {
            if (_this._timeout) {
                clearTimeout(_this._timeout);
            }
            _this._timeout = undefined;
        };
        this._name = name;
        mobx_1.extendObservable(this, {
            value: jsCookie.get(name),
        });
        this._syncTimeout();
    }
    return MobxCookie;
}());
mobx_1.decorate(MobxCookie, {
    set: mobx_1.action,
    remove: mobx_1.action,
});
exports.default = MobxCookie;
//# sourceMappingURL=mobx-cookie.js.map