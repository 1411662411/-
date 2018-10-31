import React from 'react'
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
    Button,
    Table,
    Switch,
    Row,
    Select,
    Form,
    Input,
    Cascader,
    DatePicker ,
    Tag
} from 'antd'
const {  RangePicker } = DatePicker;
import { ROUTER_PATH } from '../../global/global';
import FilterTableHeader from '../../components/common/FilterTableHeader';
import { 
    activityListDis,
    activityIsReleaseDis,
    activityAreaDis,
    activityCreatorDis,
    activityExportSignUpListDis,
    activityIsrealeaseStatusDis
 } from '../../action/website/websiteAction'
import { statePaginationConfig } from '../../util/pagination';

import './activityManergement.less'

let timerw = (new Date()).getTime()
//type
// 1 添加
// 2 查看
// 3 编辑

class ActivityManergement extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            currentPage: 0,
            pageSize: 20,
            tagName:[],
            cityId:'',
            actStartTime:'',
            actEndTime:'',
            signStartTime:'',
            signEndTime:'',
            isRelease:'',
            subject:'',
            createUser:'',
            type:'',
            signStatus:''
        }
    }
    componentWillMount(){
        const {
            dispatch,
        } = this.props;
       const {
           currentPage,
           pageSize,
       } = this.state
        dispatch(activityListDis({ currentPage: currentPage, pageSize: pageSize}))
        dispatch(activityAreaDis({}))
        dispatch(activityCreatorDis({}))
        dispatch(activityIsrealeaseStatusDis({}))
    }
    pagination = () => {
        const {
            type,
            dispatch,
            listData
        } = this.props;
        
        const {   
            currentPage,
            pageSize,
        } = this.state
        let Prams = {
            currentPage,
            pageSize,
        }
        return statePaginationConfig({
            currentPage,
            pageSize,
            total: listData.data ? listData.data.recordsTotal:0,
        },

            (newParams) => activityListDis({ ...this.state,...Prams, ...newParams}),
            dispatch,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            },
        )
    }
    
    ShowtimestampToTime(timestamp) {
        let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
        let D = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':';
        let m = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();

        return Y + M + D + h + m;
    }
    activityDis(){
        const {
            dispatch,
        } = this.props;
        dispatch(activityListDis({ currentPage: this.state.currentPage, pageSize: this.state.pageSize }))
    }
    flatChange(id, isReleases){
        const {
            dispatch,
        } = this.props;
        let {
            cityId,
            actStartTime,
            actEndTime,
            signStartTime,
            signEndTime,
            isRelease,
            subject,
            createUser,
            type,
            signStatus
        }=this.state
        let callbackPrams = {
            cityId,
            actStartTime,
            actEndTime,
            signStartTime,
            signEndTime,
            isRelease,
            subject,
            createUser,
            type,
            signStatus,
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize 
        }
        let params={
            id,
            isRelease:isReleases,
        }
        dispatch(activityIsReleaseDis(params, callbackPrams))
    }
    timerStarttoUnix(str){
        let a = str+" 00:00:00"
        return (new Date(a).getTime())/1000
    }
    timerEndtoUnix(str) {
        let a = str + " 23:59:59"
        return (new Date(a).getTime()) / 1000
    }
    onSearch=(name,value,title)=>{
        const {
            dispatch,
        } = this.props;
        let { tagName } = this.state
        let flag = true
        if (tagName.length>=3){
            flag = false
        }
        if (name ==='cityId'){

            let a = value[1]
            let b = value
            let proName 
            let cityName
            const city = this.props.areaData
            for (let i = 0; i < city.length;i++){
                
                if(city[i].value==b[0]){
                    proName = city[i].name
                    for (let k = 0; k < city[i].children.length;k++){
                        if (city[i].children[k].value==b[1]){
                            cityName = city[i].children[k].name
                            break
                        }
                    }
                }
            }
            value = proName +''+ cityName
            this.setState({
                [name]: a 
            })
            dispatch(activityListDis({ ...this.state, tagName:'' ,currentPage: 0, pageSize: 20, [name]: a }))
            
        }else if (name === 'actStartTime actEndTime' || name === 'signStartTime signEndTime'){
           
            let citydata = name.split(' ')
            let actStartTime = citydata[0]
            let actEndTime = citydata[1]
            let start = value[0].format('YYYY-MM-DD')
            
            start = this.timerStarttoUnix(start)
           
            let end = value[1].format('YYYY-MM-DD')
            end = this.timerEndtoUnix(end)
           
            let tagStart = value[0].format('YYYY.MM.DD')
            let tagEnd = value[1].format('YYYY.MM.DD')
            value = tagStart + '~' + tagEnd
           
            this.setState({
                actStartTime: start, 
                actEndTime: end 
            })
            name = { actStartTime: start, actEndTime: end}
            dispatch(activityListDis({ ...this.state, tagName: '', [actStartTime]: start, [actEndTime]: end, currentPage: 0, pageSize: 20}))
            
        }else if (name ==='isRelease'){
            let a = value
            let b = value
           
            if(b===1){
                value = '是'
            }else if(b===0){
                value = '否'
            }else{
                value ='全部'
            }
            this.setState({
                [name]: a 
            })
            dispatch(activityListDis({ ...this.state, tagName: '', [name]: a, currentPage: 0, pageSize: 20}))
        } else if (name === 'subject' || name === 'createUser'){
            this.setState({
                [name]: value
            })
            dispatch(activityListDis({ ...this.state, tagName: '', [name]: value, currentPage: 0, pageSize: 20}))
        } else if (name === 'type'){
            let a= value
            value = a === 1 ? '柚讲堂' : (a === 2 ? '柚来了' : (a===3?'其他':'全部'))
            this.setState({
                [name]: a
            })
            dispatch(activityListDis({ ...this.state, tagName: '',[name]: a, currentPage: 0, pageSize: 20}))
        } else if (name ==='signStatus'){
            let a = value
            value = value == 1 ? '报名中' : (value == 2 ? '报名结束' :(value==''?'全部':'/'))
            this.setState({
                [name]: a
            })
            
            dispatch(activityListDis({ ...this.state, tagName: '',[name]: a, currentPage: 0, pageSize:20}))
        }
        if (tagName.length>0){
            let s = [...tagName]
            let num = 0
            let count
            // for (let i = 0; i < s.length; i++) {
            //     if (s[i].name === name) {
            //         num+=1
            //         count = i  
            //         break
            //     }
            // }
            s.map((val,index)=>{
                if(val.name===name){
                    num+=1
                    count = index
                }
                return 
            })
            if(num>0){
                tagName[count].text = title + ':' + value;
                tagName[count].name = name
            }else{
                if(flag){
                    tagName.push({ text: title + ':' + value, name: name })
                }
                
            }
        }else{
            tagName.push({ text: title + ':' + value, name: name })
        }
        this.setState({
            tagName
        })
       
    }
    log(e,val,ind){
        const {
            dispatch,
        } = this.props;
        let { tagName } = this.state
        let newTag = [...tagName]
       
        let item = val.text
        let itemName = val.name
     
        newTag.splice(newTag.findIndex(valItem => valItem.text === item), 1)
       
        this.setState({
            tagName: newTag,
        })
        if(typeof itemName =='string'){
            dispatch(activityListDis({ ...this.state, [itemName]:'' }))
            this.setState({
                [itemName]:''
            })
        }else{
            for (let k in itemName){
                if (k =='actStartTime'){
                    dispatch(activityListDis({ ...this.state, actStartTime: '', actEndTime:'' }))
                    this.setState({
                        actStartTime: '',
                        actEndTime:''
                    })
                    return
                }else{
                    dispatch(activityListDis({ ...this.state, signStartTime: '', signEndTime: '' }))
                    this.setState({
                        signStartTime: '',
                        signEndTime: ''
                    })
                    return
                }
            }
           
        }
       
        

    }
    exportList(id){
       
        const {dispatch} = this.props
        dispatch(activityExportSignUpListDis({ activityId: id}))
    }
    closeTag(){
        this.setState({
            tagName: [],
            cityId: '',
            actStartTime: '',
            actEndTime: '',
            signStartTime: '',
            signEndTime: '',
            isRelease: '',
            subject: '',
            createUser: '',
            type: '',
            signStatus: ''
        })
        const {dispatch} = this.props
        dispatch(activityListDis({ currentPage: this.state.currentPage, pageSize: this.state.pageSize}))
    }
    columns: any = () => [
        {
            title: '操作',
            dataIndex: 'caozuo',
            className: 'centerStyle',
            width: 80,
            render:(text,recode)=>{
                let data 
                let id = recode.id
                if (recode.editShow=='1'){
                    if (recode.signAmount > 0) {
                        data = <div>
                            <a onClick={(id) => this.addPage({ type: 3, recode: recode.id})}>编辑</a>&nbsp;&nbsp;<span onClick={() => this.exportList(id)}><a>导出报名表</a></span>
                            </div>
                    }else{
                        data = <a onClick={(id) => this.addPage({ type: 3, recode: recode.id })}>编辑</a>
                    }
                }else{
                    if (recode.signAmount > 0) {
                        data = <span onClick={()=>this.exportList(id)}><a>导出报名表</a></span>
                    }
                }
                
                return data
            }
        }, {
            title: <FilterTableHeader
                title='是否发布'
                name='isRelease'
                form={this.props.form}
                initialValue= {undefined}
                onOk={this.onSearch}
            >
                <Select 
                    key={timerw}
                    placeholder='请选择'
                    className='morenxuan'
                    style={{ width: 140 }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                >
                    <Select.Option value={1}>
                        发布
                    </Select.Option>
                    <Select.Option value={0}>
                        未发布
                    </Select.Option>
                    <Select.Option value=''>
                        全部
                    </Select.Option>
                </Select>
            </FilterTableHeader>,
            dataIndex: 'isRelease',
            className: 'centerStyle',
            key: 'isRelease',
            width: 100,
            render:(text,recode)=>{
                let flag;
                recode.isRelease == 1 ? flag = true : flag = false;
                const status = this.props.isRealeaseStatus.release
                let parmas = recode.isRelease == 1?0:1
                // return <Switch checkedChildren="是" unCheckedChildren="否" checked={flag} onChange={() => this.flatChange(recode.id, recode.isRelease)} />
      
                if(status=='1'){
                    return <Switch checkedChildren="" unCheckedChildren="" checked={flag} onChange={() => this.flatChange(recode.id, parmas)} />
                }else{
                    return flag ? '发布' :'未发布'
                }
                
            }
        }, {
            title: <FilterTableHeader
                title='活动主题'
                name='subject'
                form={this.props.form}
                initialValue=''
                onOk={this.onSearch}
            >
                <Input placeholder='请输入'/>
            </FilterTableHeader>,
            dataIndex: 'subject',
            className: 'centerStyle',
            key: 'subject',
            width: 150,
            render:(text,recode)=>{
                return <a onClick={(id) => this.addPage({ type: 2, recode: recode.id})}>{text}</a>
            }
        }, {
            title: <FilterTableHeader
                title='活动类型'
                name='type'
                form={this.props.form}
                initialValue={undefined}
                onOk={this.onSearch}
            >
                <Select
                    className='morenxuan'
                    key={timerw}
                    placeholder='请选择'
                    style={{ width: 140 }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                >
                    <Select.Option value={1}>
                        柚讲堂
                    </Select.Option>
                    <Select.Option value={2}>
                        柚来了
                    </Select.Option>
                    <Select.Option value={3}>
                        其他活动
                    </Select.Option>
                    <Select.Option value=''>
                        全部
                    </Select.Option>
                </Select>
            </FilterTableHeader>,
            key: 'type',
            className: 'centerStyle',
            dataIndex: 'type',
            width: 100,
            render: (text, record) => (
                text === 1 ? '柚讲堂' : (text === 2 ? '柚来了' : '其他活动')
            ),
        }, 
        {
            title: this.props.isRealeaseStatus.release == 1 ?<FilterTableHeader
                title='活动所在地'
                name='cityId'
                form={this.props.form}
                initialValue=''
                onOk={this.onSearch}
            >
                <Cascader placeholder='请选择' options={this.props.areaData} getPopupContainer={(triggerNode: any) => triggerNode.parentNode}/>
            </FilterTableHeader> :'活动所在地',
            key: 'areaName',
            className: 'centerStyle',
            dataIndex: 'areaName',
            width: 150,
            render:(text,recode)=>{
                let b = text
                let a = b.split(' ')
                let show = a[0]==a[1]?a[0]:text
                return show
            }
        },
       
        {
            title: <FilterTableHeader
                title='活动时间'
                name='actStartTime actEndTime'
                form={this.props.form}
                initialValue=''
                onOk={this.onSearch}
            >
                <RangePicker format='YYYY-MM-DD' getCalendarContainer={(triggerNode: any) => triggerNode.parentNode}/>
               
            </FilterTableHeader>,
            className: 'centerStyle',
            dataIndex: 'areaName',
            width: 200,
            render: (text, recode) => {
                
                return this.ShowtimestampToTime(recode.actStartTime) + ' - ' + this.ShowtimestampToTime(recode.actEndTime)
            }
        },
        {
            title: <FilterTableHeader
                title='报名状态'
                name='signStatus'
                form={this.props.form}
                initialValue={undefined}
                onOk={this.onSearch}
            >
                <Select
                    className='morenxuan'
                    placeholder='请选择'
                    style={{ width: 140 }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                >
                    <Select.Option value={1}>
                        报名中
                    </Select.Option>
                    <Select.Option value={2}>
                        报名结束
                    </Select.Option>
                    <Select.Option value=''>
                        全部
                    </Select.Option>
                </Select>
            </FilterTableHeader>,
            key: 'signStatus',
            className: 'centerStyle',
            dataIndex: 'signStatus',
            width: 100,
            render: (text, recode) => {
                return recode.signStatus == 1 ? '报名中' : (recode.signStatus==2?'报名结束':<span title='活动未发布，报名未开始'>/</span>)
            }
        },
        {
            title: '报名人数',
            key: 'signAmount',
            className: 'centerStyle',
            dataIndex: 'signAmount',
            width: 100,
            render: (text, recode) => {
                if (text>0){
                    return text
                }else{
                    if (recode.signStatus == 1 || recode.signStatus == 2){
                        return '0'
                    }
                    return '/'
                }
                
            }
        },
        {
            title: <FilterTableHeader
                title='报名截止时间'
                name='signStartTime signEndTime'
                form={this.props.form}
                initialValue={undefined}
                onOk={this.onSearch}
            >
                <RangePicker format='YYYY-MM-DD' getCalendarContainer={(triggerNode: any) => triggerNode.parentNode} />

            </FilterTableHeader>,
            key: 'signEndTime',
            className: 'centerStyle',
            dataIndex: 'signEndTime',
            width: 150,
            render: (text, recode) => {
                return this.ShowtimestampToTime(text)
            }
        },
        {
            title: this.props.isRealeaseStatus.release==1?<FilterTableHeader
                title='活动创建人'
                name='createUser'
                form={this.props.form}
                initialValue=''
                onOk={this.onSearch}
            >
                <Select
                    placeholder='请选择'
                    style={{ width: 140 }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                >
                    {this.props.userCreator.map((val,index)=>{
                        return  <Select.Option value={val}>
                                    {val}
                                </Select.Option>
                    })}
                

                </Select>
            </FilterTableHeader> : '活动创建人',
            key: 'createUser',
            className: 'centerStyle',
            dataIndex: 'createUser',
            width: 150,
            render: (text, recode) => {
                return text
            }
        },
    
    ];
    addPage(id?){
        if(!id){
            browserHistory.push(`${ROUTER_PATH}/newadmin/web/activitymanergment/add`)
        }
        if(id&&id.type===3){
            browserHistory.push(`${ROUTER_PATH}/newadmin/web/activitymanergment/editor?id=${id.recode}`)
        }
        if(id&&id.type===2){
            browserHistory.push(`${ROUTER_PATH}/newadmin/web/activitymanergment/check?id=${id.recode}`)
        }
        
    }
    render(){
        let data
        if (this.props.listData.data){
            data = this.props.listData.data.records
        }else{
            data = [];
        }
        const { tagName } = this.state
        return(
            <div>
                <Row key={timerw}>
                    {tagName.length >0 ? <span>已选条件：</span>:''}
                    {tagName.map((val,ind)=>{
                        return  <span key={timerw}>
                                    
                            <Tag style={{fontSize:14}} closable key={val.text} afterClose={(e) => this.log(e, val,ind)}>{val.text}</Tag>
                                </span>
                    })}
                    {tagName.length < 3 ? '' : <Button onClick={()=>this.closeTag()} type='primary'>重置</Button>}
                </Row>
                <Row>
                    
                    <a key={timerw} className="float-right" onClick={(id)=>this.addPage()}>+新增活动</a>
                   
                </Row>
                <Table
                    style={{ marginTop: "30px" }}
                    columns={this.columns()}
                    dataSource={data}
                    scroll={{ x: 1280, y: window.innerHeight * 0.6}}
                    pagination={this.pagination()}
                    bordered
                    loading={this.props.dataListLoading}
                />
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('websiteActivityListReducer');
    data = data.toJS()
    
    return {
       listData:data.list,
       areaData: data.areaData,
        userCreator: data.creator,
        isRealeaseStatus: data.isRealeaseStatus,
        dataListLoading: data.dataListLoading
    }
}; 

export default connect(mapStateToProps)(Form.create()(ActivityManergement));