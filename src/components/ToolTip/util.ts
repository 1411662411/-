
export function isParent(obj, parentObj) {
    //判断obj元素是否在parentObj内部
    while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
}

export function getMousePos(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.clientX
    var y = e.clientY
    return { 'x': x, 'y': y };
}

export function getAbsPoint(e){
    var x = e.offsetLeft;
    var y = e.offsetTop;
    while(e = e.offsetParent){
        x += e.offsetLeft;
        y += e.offsetTop;
    }
    return {'x': x, 'y': y};
}

export function getOffsetRect(node) {
    const box = node.getBoundingClientRect();
    const body = document.body;
    const docElem = document.documentElement;

    /**
     * 获取页面的scrollTop,scrollLeft(兼容性写法)
     */
    const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    const clientTop = docElem.clientTop || body.clientTop;
    const clientLeft = docElem.clientLeft || body.clientLeft;
    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;
    return {
        //Math.round 兼容火狐浏览器bug
        top: Math.round(top),
        left: Math.round(left)
    }
}