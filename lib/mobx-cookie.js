"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsCookie = require("js-cookie");
var mobx_1 = require("mobx");
var DAY_IN_MS = 86400000;
var MobxCookie = (function () {
    function MobxCookie(name) {
        var _this = this;
        this.set = function (value, options) {
            if (options === void 0) { options = {}; }
            _this._clearTimeout();
            _this.value = value;
            jsCookie.set(_this._name, _this.value, options);
            if (options.expires) {
                var expires = _this._expiresToDateTime(options.expires);
                jsCookie.set(_this._name + '-expires', expires, {
                    expires: options.expires,
                });
                _this._startTimeout(options.expires);
            }
        };
        this.remove = function () {
            _this._clearTimeout();
            _this.value = undefined;
            jsCookie.remove(_this._name);
            jsCookie.remove(_this._name + '-expires');
        };
        this._name = name;
        mobx_1.extendObservable(this, {
            value: jsCookie.get(name),
        });
        this._syncTimeout();
    }
    MobxCookie.prototype.get = function () {
        console.warn("[MOBX-COOKIE] The 'get' method has been deprecated.\n      Observe the value directly, e.g. store.cookie.value");
        return this.value;
    };
    MobxCookie.prototype._expiresToMs = function (expires) {
        if (typeof expires === 'number') {
            return expires * DAY_IN_MS;
        }
        else {
            var nowInMs = +new Date();
            return +expires - nowInMs;
        }
    };
    MobxCookie.prototype._expiresToDateTime = function (expires) {
        if (typeof expires === 'number') {
            return new Date(+new Date() + expires * DAY_IN_MS).toString();
        }
        else {
            return expires;
        }
    };
    MobxCookie.prototype._syncTimeout = function () {
        var expires = jsCookie.get(this._name + '-expires');
        if (expires) {
            this._startTimeout(new Date(expires));
        }
    };
    MobxCookie.prototype._startTimeout = function (expires) {
        var timeoutDuration = this._expiresToMs(expires);
        this._timeout = setTimeout(this.remove, timeoutDuration);
    };
    MobxCookie.prototype._clearTimeout = function () {
        this._timeout && clearTimeout(this._timeout);
        this._timeout = undefined;
    };
    return MobxCookie;
}());
mobx_1.decorate(MobxCookie, {
    set: mobx_1.action,
    remove: mobx_1.action,
});
exports.default = MobxCookie;
//# sourceMappingURL=mobx-cookie.js.map