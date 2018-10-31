import React from 'react';
import QueueAnim from 'rc-queue-anim';
// import Sortable from 'sortablejs'
import { Button, Row, message, Icon, Spin } from 'antd';

import DragCard from '../../../components/crm/DragCard';
import DragDiv from '../../../components/crm/Sortable';

import SalesHelper from '../../../components/crm/SalesHelper';
import QuickAccess from '../../../components/crm/QuickAccess';
import Proclamation from '../../../components/crm/Proclamation';

import BraftEditor from '../../../components/crm/BraftEditor';
import SalesKit from '../../../components/crm/SalesKit';
import SalesTodoList from '../../../components/crm/SalesTodoList/';
import AuditList from '../../../components/crm/AuditList/';
import Trends from '../../../components/crm/Trends';

import CrmCalendar from '../../../components/crm/CrmCalendar';

import { getUserDefined, resetWorkbenchDefined } from '../../../api/crm/Workbench';
import { updateWorkbenchDefined, getWorkbenchDefined, getWelcomeContent, addPositionApi } from '../../../api/crm/WorkbenchConfig';


import './style.less'

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
            isEdit: false,
            loading: false,
            display:[],
            oldDisplay: [], 
            positionId:0,
            shows:[],
            oldShows: [],
            hides:[],
            oldHides: [],
            id:0,
            welcome:{},
            enable:1,
        }
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

    onUpdate = (event) =>{
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

        // display.splice(oldIndex,1);
        // if(newIndex>oldIndex){
        //     display.splice(newIndex,0,who);
        // }else{
        //     display.splice(newIndex,0,who);
        // }

        let shows:any = [];
        newDisplay.map((item:any) => {
            shows.push(this.modals[item.id](item))
        })
        // console.log(display)
        this.setState({display:newDisplay,shows});
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
            shows.push(this.modals[item.id](item))
        })
        this.setState({display:newDisplay, shows})
    }

    async updateWorkbenchDefined(){
        this.setState({loading:true});
        const {
            id,
            display,
            enable,
            hides,
        } = this.state;
        let res:any;
        if(this.noWorkbenchDefined){
            res = await addPositionApi({
                display: JSON.stringify(display), 
                hidden: JSON.stringify(hides), 
                enable,
                tableType: 2,
                type: 2, //类型 1代表职位 2代表个人
            });
        }else{
            res = await updateWorkbenchDefined({
                id, 
                display: JSON.stringify(display), 
                hidden: JSON.stringify(hides), 
                enable,
                tableType: 2,
                type: 2, //类型 1代表职位 2代表个人
            });
        }
        
        // console.log(res)
        if(res.errcode == 0){
            message.success(res.msg);
            this.setState({
                oldDisplay: [],
                oldShows: [],
                oldHides: [],
                isEdit: false,
                loading:false,
            })
        }else{
            // message.error(res.msg);
            this.setState({
                display: [...this.state.oldDisplay],
                shows: [...this.state.oldShows],
                hides: [...this.state.oldHides],
                oldDisplay: [],
                oldShows: [],
                oldHides: [],
                isEdit: false,
                loading:false,
                none: false,
            })
        }
    }

    modals:any={
        "1": ({type, id}) => (isEdit) => <DragCard disabledType={1} typeOnChange={this.typeOnChange} onClose={this.removeModal} type={type} id={id} isEdit={isEdit} title='销售简报' >
                <SalesKit type={isEdit ? 'none' : undefined}/>
            </DragCard>,
        "2": ({type, id}) => (isEdit) => <DragCard
                title='销售助手'
                onClose={this.removeModal}
                typeOnChange={this.typeOnChange}
                id={id} 
                isEdit={isEdit}
                type={type}
            >
                <SalesHelper
                    type={isEdit ? 'none' : undefined}
                ></SalesHelper>
                
            </DragCard>,
        // "3": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='今日待办' type={type}>
        "3": ({type, id}) => (isEdit) => <DragCard disabledType={1} typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='日历' type={type}>
                {/* <SalesTodoList
                    cardTitle={1}
                    type={isEdit ? 'none' : undefined}
                /> */}
                <CrmCalendar
                    type={isEdit ? 'none' : undefined}
                />
            </DragCard>,
        "4": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='本周待办' type={type}>
                <SalesTodoList
                    cardTitle={2}
                    type={isEdit ? 'none' : undefined}
                />
            </DragCard>,
        "5": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='快捷入口' type={type}>
                <QuickAccess type={isEdit ? 'none' : undefined}></QuickAccess>
            </DragCard>,
        "6": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='审批中心' type={type}>
                <AuditList type={isEdit ? 'none' : undefined}/>
            </DragCard>,
        "7": ({type, id}) => (isEdit) => <DragCard typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='公告栏' type={type}>
                <Proclamation type={isEdit ? 'none' : undefined}/>
            </DragCard>,
        "8": ({type, id}) => (isEdit) => <DragCard disabledType={1} typeOnChange={this.typeOnChange} onClose={this.removeModal} id={id} isEdit={isEdit} title='动态' type={type}>
                <Trends type={isEdit ? 'none' : undefined}/>
            </DragCard>,
    }
    noWorkbenchDefined:boolean;
    async getInit(){
        this.setState({loading:true});
        //let [foo, bar] = await Promise.all([getFoo(), getBar()])
        // let res:any, welcome:any;
        let [res, welcome] : any[] =  await Promise.all([getWorkbenchDefined({tableType:2, type:2}), getWelcomeContent({})]);
        welcome = welcome.data;
        
        if(res.data && res.errcode == 0){
            let { position, user } = res.data;
            if(!user){
                this.noWorkbenchDefined = true;
            }
            if(!user&&!position){
                this.setState({loading:false, welcome, none: true});
                return ;
            }
            const data = user ? user : position;
            let { display, hidden, id, positionId, enable } = data;
            if(display){
                display = JSON.parse(display);
                
                let shows:any = [];
                display.map(item => {
                    if(item.name === '今日待办' && Number(item.type) === 1){  //历史数据处理，今日待办如果是小模块，则改为中模块s
                        item.type = 2;
                    }
                    if((Object as any).values(titleTable).find((i,index) => index + 1 === Number(item.id))){
                        shows.push(this.modals[item.id](item))
                    }
                })

                hidden = JSON.parse(hidden);
                let hides:any = [];
                if(hidden){
                    hidden.map(item => {
                        if(item.name === '今日待办' && Number(item.type) === 1){  //历史数据处理，今日待办如果是小模块，则改为中模块s
                            item.type = 2;
                        }
                        if((Object as any).values(titleTable).find((i,index) => index + 1 === Number(item.id))){
                            hides.push(item)
                        }
                    })
                }
                hides = this.noWorkbenchDefined ? [] : hides;
                this.setState({
                    positionId,
                    display,
                    shows,
                    hides,
                    enable,
                    id,
                })
            }else{
                if(!this.noWorkbenchDefined){
                    let hides:any = [];
                    for(let key in this.modals){
                        hides.push({id:Number(key), type:titleTable[id].type, name:titleTable[key].name})
                    }
                    this.setState({
                        positionId,
                        display:[],
                        hides,
                        enable,
                        id,
                    })
                }
            }
            
        }else if(!res.data && res.errcode == 0){
            this.setState({loading:false, welcome, none: true});
            return ;
        }else{
            message.error(res.msg);
        }
        this.setState({loading:false, welcome});
    }

    async custom(){
        this.setState({
            oldDisplay: [...this.state.display],
            oldShows: [...this.state.shows],
            oldHides: [...this.state.hides],
            isEdit: true,
        })
    }

    reset = async () => {
        this.setState({loading:true});
        let res:any = await resetWorkbenchDefined();
        if(res.errcode === 0 && res.status === 0){
            message.success('操作成功',1,()=>{
                window.location.reload();
            });
        }else{
            this.setState({loading: false})
        }
    }

    renderWorkbenchHeader(isEdit) {
        const {welcome, none, loading} = this.state;
        return <div className='crm-workbench-header'>
            <table style={{height: 80, width: '100%'}}>
                <tbody>
                    <tr>
                        <td style={{width: 60}}>
                            <span style={{display:'inline-block', width:'60px',height:'60px', lineHeight:'60px', borderRadius:'5px', marginTop:5, overflow:'hidden'}}>
                                <img style={{width:'100%'}} src={welcome.title} alt=""/>
                            </span>
                        </td>
                        <td>
                        <span style={{display:'inline-block', wordBreak:'break-all', color:'#999', paddingLeft:10, fontSize:18, fontWeight:600}}>{welcome.content}</span>
                        </td>
                        <td style={{width: 240, textAlign:'right'}}>
                        {
                            isEdit ?
                                <span>
                                    <Button disabled={loading} onClick={() => {this.updateWorkbenchDefined()}} style={{ marginRight: 5 }} type='primary'>保存</Button>
                                    <Button onClick={() => { 
                                        this.setState({
                                            display: [...this.state.oldDisplay],
                                            shows: [...this.state.oldShows],
                                            hides: [...this.state.oldHides],
                                            oldDisplay: [],
                                            oldShows: [],
                                            oldHides: [],
                                            isEdit: false,
                                        }) 
                                    }} style={{ marginRight: 5 }}>取消</Button>
                                    <Button
                                        onClick={this.reset}
                                        style={{ marginRight: 5 }}
                                    >重置</Button>
                                </span> :
                                <span>
                                    <Button disabled={none} onClick={() => {this.custom()}} style={{ marginRight: 5 }} type='primary'>自定义工作台</Button>
                                </span>
                        }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    }

    hidesNameChangeToShow = (name) => {
        if(name === '今日待办'){
            return '日历';
        }
        return name;
    }

    componentWillMount(){
        this.getInit()
    }
    componentDidMount() {
        document.querySelectorAll('.ant-breadcrumb + div')[0].setAttribute('style',"padding: 0px; background: #F0F3F8; min-height: 750px;")

    }

    render() {
        const {
            isEdit,
            shows,
            hides,
            loading,
        } = this.state;

        const {
            saleKitSource,
            salesTodayTodoList,
            salesWeekTodoList,
            willAuditList,
            didAuditList
        } = this.props;
        
        const header = this.renderWorkbenchHeader(isEdit);
        return <QueueAnim>
            <Spin
                spinning={loading}
            >
            <div className='crm-workbench'>
                {header}
                {
                    isEdit && <div className='crm-workbench-tags'>
                    {
                        hides && hides.map(item => {
                            if(item.name === '今日待办'){
                                item.name = '日历';
                            }
                            return <Tag title={this.hidesNameChangeToShow(item.name)} id={item.id} onClick={(id) => {this.addModal(id)}} />
                        })
                    }
                    </div>
                }
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


export default Workbench