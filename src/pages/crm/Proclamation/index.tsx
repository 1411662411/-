import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { message, Form, DatePicker, Input, Button, Row, Col, Spin } from 'antd'
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { DOMAIN_OXT } from '../../../global/global';

const FormItem = Form.Item;

import { getAnnouncement, setAnnouncement } from '../../../action/crm/WorkbenchConfig'
import { addAnnouncement, updateAnnouncement } from '../../../api/crm/WorkbenchConfig'

import BraftEditor from '../../../components/crm/BraftEditor'

import './style.less';

interface ProclamationProps{
    title:string,
    content:string,
    time:string,
    dispatch:any,
    announcement:any,
}
interface ProclamationState{
    type:string,
}
class Proclamation extends React.Component<ProclamationProps,ProclamationState>{
    constructor(props){
        super(props)
        this.state = {
            type: '',
        }
    }

    handleChange(){
        this.props.dispatch()
    }

    componentWillMount(){
        const search = location.search
        // console.log(search);
        if(!search){
            message.error('缺少必要参数');
        }else if(search.split('?')[1] == 'new'){
            // message.success('新增');
            this.setState({
                type: 'new',
            })
        }else if(search.split('?')[1].split('=')[0] == 'readId'){
            this.setState({
                type: 'read',
            })
            this.props.dispatch(getAnnouncement({id:search.split('?')[1].split('=')[1]}))
        }else if(search.split('?')[1].split('=')[0] == 'id'){
            // message.success('编辑');
            this.setState({
                type: 'edit',
            })
            this.props.dispatch(getAnnouncement({id:search.split('?')[1].split('=')[1]}))
        }else{
            message.error('参数错误');
        }
    }
    componentDidMount(){
        document.title = this.state.type == 'new' ? '新增公告' : this.state.type == 'edit' ? '编辑公告' : '查看公告' ;
        document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link')[0].innerHTML = document.title;
    }
    componentWillUnmount(){
        this.props.dispatch(setAnnouncement({}))
    }

    render(){
        const {
            title,
            content,
            time,
        } = this.props;
        const {
            type
        } = this.state;
        return <div>
        {
            type && type == 'read' && <ReadOnly
                title={this.props.announcement.toJS().title}
                content={this.props.announcement.toJS().content}
                time={this.props.announcement.toJS().announcementDate}
            />
        }
        {
            this.props.announcement.toJS().title && type =='edit' && <Edit 
                title={this.props.announcement.toJS().title}
                content={this.props.announcement.toJS().content}
                time={this.props.announcement.toJS().announcementDate}
                id={this.props.announcement.toJS().id}
                image={this.props.announcement.toJS().imgUrlList}
                isNew={false}
            />
        }{
            type =='new' && <Edit 
                title={this.props.announcement.toJS().title}
                content={this.props.announcement.toJS().content}
                time={this.props.announcement.toJS().announcementDate}
                isNew={true}
            />
        }

        </div>
               
            
               
    }
}

interface TStateProps {
    announcement:any;
}

const mapStateToProps = (state: any): TStateProps => {
	return {
		announcement: state.getIn(['crmWorkbenchConfig', 'announcement']),
	}
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Proclamation)

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
        } = this.props;
        let str = '<div>sadsadsad</div>'
        return <div 
            style={{
                minHeight: 550,
                background: '#fff',
                padding: 20,
            }}
            
        >
            <div style={{fontSize:18, fontWeight:700}} className='text-center'>{title|| ''}</div>
            <div className='text-small rt'>{time || ''}</div>
            <div className='crm-proclamation-no-reset-style' dangerouslySetInnerHTML={{ __html: content }} style={{marginTop:30}}></div>
        </div>
    }
}
interface EditProps{
    time: string,
    title: string,
    content: string,
    isNew: boolean,
    id?: number;
    image?: Array<any>;
}

//moment
class Edit extends React.Component<EditProps,any>{
    constructor(props:EditProps){
        super(props)
        this.state={
            time: props.isNew ? '' : props.time,
            title: props.isNew ? '' : props.title,
            content: props.isNew ? '' : props.content,
            image:props.isNew ? '' : props.image,
            loading: false,
            isToday: true,
            clickToday: false,
            now: moment().subtract(1, 'days'),
            hasTime: false,
        }
    }
    handleChange(content, image){
        this.setState({
            content,
            image,
        })
    }
    onOk = async () =>{
        this.setState({loading: true});
        const {
            time,
            title,
            content,
            image,
        } = this.state;
        if(!time){
            message.error('请选择公告日期');
            this.setState({loading: false});
            return; 
        }
        if(!title){
            message.error('请填写公告标题')
            this.setState({loading: false});
            return; 
        }
        if(title.length > 50){
            message.error('公告标题不可超过50个字')
            this.setState({loading: false});
            return; 
        }
        if(content.length > 10000){
            message.error('公告内容过长')
            this.setState({loading: false});
            return; 
        }
        let res:any; 
        if(this.props.id){
            res = await updateAnnouncement({
                id: this.props.id,
                date:time,
                title,
                announcementContent: content,
                image:JSON.stringify(image),
            })
        }else{
            res = await addAnnouncement({
                date:time,
                title,
                announcementContent: content,
                image:JSON.stringify(image),
            })
        }
        if(res.errcode===0){
            message.success(res.msg,1.5,()=>{
                browserHistory.push(`${DOMAIN_OXT}/newadmin/crm/workbenchconfig`);
            })
            
        }else{
            this.setState({loading: false})
            message.error(res.msg)
        }
        
    }
    disabledDate = (current) => {
        // console.log(moment().subtract(1, 'days').format("YYYY-MM-DD HH:00:00"),'----',
        // this.state.now.format("YYYY-MM-DD HH:00:00"))
        // Can not select days before today and today
        // current && console.log(moment().endOf('day'))
        // return current && current.unix() < now;
        // return current && current.unix() < moment().unix() - 3600;
        // return current && current < this.state.now;
        // console.log(current && current.format("YYYY-MM-DD HH:mm:ss") ,
        //     this.state.isToday ? moment().format("YYYY-MM-DD HH:mm:ss") : moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss"))
        // return current && current < (this.state.clickToday ? moment() : moment().subtract(1, 'days'));
        return current && current < moment(moment().format("YYYY-MM-DD"));
        // return current && current < moment()
    }
    disabledTime = () => {
        // return current && current < moment().hour();
        if(!this.state.isToday){
            return [];
        }
        let times:number[] = [];
        for(let i = 0; i <= 24; i++){
            if(i <= moment().hour()){
                times.push(i);
            }
        }
        return times;
    }

    render(){
        
        const {
            time,
            title,
            content,
            image,
        } = this.state;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 20 },
              sm: { span: 16 },
            },//current && current < moment().endOf('day')
        };
        return <div><Spin
                spinning={this.state.loading}
            >
            <Row style={{marginBottom: 20}}>
                    <Col style={{textAlign:'right',paddingRight:10}} {...formItemLayout.labelCol}> <span className='text-error'>*</span>公告日期 </Col>
                    <Col {...formItemLayout.wrapperCol}>
                        <DatePicker
                            showTime ={{
                                format: 'HH:00:00',
                                disabledHours: this.disabledTime,
                            } as any}
                            showToday={false}
                            disabledDate = {this.disabledDate}
                            format="YYYY-MM-DD HH:00:00" 
                            value={time && moment(time)}
                            onChange={(time, timeString) => {
                                let now = moment();
                                if(time && now.format("YYYY-MM-DD") == time.format("YYYY-MM-DD")){
                                    this.setState({
                                        isToday: true,
                                        clickToday: true,
                                    })
                                }else{
                                    this.setState({
                                        isToday: false,
                                    })
                                }
                                if(time && now.format("YYYY-MM-DD") == time.format("YYYY-MM-DD") && now.hour() >= time.hour()){
                                    timeString = moment.unix(moment().unix()+3600).format("YYYY-MM-DD HH:00:00");
                                }
                                this.setState({
                                    time: timeString,
                                    hasTime: time ? true : false,
                                })
                            }}
                        />
                    </Col>
            </Row>
            <Row style={{marginBottom: 20}}>
                    <Col style={{textAlign:'right',paddingRight:10}} {...formItemLayout.labelCol}> <span className='text-error'>*</span>公告标题</Col>
                    <Col {...formItemLayout.wrapperCol}>
                        <Input value={title} onChange={(e)=>{this.setState({title:e.target.value})}} placeholder='请填写公告标题' />  
                    </Col>
            </Row>
            <Row style={{marginBottom: 20}}>
                    <Col style={{textAlign:'right',paddingRight:10}} {...formItemLayout.labelCol}>公告内容</Col>
                    <Col {...formItemLayout.wrapperCol}>
                        <BraftEditor 
                            htmlContent={content}
                            image={image}
                            handleChange={(content, image) => {this.handleChange(content, image)}}
                        ></BraftEditor>
                    </Col>
            </Row>
            <Row>
                    <Col style={{textAlign:'right',paddingRight:10}} {...formItemLayout.labelCol}></Col>
                    <Col {...formItemLayout.wrapperCol}>
                    <Button
                        type="primary"
                        // htmlType="submit"
                        disabled={this.state.loading}
                        onClick={this.onOk}
                    >
                        确定
                    </Button>
                    <Link to={`${DOMAIN_OXT}/newadmin/crm/workbenchconfig`}>
                    <Button
                        style={{marginLeft:20}}
                        // onClick={()=>{browserHistory.goBack();}}
                    >
                        取消
                    </Button></Link>
                    </Col>
            </Row>
            </Spin>
        </div>
    }
}
// const EditFrom = Form.create()(Edit);