import React from 'react';

import './style.less';

interface renderTitleProps{
    title:string;
    buttons?: any;
}
export default ({title, buttons}:renderTitleProps) => {
    return <div className='crm-title-container'>
        <div className='crm-title'>
            <span>{title}</span>
        </div>
        <span className='rt'>
            {
                buttons && buttons.map(item => item)
            }
        </span>
    </div>
}