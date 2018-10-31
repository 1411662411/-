/**
 * [parseAddress 分解json地址]
 * @param  {} data [description]
 * @return {[type]}      [description]
 */
export const parseAddress: (data: Object) => Map<any, any>[] = (data) => {
    let maps: Map<any, any>[] = [];
    let index = 0;

    const fn = (data, value?: any) => {

        data.forEach((v, i) => {
            let area = v.area;
            let list = v.list;
            let parentId = -1;

            if (value !== undefined) {
                parentId = value;
            }
            if (list) {
                list.forEach((v, i) => {

                    let name = v.name;
                    let value = parseInt(v.value, 10);

                    /* 创建对应的哈希表 */
                    if (maps[index] === undefined) {
                        maps.push(new Map());
                    }

                    /* 如果是第一级 */
                    if (index === 0) {

                        /**
                         * 设置Map对象，格式如下
                         * {
                         * 'A-D':
                         *    {
                         *     'A-D': {
                         *        1: "浙江"
                         *        }
                         *     }
                         *  }
                         */

                        let obj = maps[index].get(area) || {};

                        if (obj[area]) {
                            obj[area][value] = name;
                        } else {
                            obj[area] = {};
                            obj[area][value] = name;
                        }


                        maps[index].set(area, obj);
                    }

                    /* 如果是不是第一级 */
                    else {

                        /**
                         * 设置Map对象，格式如下
                         * 1对象上一级的id，类似parentId
                         * {
                         *   1: {
                         *    'A-D': {
                         *        2: "杭州"
                         *     }
                         *   }
                         * }
                         */
                        let obj = maps[index].get(parentId) || {};

                        if (obj[area]) {
                            obj[area][value] = name;
                        } else {
                            obj[area] = {};
                            obj[area][value] = name;
                        }

                        maps[index].set(parentId, obj);
                    }

                    /* 递归children */
                    let children = v.children;
                    if (children && children.length > 0) {
                        index++;
                        fn(children, value);
                    }
                });
            }
        });
        index--;
    }

    fn(data);
    return maps;
}
/**
 * parseAddressName 按照id解析中文地址
 * @param  {Array} data 对应的id
 * @param  {Map} map  对照的Map
 * @return {Array}      中文地址
 */
export const parseAddressName: (data: any[], map: Map<any, any>[]) => string[] = (data, map) => {
    if (data.length <= 0) return [];

    let arr = data.map((v, i) => {
        if (i === 0) {
            for (let val of map[i].values()) {
                for (let key in val) {
                    let obj = val[key];
                    if (obj[v]) {
                        return obj[v];
                    }
                }
            }
        }
        else {
            let id = data[i - 1]
            let obj = map[i].get(id);
            for (let key in obj) {
                let obj2 = obj[key];
                if (obj2[v]) {
                    return obj2[v];
                }
            }
        }
    });

    return arr;
}


let throttleTimer: number;
export const throttle = (fn, delay) => {
    var timer = null;
    return () => {
        clearTimeout(throttleTimer!);
        throttleTimer = setTimeout(() => {
            fn();
        }, delay);
    }
}

/**
 * transform 对旧版数据结构进行转换
 * @param {Array} data 数据
 */
export const transform = (data:any[]) => {
    const replaceData  = JSON.parse(JSON.stringify(data).replace(/"citylist"/g, '"list"').replace(/("c")|("d")/g, '"children"').replace(/("n")|("p")/g, '"name"').replace(/"v"/g, '"value"'));
    const deep = (data) => {
        let listArr: any[] = []
        for(let i = 0, l = data.length; i < l; i ++) {
            const value = data[i];
            const { list } = value;
            if(!Object.prototype.hasOwnProperty.call(value, 'list')) {
                data[i] = {
                    list : [value]
                }
            }
            else {
                for(let value2 of list) {
                    const { children } = value2;
                    if(Array.isArray(children) && children.length > 0) {
                         deep(children)
                    }
                }
            }
        }
        return data;
    }
    return deep(replaceData);
}