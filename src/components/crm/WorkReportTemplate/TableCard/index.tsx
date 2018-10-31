import React from 'react';
import { Checkbox, Icon, Tooltip } from 'antd'

import './style.less';

interface TableCardProps{
    title: string;
    disabled?: boolean;
    distinguishChecked?: boolean; 
    selectAllChecked?: boolean; 
    hasAll?: boolean;
    selectAll?: (checked:boolean)=>void;
    distinguish?: boolean;
    selectDistinguish?: (checked:boolean)=>void;
}

class TableCard extends React.Component<TableCardProps, any>{
    constructor(props){
        super(props)
        this.state={
            distinguishChecked: props.distinguishChecked !== undefined ? props.distinguishChecked : false,
            selectAllChecked: props.selectAllChecked !== undefined ? props.selectAllChecked : false,
        }
    }
    node;
    select = (e) =>{
        this.setState({distinguishChecked: e.target.checked});
        this.props.selectDistinguish && this.props.selectDistinguish(e.target.checked);
    }
    render(){
        const { title, hasAll, distinguish } = this.props;
        return <div className='crm-work-report-table-card-container'>
            <div>
                <span>{title}：</span>
                {
                    hasAll !== false && <Checkbox disabled={this.props.disabled || false} checked={this.state.selectAllChecked} onChange={(e) => {
                        this.setState({selectAllChecked: e.target.checked});
                        this.props.selectAll && this.props.selectAll(e.target.checked);
                    }}>全选</Checkbox>
                }
                {
                    distinguish !== false && <span>
                        <Checkbox disabled={this.props.disabled || false} checked={this.state.distinguishChecked} onChange={this.select}>按员工统计</Checkbox>
                        <Tooltip placement="topLeft" title={'“按员工统计”勾选后，会在第一列前面增加下属“所在团队”与“员工”两列，在最后一行增加“合计”行'}>
                            <Icon style={{color:'#BFBFBF'}} type="question-circle" />
                        </Tooltip>
                    </span>
                }
            </div>
            {this.props.children && <div>{this.props.children}</div>}        
        </div>
    }
}

export default TableCard;