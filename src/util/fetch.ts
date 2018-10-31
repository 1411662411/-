import 'whatwg-fetch';
import { enCodeChar } from './encodechar';
import {
    message,
    notification
} from 'antd';

const TIMEOUT = 30000;

/**
 * 带有timeout的_fetch
 * @param fetchPromise 
 * @param timeout {number} 延迟时间
 */
const _fetch = (fetchPromise, timeout) => {
    let timeoutAction; 
    const timerPromise = new Promise((resolve, reject) => {
        timeoutAction = () => {
            reject('timeout');
        }
    })
    setTimeout(() => {
        timeoutAction()
    }, timeout)
    return Promise.race([fetchPromise, timerPromise]);
}

interface ResponeData {
    errcode?: string | number;
    status: string | number;
    error?:  string;
    msg?: string;
    errmsg?: string;
    data?: any;
}



/**
 * fetchFn 对window.fetch的封装，方面统一管理
 * @param url {String<URL>} 请求地址 
 * @param data {Object<JSON>} 请求参数
 * @param option {Object<JSON>} 额外的fetch可配置参数
 * @param type {Number} 错误提示的弹窗的类型（0为notification， 其他为message）
 */
export const fetchFn = <T>(url, data, option?: RequestInit | null , type?: 1 | 0) => {

    let json: any = {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'FetchRequest',
        },
        timeout: TIMEOUT,
        body: enCodeChar(data),
        credentials: 'include',
    };
   
    if (option) {
         const {
            headers,
            method,
        } = option;
        if (headers && headers['Content-Type'] == 'application/json') {
            option.body = JSON.stringify(data);
            headers['dataType'] = 'json';
        }
        json = {
            ...json,
            ...option,
        }

        /**
         * 如果method为get,
         * get方式不允许body传参，
         * 只能url传参
         */
        if(method && method.toLocaleLowerCase() === 'get') {
            url = `${url}?${json.body}`
            delete json.body;
        }
    };
    return new Promise<ResponeData & T>((resolve, reject) => {
        _fetch(fetch(url, json), json.timeout)
            .then(res => {
                return res.json();
            })
            .then((data) => {
                /**
                 * 约定 -1 为未登陆
                 */
                
                if(Number(data.status) === -1){
                    window.location.reload();
                    return;
                }
                if (Number(data.status) !== 0) {
                    if (type === 0){
                        notification.error({
                            type: 'error',
                            message: '提醒',
                            description: data.error || data.msg || data.errmsg || '请求失败',

                        });
                    }else{
                        message.error(data.error || data.msg || data.errmsg || '请求失败');
                    }
                   
                }
                resolve(data);
            })
            .catch((error) => {
                let msg;
                // console.log(error)
                switch (error.toString()) {
                    case 'TypeError: Failed to fetch':
                        msg = '请求失败';
                        break;
                    case 'timeout':
                        msg = '请求超时';
                        break;
                    default:
                        msg = '请求失败';
                }
                message.error(msg);
                const data = { errcode: 1, status: 1, msg, } as any;
                resolve(data);
            });
    });
}

export const fetchFile = async (url:string, file:File, requestData?:object)=>{
    let data = new FormData()
    data.append('file', file)
    if(requestData){
        for(let key in requestData){
            data.append(key, requestData[key])
        }
    }
    let request = new Request(url, { 
        credentials: 'include',
        headers: {
            'X-Requested-With': 'FetchRequest',
        }, 
        method: 'POST', 
        body: data, 
    });
    let json;
    try {
        // let response = await _fetch(fetch(request),TIMEOUT); //是否要增加timeout
        let response = await fetch(request);
        json = await response.json()
        // console.log('Async parallel+fetch >>>', json);
        if(Number(json.status) === -1){
            message.error('登录过期，请重新登录');
            window.location.reload();
            return;
        }
        // if (Number(json.status) !== 0) {
        //     message.error(json.error || json.msg || json.errmsg || '导入失败');
        // }
    } catch (error) {
        let msg;
        switch (error.toString()) {
            case 'TypeError: Failed to fetch':
                msg = '请求失败';
                break;
            case 'timeout':
                msg = '请求超时';
                break;
            default:
                msg = '导入失败';
        }
        message.error(msg);
        json = { errcode: 1, status: 1, msg, } as ResponeData;
    }
    // console.log('下面return json')
    return await json
}


export const fetchFileL = async (url:string, file:File, requestData?:object)=>{
    let data =new FormData();
		data.append('file',file);
        let request = new Request(url, {
            method: 'POST',
            credentials: 'include',
            body: data,
            headers: {
                'X-Requested-With': 'FetchRequest',
            }, 
        });
        let json;
    try {
        let response = await fetch(request);
        json = await response.json()
        if(Number(json.status) === -1){
            message.error('登录过期，请重新登录');
            window.location.reload();
            return;
        }
    } catch (error) {
        let msg;
        switch (error.toString()) {
            case 'TypeError: Failed to fetch':
                msg = '请求失败';
                break;
            case 'timeout':
                msg = '请求超时';
                break;
            default:
                msg = '导入失败';
        }
        message.error(msg);
        json = { errcode: 1, status: 1, msg, } as ResponeData;
    }
    return await json
}




