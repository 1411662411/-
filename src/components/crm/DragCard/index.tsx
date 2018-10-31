import React  from 'react';
// import Draggable, {DraggableCore} from 'react-draggable'; // 可拖动

import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';

import { Row, Col, Button, Icon, Radio } from 'antd'
// const Option = Select.Option

import Card from '../Card'

import './style.less'

interface dragCardProps{
    title: string;
    isEdit: boolean;
    type?: 1 | 2 | 3;
    onClose?: Function;
    typeOnChange?: Function;
    id?: number;
    disabledType?: 1 | 2 | 3;
}
interface dragCardState{
    isShow: string;
    isEdit: boolean;
    type?: 1 | 2 | 3;
    key?: string;
}
class DragCard extends React.Component<dragCardProps,any>{
    constructor(props){
        super(props)
        this.state={
            isShow: true,
            isEdit: false,
            type: this.props.type || 2,
            key: new Date(),
        }
    }

    typeOnChange(type){
        this.setState({key: new Date()})
        if(this.props.typeOnChange){
            this.props.typeOnChange(this.props.id, type)
        }else{
            this.setState({
                type,
            })
        }
    }

    renderSelectType(type){
        const {disabledType} = this.props;
        return <Radio.Group 
            size={'small'} 
            value={type} 
            key={`${this.props.title}${new Date()}radio`} 
            onChange={(e) => {this.typeOnChange(e.target.value)}}
        >
            <Radio.Button disabled={disabledType && disabledType === 3} value={3}>大</Radio.Button>
            <Radio.Button disabled={disabledType && disabledType === 2} value={2}>中</Radio.Button>
            <Radio.Button disabled={disabledType && disabledType === 1} value={1}>小</Radio.Button>
        </Radio.Group>
    }

    close = () => {
        if(this.props.onClose){
            this.props.onClose(this.props.id)
        }else{
            this.setState({isShow: false})
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.isEdit !== this.props.isEdit){
            this.setState({key: new Date()});
        }
        return true;
    }

    render(){
        const { 
            isEdit,
            title,
        } = this.props;
        const{
            type,
            isShow,
        } = this.state;
        let span = this.props.type == 3 ?
            {
                xs:{span:24},
                sm:{span:24},
                md:{span:24},
                lg:{span:24},
                xl:{span:24},
            } : this.props.type == 1 ?
            {
                xs:{span:24},
                sm:{span:24},
                md:{span:24},
                lg:{span:12},
                xl:{span:8},
            } : {
                xs:{span:24},
                sm:{span:24},
                md:{span:24},
                lg:{span:24},
                xl:{span:16},
            };
        const select = this.renderSelectType(this.props.type || type);
        return isShow ? 
            <Col key={`${title}${this.state.key}col`} style={{padding: 2}} {...span}>
            <Card key={`${title}${this.state.key}card`}  title={title} fuzzy={isEdit? true : false} extra={ isEdit ? <span>{select}<span style={{margin:'0 8px'}} className='drag-handle'><i className='crmiconfont crmicon-tuozhuaianniu'></i></span><Icon style={{cursor:'pointer'}} onClick={this.close} type='close'></Icon></span> : null}>
                {this.props.children}
            </Card>
            </Col> : null
    }
}



export default DragCard