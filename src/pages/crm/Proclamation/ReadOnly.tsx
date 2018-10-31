import React from 'react'

interface ReadOnlyProps {
    time: string,
    title: string,
    content: string,
}

class ReadOnly extends React.Component<ReadOnlyProps>{
    constructor(props){
        super(props)
    }

    render(){
        const {
            time,
            title,
            content,
        } = this.props
        return <div 
            style={{
                minHeight: 550,
                background: '#fff',
                padding: 20,
            }}
        >
            <div style={{fontSize:18, fontWeight:700}} className='text-center'>{title|| '销售管理V3.0.3上线公告'}</div>
            <div className='text-small rt'>{time || '2018-03-13'}</div>
            <div style={{marginTop:30}}>{content || '销售管理V3.0.3上线公告销售管理V3.0.3上线公告销售管理V3.0.3上线公告'}</div>
        </div>
    }
}

export default ReadOnly