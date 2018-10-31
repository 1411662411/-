import React  from 'react';

import './style.less'

class Card extends React.Component<any>{
    constructor(props){
        super(props)
    }

    renderHeader(title, extra){
        return <div className='crm-card-header'>
            <div className='crm-card-title'>
                <span>{title}</span>
            </div>
            <span className='crm-card-header-extra'>
                {extra}
            </span>
        </div>
    }

    renderContent(){

    }

    render(){
        const {
            title,
            style,
            extra,
        } = this.props;
        const header = this.renderHeader(title, extra)

        return <div
         className='crm-card'
         style={style}
         key={title}
         >
            { title && header}
            <div className='crm-card-content'>
                {this.props.children}
                {this.props.fuzzy && <div className='crm-card-content-fuzzy'></div>}
            </div>

        </div>
    }
} 

export default Card