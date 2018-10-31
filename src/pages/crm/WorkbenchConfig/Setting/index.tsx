import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
// import Sortable from 'sortablejs'
import { Button, Row, Icon, message, Spin } from 'antd';
import { DOMAIN_OXT } from '../../../../global/global';

import DragCard from '../../../../components/crm/DragCard';
import DragDiv from '../../../../components/crm/Sortable'

import SalesHelper from '../../../../components/crm/SalesHelper' //销售助手
import QuickAccess from '../../../../components/crm/QuickAccess' //快捷入口
import Proclamation from '../../../../components/crm/Proclamation' //公告栏
import Trends from '../../../../components/crm/Trends' //动态

import BraftEditor from '../../../../components/crm/BraftEditor'
import SalesKit from '../../../../components/crm/SalesKit'         //销售简报
import SalesTodoList from '../../../../components/crm/SalesTodoList/'  //待办
import AuditList from '../../../../components/crm/AuditList/' //审批中心

import CrmCalendar from '../../../../components/crm/CrmCalendar'; //日历模块

import './style.less'

import {
    getWelcomeContent,
} from '../../../../action/crm/WorkbenchConfig';
import {
    updateWorkbenchDefined,
    getWorkbenchDefinedById,
} from '../../../../api/crm/WorkbenchConfig';

const titleTable= {
    1:{name: '销售简报', type: 2},
    2:{name: '销售助手', type: 1},
    3:{name: '日历', type: 2},
    4:{name: '本周待办', type: 1},
    5:{name: '快捷入口', type: 1},
    6:{name: '审批中心', type: 2},
    7:{name: '公告栏', type:1},
    8:{name: '动态', type:2},
}

class Workbench extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isEdit: true,
            display:[],
            positionId:0,
            shows:[],
            hides:[],
            id:0,
            name:'',
        }
    }
    modals:any={
        "1": ({type, id}) => (isEdit) => <DragCard disabledType={1} typeOnChange={this.typeOnChange} onClose={this.removeModal} type={type} id={id} isEdit={isEdit} title='销售简报' >
                <SalesKit type='none'/>
            </DragCard>,
        "2": ({type, id}) => (isEdit) => <DragCard
                title='销售助手'
                onClose={this.removeModal}
                typeOnChange={this.typeOnChange}
                id={id} 
                isEdit={isEdit}
                type={type}
            >
                <SalesHelper type='none'/>
            </DragCard>,
        "3": ({type, id}) => (isEdit) => <DragCard disabledType={1} typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='日历' type={type}>
                <CrmCalendar
                    type='none'
                />
            </DragCard>,
        "4": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='本周待办' type={type}>
                <SalesTodoList
                    cardTitle={2}
                    type='none'
                />
            </DragCard>,
        "5": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='快捷入口' type={type}>
                <QuickAccess type='none'></QuickAccess>
            </DragCard>,
        "6": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='审批中心' type={type}>
                <AuditList type='none' />
            </DragCard>,
        "7": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='公告栏' type={type}>
                <Proclamation type='none' />
            </DragCard>,
        "8": ({type, id}) => (isEdit) => <DragCard disabledType={1} typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='动态' type={type}>
                <Trends />
            </DragCard>,
    }

    async getInit(id){
        this.setState({loading:true});
        let res:any =  await getWorkbenchDefinedById({id})
        if(res.data.length == 0){
            message.error('无信息')
        }else if(res.data && res.errcode == 0){
            let { display, hidden, id, positionId, enable } = res.data;
            if(display){
                display = JSON.parse(display);
                let shows:any = [];
                let hides:any = [];
                display.map(item => {
                    if(item.name === '今日待办' && Number(item.type) === 1){  //历史数据处理，今日待办如果是小模块，则改为中模块s
                        item.type = 2;
                    }
                    if((Object as any).values(titleTable).find((i,index) => index + 1 === Number(item.id))){
                        shows.push(this.modals[item.id](item))
                    }
                })
                for(let key in this.modals){
                    let isShow = false;
                    display.map( item => {
                        if(item.id == key){
                            isShow = true;
                        }
                    })
                    if(!isShow){
                        hides.push({id:Number(key), type:titleTable[key].type, name:titleTable[key].name})
                    }
                }
                this.setState({
                    positionId,
                    display,
                    shows,
                    hides,
                    enable,
                    id,
                })
            }else{
                let hides:any = [];
                for(let key in this.modals){
                    hides.push({id:Number(key), type:titleTable[key].type, name:titleTable[key].name})
                }
                this.setState({
                    positionId,
                    display:[],
                    hides,
                    enable,
                    id,
                })
            }
            
        }else{
            message.error(res.msg);
        }
        this.setState({loading:false});
    }

    componentWillMount(){
        const search = location.search;
        if(!search){
            message.error('缺少必要参数');
        }else if(search.split('?')[1].split('=')[0] == 'id'){
            let params = search.split('?')[1].split('&');
            let id = params[0].split('=')[1];
            let name = decodeURI(params[1].split('=')[1]);
            this.setState({name})
            this.props.dispatch(getWelcomeContent({}));
            this.getInit(id);
        }else{
            message.error('参数错误');
        }
        // this.props.dispatch(getWelcomeContent({}))
    }

    customWorkbench(isEdit) {
        this.setState({ isEdit })
    }
    renderWorkbenchHeader(isEdit) {
        const welCome = this.props.welCome.toJS()
        return <div className='crm-workbench-header'>
            <table style={{height: 80, width: '100%'}}>
                <tbody>
                    <tr>
                        <td style={{width: 80}}>
                            <span style={{display:'inline-block', width:'60px',height:'60px', lineHeight:'60px', borderRadius:'5px', marginTop:5, overflow:'hidden'}}>
                                <img style={{width:'100%'}} src={welCome.title} alt=""/>
                            </span>
                        </td>
                        <td >
                        <span style={{display:'inline-block', wordBreak:'break-all', color:'#999', fontSize:18, fontWeight:600}}>{welCome.content}</span>
                        </td>
                        <td style={{width: 160}}>
                        <Button disabled={this.state.loading} onClick={() => { this.updateWorkbenchDefined() }} style={{ marginRight: 5 }} type='primary'>保存</Button>
                        <Link to={`${DOMAIN_OXT}/newadmin/crm/workbenchconfig`}><Button style={{ marginRight: 5 }}>取消</Button></Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    }

    addModal = (id) => {
        let { display, hides } = this.state;
        display.push({id:Number(id), type:titleTable[id].type, name:titleTable[id].name});
        hides = hides.filter(item => item.id != id);
        let shows:any = [];
        display.map(item => {
            shows.push(this.modals[item.id](item))
        })
        this.setState({ 
            display, 
            hides,
            shows,
        })
    }

    removeModal = (id) => {
        let { display, hides } = this.state;
        hides.push({id:Number(id), type:titleTable[id].type, name:titleTable[id].name});
        display = display.filter(item => item.id != id);
        let shows:any = [];
        display.map(item => {
            shows.push(this.modals[item.id](item))
        })
        this.setState({ 
            display, 
            hides,
            shows,
        })
    }
    typeOnChange = (id, type) => {
        let { display } = this.state;
        let newDisplay = display.map(item => {
            if(item.id == id){
                item.type = type;
            }
            return item;
        })
        let shows:any = [];
        newDisplay.map(item => {
            shows.push(this.modals[item.id](item));
        })
        this.setState({display:newDisplay, shows});
    }
    onUpdate = (event) =>{
        // console.log(event.from)
        let { display } = this.state;
        let newDisplay = [];
        const {newIndex, oldIndex} = event;
        const who = display[oldIndex];
        for(let i = 0, len = display.length; i < len; i++){
            if(i == newIndex){
                newDisplay.push(Object.assign({},display[oldIndex] as never));
            }else if(oldIndex > newIndex && i > newIndex && i <= oldIndex){
                newDisplay.push(Object.assign({},display[i-1] as never));
            }else if(oldIndex < newIndex && i < newIndex && i >= oldIndex){
                newDisplay.push(Object.assign({},display[i+1] as never));
            }else{
                newDisplay.push(Object.assign({},display[i] as never));
            }
        }
        // console.log('**',display,'**')
        // console.log('**',newDisplay,'**')

        // display.splice(oldIndex, 1);
        // if(newIndex > oldIndex){
        //     display.splice(newIndex, 0, who);
        // }else{
        //     display.splice(newIndex, 0, who);
        // }

        let shows:any = [];
        newDisplay.map((item:any) => {
            shows.push(this.modals[item.id](item))
        })
        // console.log(display)
        this.setState({display:newDisplay, shows});
    }

    componentDidMount() {
        document.querySelectorAll('.ant-breadcrumb + div')[0].setAttribute('style',"padding: 0px; background: #F0F3F8; min-height: 750px;")
        document.title = `工作台_${this.state.name}`;
        document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link')[0].innerHTML = document.title;
    }
    async updateWorkbenchDefined(){
        this.setState({loading:true});
        const {
            id,
            display,
            hides,
            enable,
        } = this.state;
        
        let res:any = await updateWorkbenchDefined({
            id, 
            display: JSON.stringify(display), 
            hidden: JSON.stringify(hides), 
            tableType: 2,
            enable,
            type: 1, //类型 1代表职位 2代表个人
        });
        this.setState({loading:false});
        // console.log(res)
        if(res.errcode == 0){
            message.success(res.msg);
            browserHistory.goBack();
        }
    }

    render() {
        const {
            isEdit,
            shows,
            hides,
        } = this.state;
        
        const header = this.renderWorkbenchHeader(isEdit);
        return <QueueAnim>
            <Spin
                spinning={this.state.loading}
            >
            <div className='crm-workbench-setting'>
                {header}
                <div className='crm-workbench-tags'>
                    {
                        hides && hides.map(item => {
                            return <Tag title={item.name} id={item.id} onClick={(id) => {this.addModal(id)}} />
                        })
                    }
                </div>
                <DragDiv
                    className='crm-workbench-draggable-container'
                    handleClassName='.drag-handle'
                    onUpdate={this.onUpdate}
                    onFilter={() => { }}
                >
                    {
                        shows.map(item => item(isEdit))
                    }
                </DragDiv>
            </div>
            </Spin>
        </QueueAnim>
    }
}

interface TagProps{
    title:string;
    id: number | string;
    // visible: boolean;
    onClick: Function;
}

class Tag extends React.Component<TagProps>{
    constructor(props){
        super(props)
    }

    render(){

        return <span
            className='crm-tag'
            onClick={() => {this.props.onClick(this.props.id)}}
        >
            <Icon type="plus" />
            {this.props.title}
        </span>
    }
}

interface TStateProps {
    saleKitSource: any[];
    salesTodayTodoList: any[];
    salesWeekTodoList: any[];
    willAuditList: any[];
    didAuditList: any[];
    welCome: any;
}

const mapStateToProps = (state: any): TStateProps => {
    //console.log('saleKitSource',state.getIn(['crmWorkbench', 'saleKitSource']))
	return {
        saleKitSource: state.getIn(['crmWorkbench', 'saleKitSource']).toJS(),
        salesTodayTodoList: state.getIn(['crmWorkbench', 'salesTodayTodoList']).toJS(),
        salesWeekTodoList: state.getIn(['crmWorkbench', 'salesWeekTodoList']).toJS(),
        willAuditList: state.getIn(['crmWorkbench', 'willAuditList']).toJS(),
        didAuditList: state.getIn(['crmWorkbench', 'didAuditList']).toJS(),
        welCome: state.getIn(['crmWorkbenchConfig', 'welCome']),
	}
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		dispatch,
	}
}


export default connect(mapStateToProps)(Workbench)