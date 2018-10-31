import React from 'react';
interface TextProps{
    color: 'red' | 'green' | 'orange' | 'blue' | string; // 自定义颜色 如： #f50
    children: any;
}
export default ({children, color}: TextProps) => {
    let isCustom = false;
    let className:string = '';
    switch(color){
        case 'red': className = 'text-error';break;
        case 'green': className = 'text-green';break;
        case 'orange': className = 'text-orange';break;
        case 'blue': className = 'text-blue';break;
        case 'cyan': className = 'text-cyan';break;
        case 'magenta': className = 'text-magenta';break;
        case 'gold': className = 'text-gold';break;
        case 'purple': className = 'text-purple';break;
        default: isCustom = true; 
    }
    return <span className={className} style={isCustom ? {color} : undefined}>{children}</span>
}