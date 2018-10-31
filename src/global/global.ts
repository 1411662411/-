/**
 * 环境变量，通过webpack传入
 */
declare const __DEV__;
declare const __TEST__;
declare const __BGALPHA__;
declare const __ALPHA__;
declare const __BETA__;
declare const __PRODUCT__;


const proxyApi = (oldValue, key) => {
    let proxyApi = localStorage.getItem('proxyApi');
    if (proxyApi !== null) {
        proxyApi = JSON.parse(proxyApi);
        if (proxyApi) {
            return proxyApi[key];
        }
    }
    return oldValue;

}

/**
 * java的oxt
 */
let DOMAIN_OXT_DOMAIN;

/**
 * php
 */
let DOMAIN_PHP_DOMAIN;

/**
 * wss
 */
let WSS_DOMAIN;

/**
 * 路由的path变量
 */
let ROUTER_PATH_TEMP;

/**
 * 核销
 */
let DOMAIN_HE_XIAO_DOMAIN;

/**
 * 静态
 */
let DOMAIN_STATIC_DOMAIN;

if (__DEV__) {
    DOMAIN_OXT_DOMAIN = "https://oxt.joyomm.com/admin";
    DOMAIN_PHP_DOMAIN = "https://devadmin.joyomm.com";
    WSS_DOMAIN = "wss://oxt.joyomm.com/admin";
    ROUTER_PATH_TEMP = "/admin";
    DOMAIN_HE_XIAO_DOMAIN = "http://hexiao.joyomm.com";
    DOMAIN_STATIC_DOMAIN = "//testnewadmindev.joyomm.com";
}
if (__TEST__) {
    DOMAIN_OXT_DOMAIN = "https://devbg.joyomm.com/adminweb";
    DOMAIN_PHP_DOMAIN = "https://devadmin.joyomm.com";
    WSS_DOMAIN = "wss://devbg.joyomm.com/adminweb";
    ROUTER_PATH_TEMP = "/adminweb";
    DOMAIN_HE_XIAO_DOMAIN = "http://hexiao.joyomm.com";
    DOMAIN_STATIC_DOMAIN = "//testdev.joyomm.com";
}
if (__BGALPHA__) {
    DOMAIN_OXT_DOMAIN = "https://devbg.joyomm.com/adminweb";
    DOMAIN_PHP_DOMAIN = "https://devadmin.joyomm.com";
    WSS_DOMAIN = "wss://devbg.joyomm.com/adminweb";
    ROUTER_PATH_TEMP = "/adminweb";
    DOMAIN_HE_XIAO_DOMAIN = "http://hexiao.joyomm.com";
    DOMAIN_STATIC_DOMAIN = "//testdev.joyomm.com";
}
if (__ALPHA__) {
    DOMAIN_OXT_DOMAIN = "https://oxt.joyomm.com/admin";
    DOMAIN_PHP_DOMAIN = "https://devadmin.joyomm.com";
    WSS_DOMAIN = "wss://oxt.joyomm.com/admin";
    ROUTER_PATH_TEMP = "/admin";
    DOMAIN_HE_XIAO_DOMAIN = "http://hexiao.joyomm.com";
    DOMAIN_STATIC_DOMAIN = "//testdev.joyomm.com";
}
if (__BETA__) {
    DOMAIN_OXT_DOMAIN = "https://tigert.joyomm.com/admin";
    DOMAIN_PHP_DOMAIN = "https://testadmin.joyomm.com";
    WSS_DOMAIN = "wss://tigert.joyomm.com/admin";
    ROUTER_PATH_TEMP = '/admin';
    DOMAIN_HE_XIAO_DOMAIN = "http://hexiao.joyomm.com";
    DOMAIN_STATIC_DOMAIN = "//betadev.joyomm.com";
}
if (__PRODUCT__) {
    DOMAIN_OXT_DOMAIN = "https://tianwu.joyowo.com/admin";
    DOMAIN_PHP_DOMAIN = "https://tianwu.joyowo.com";
    WSS_DOMAIN = "wss://tianwu.joyowo.com/admin";
    ROUTER_PATH_TEMP = '/admin';
    
    DOMAIN_HE_XIAO_DOMAIN = "http://hexiao.joyomm.com";
    DOMAIN_STATIC_DOMAIN = "//statictianwu.joyowo.com";
}


export const DOMAIN_OXT = proxyApi(DOMAIN_OXT_DOMAIN, 'domainOxt');
export const ROUTER_PATH = proxyApi(ROUTER_PATH_TEMP, 'routerPath');
export const WSS = WSS_DOMAIN;
export const PHP_DOMAIN = DOMAIN_PHP_DOMAIN;
export const HE_XIAO_DOMAIN = DOMAIN_HE_XIAO_DOMAIN;
export const STATIC_DOMAIN = DOMAIN_STATIC_DOMAIN;
/**
 * 外链的前缀
 */
export const _SELF = '_self';

export const _BLANK = '_blank'

/**
 * table分页的基本参数
 */
export const PAGINATION_PARAMS = {
    pageSize: 20,
    currentPage: 1,
};

// 1、存在跨域问题（不能使用取当前域名）
// 即使是使用，也得取到admin路径下，需用正则/字符串方法进行替换；
// 2、定义全局域名使用时调用全局变量
// 意义呢？没什么实际作用啊！一般不会轻易更换域名的...
// 3、全局变量自动化，使用node操作文件+正则匹配动态设置当前协议的域名
//


// 公测环境协议
// export const