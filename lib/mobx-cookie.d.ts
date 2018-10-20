/// <reference types="node" />
import * as jsCookie from 'js-cookie';
declare type TExpires = number | Date;
declare class MobxCookie {
    value?: string;
    _name: string;
    _timeout?: NodeJS.Timeout;
    constructor(name: string);
    get(): string | undefined;
    set: (value: string, options?: jsCookie.CookieAttributes) => void;
    remove: () => void;
    _expiresToMs(expires: TExpires): number;
    _expiresToDateTime(expires: TExpires): string | Date;
    _syncTimeout(): void;
    _startTimeout(expires: TExpires): void;
    _clearTimeout(): void;
}
export default MobxCookie;
