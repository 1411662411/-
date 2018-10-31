
/*
* @data 毫秒
* @type 定义输出类型
* */
export const formatDateTime = (date, type?:string) => {
    date = new Date(date*1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    if(!type){
        return y + '-' + m + '-' + d+' '+h+':'+minute;
    } else {
        return `${y}${m}`;
    }

};