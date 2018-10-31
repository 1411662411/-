/**
 * Function formatMoney 数值转或货币格式
 *  -@param {Number} number 要转换的数值
 *  -@param {Number} places 保留小数点位数
 *  -@param {String} symbol 货币符号
 *  -@param {String} thousand 间隔符
 *  -@param {String} decimal 小数位符号
 * Return {String}
 */
export const formatMoney = (num:any, places?:any, symbol?:any, thousand=",", decimal=".") => {
    num = num || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "￥";
    
    var negative = num < 0 ? "-" : "",
        i:any = parseInt(num = Math.abs(+num || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(num - i).toFixed(places).slice(2) : "");
}
        