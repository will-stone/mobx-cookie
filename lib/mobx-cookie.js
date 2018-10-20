"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsCookie = require("js-cookie");
const mobx_1 = require("mobx");
const DAY_IN_MS = 86400000;
class MobxCookie {
    constructor(name) {
        this.set = (value, options = {}) => {
            this._clearTimeout();
            this.value = value;
            jsCookie.set(this._name, this.value, options);
            if (options.expires) {
                const expires = this._expiresToDateTime(options.expires);
                jsCookie.set(this._name + '-expires', expires, {
                    expires: options.expires,
                });
                this._startTimeout(options.expires);
            }
        };
        this.remove = () => {
            this._clearTimeout();
            this.value = undefined;
            jsCookie.remove(this._name);
            jsCookie.remove(this._name + '-expires');
        };
        this._name = name;
        mobx_1.extendObservable(this, {
            value: jsCookie.get(name),
        });
        this._syncTimeout();
    }
    get() {
        console.warn(`[MOBX-COOKIE] The 'get' method has been deprecated.
      Observe the value directly, e.g. store.cookie.value`);
        return this.value;
    }
    _expiresToMs(expires) {
        if (typeof expires === 'number') {
            return expires * DAY_IN_MS;
        }
        else {
            const nowInMs = +new Date();
            return +expires - nowInMs;
        }
    }
    _expiresToDateTime(expires) {
        if (typeof expires === 'number') {
            return new Date(+new Date() + expires * DAY_IN_MS).toString();
        }
        else {
            return expires;
        }
    }
    _syncTimeout() {
        const expires = jsCookie.get(this._name + '-expires');
        if (expires) {
            this._startTimeout(new Date(expires));
        }
    }
    _startTimeout(expires) {
        const timeoutDuration = this._expiresToMs(expires);
        this._timeout = setTimeout(this.remove, timeoutDuration);
    }
    _clearTimeout() {
        this._timeout && clearTimeout(this._timeout);
        this._timeout = undefined;
    }
}
mobx_1.decorate(MobxCookie, {
    set: mobx_1.action,
    remove: mobx_1.action,
});
exports.default = MobxCookie;
//# sourceMappingURL=mobx-cookie.js.map