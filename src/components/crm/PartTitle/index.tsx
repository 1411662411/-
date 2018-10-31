import React from 'react';

import part from './steps.png';
import './style.less';

interface partType{
    title: string;
    part: 1 | 2;
}
export default ({title, part}:partType) => {
    return <div className='crm-part-title' style={{
        // paddingTop: 40,
    }}>
        <b style={{
            display: 'inline-block',
            marginRight: 6,
            width: 4,
            height: 18,
            backgroundColor: '#22baa0',
            verticalAlign: 'text-top',
        }}></b>
        <h4 style={{
            display: 'inline-block',
        }}>{title}</h4>
        <i className={`part${part}`}></i>
    </div>
}