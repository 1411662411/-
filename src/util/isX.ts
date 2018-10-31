/**
 * is Function
 * @param param {any}
 */
export const isFunction = (param: any): param is (() => boolean) => {
	return Object.prototype.toString.call(param) === '[object Function]';
}

/**
 * is RegExp
 * @param param {any}
 */
export const isRegExp = (param: any): param is RegExp => {
	return Object.prototype.toString.call(param) === '[object RegExp]';
}

/**
 * is String
 * @param param {any}
 */
export const isString = (param: any): param is string => {
	return Object.prototype.toString.call(param) === '[object String]';
}

/**
 * is String
 * @param param {any}
 */
export const isNumber = (param: any): param is number => {
	return Object.prototype.toString.call(param) === '[object Number]' && param === param;
}

/**
 * is Float
 * @param param {any}
 */
export const isFloat = (param: any): param is number => {
    return /^([+-]?)\d+\.\d+$/.test(param);
}

/**
 * is Array
 * @param param {any}
 */
export const isArray = (param: any): param is Array<any> => {
    if(Array.isArray) {
        return Array.isArray(param);
    }
	return Object.prototype.toString.call(param) === '[object Array]';
}

/**
 * is NaN
 * @param param {any}
 */
export const isNaN = (param: any): param is Number => {
    if(global.isNaN) {
        return isNaN(param);
    }
	return Object.prototype.toString.call(param) === '[object Number]' && param !== param;
}

/**
 * is Object
 * @param param {any}
 */
export const isObject = (param: any): param is Object => {
	return Object.prototype.toString.call(param) === '[object Object]';
}

