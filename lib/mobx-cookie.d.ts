/// <reference types="node" />
import * as jsCookie from 'js-cookie';
declare class MobxCookie {
    value?: string;
    _name: string;
    _timeout?: NodeJS.Timeout;
    constructor(name: string);
    get: () => string | undefined;
    set: (value: string, options?: jsCookie.CookieAttributes) => void;
    remove: () => void;
    _expiresToMs: (expires: number | Date) => number;
    _expiresToDateTime: (expires: number | Date) => string | Date;
    _syncTimeout: () => void;
    _startTimeout: (expires: number | Date) => void;
    _clearTimeout: () => void;
}
export default MobxCookie;
