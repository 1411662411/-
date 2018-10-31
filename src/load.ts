import 'whatwg-fetch';
import { STATIC_DOMAIN } from './global/global';
const STATIC =STATIC_DOMAIN
interface script extends HTMLScriptElement {
    timeout?: number;
    timeouter?: any;
}
interface LoadscriptPromise {
    (url: string): Promise<any>;
}
interface OnScriptComplete extends EventListener {
    (script: script): void;
}

/**
 * loadscript
 * @param params {Array<string> | string} 加载路径
 */
const loadscriptPromise: LoadscriptPromise = (url) => {
    return new Promise((resolve, reject) => {
        const head = document.getElementsByTagName('head')[0];
        const script: script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.async = true;
        script.src = url;
        script.timeout = 50000;
        const timeouter = setTimeout(() => onScriptComplete(script), 5000);
        script.onerror = (e) => {
            clearTimeout(timeouter);
            console.log(e, 'reject');
            reject();
        }
        script.onload = (a) => {
            clearTimeout(timeouter);
            resolve();
        }
        head.appendChild(script);
    });

}

/**
 * onScriptComplete
 * @param script {HTMLScriptElement} script实例对象
 */
const onScriptComplete: OnScriptComplete = (script) => {
    // avoid mem leaks in IE.
    script.onerror = script.onload = null;
    clearTimeout(script.timeouter);
}



const selectUrl = (json, url) => {
    if (Object.prototype.hasOwnProperty.call(json, url)) {
        return `${STATIC}/${json[url]}`
    }
    return `${STATIC}/dist/js/${url}`;
}


interface Loadscript {
    (url: string, json: any, entry: Array<any>): void
}
/**
 * 递归加载js
 * @param url 
 * @param json 
 * @param entry 
 */
const loadscript: Loadscript = (url, json, entry) => {
    loadscriptPromise(url).then(() => {
        entry.splice(0, 1);
        if (entry.length > 0) {
            loadscript(selectUrl(json, entry[0]), json, entry)
        }
    }, () => {
        throw new Error(`loading ${url} fail`);
    });
}

/**
 * 入口
 * @param json {Object} md5文件
 */
const loadEntry = (json) => {
    let entry = ['manifest.js', 'common.js', 'index.js'];
    loadscript(selectUrl(json, entry[0]), json, entry);
}


const loadWebpackManifest = (json) => {
    const head = document.getElementsByTagName('head')[0];
    const script: script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.innerHTML = `//<![CDATA[
    window.webpackManifest = ${JSON.stringify(json)}
    //]]>`;
    head.appendChild(script);
}

if (!__DEV__) {
    fetch(`${STATIC}/dist/chunk-manifest.json?t=${Date.now()}`)
        .then(response => response.json())
        .then(json => {
            loadWebpackManifest(json);
        })
        .then(() => {
            return fetch(`${STATIC}/dist/md5-manifest.json?t=${Date.now()}`)
        })
        .then((response) => {
            return response.json()
        }).then((json) => {
            loadEntry(json);
        }).catch((error) => {
            throw new Error('load md5.json fail');
        });
}
else {
    loadEntry({});
}





