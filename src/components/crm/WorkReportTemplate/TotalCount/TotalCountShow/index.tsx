import React from 'react';
import './style.less';
export default ({number, content}) => {
    return <div className='crm-work-report-total-count-show-item'>
        <div>{number}</div>
        <div>{content}</div>
    </div>
}