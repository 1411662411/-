import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as QueueAnim from "rc-queue-anim/lib";
import { Button, Table, Switch, message, Modal, Upload, Avatar, List, Input, Spin, Popover, Select } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import {base64ToBlob, getBase64Image} from '../../../util/base64ToBlob'

import { DOMAIN_OXT } from '../../../global/global';
import { FILEUPLOAD } from '../../../api/crm/common';
import {
    getProclamation, 
    getAllList,
    updateWelcomeContent,
    setWelcomeContent,
    getConfigList,
} from '../../../action/crm/WorkbenchConfig';
import {
    updateWelcomeContentApi,
    updateAnnouncement,
    updateWorkbenchDefined,
    addPositionApi,
    getIconLibraryListApi,
} from '../../../api/crm/WorkbenchConfig';
import {fetchFile} from '../../../util/fetch';

import './style.less';

// interface WorkbenchConfigProps{

// }



class WorkbenchConfig extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            faceVisible: false,
            welcomeVisible: false,
            configSource: props.configSource.toJS(),
            proclamationSource: props.proclamationSource.toJS(),
            add:'',
            welComeContent:props.welCome.toJS().content,
            proclamationLoading: false,
            configLoading:false,
            addPositionId:0,
            addPositionVisible:false,
            addPositionLoading: false,
        }
    }
    configColumns:any[] = [
        {
            title: '职位',
            dataIndex: 'positionName',
            width: 160,
        }, {
            title: '是否开启工作台',
            key: 'enable',
            width: 200,
            render:(data)=>{
                // console.log(data)
                return <RenderSwitch id={data.id} checked={data.enable?true:false} onChange={(checked)=>{
                    return this.updateWorkbenchDefined({
                        id:data.id,
                        enable:checked?1:0,
                        type: data.type,
                        tableType: data.tableType,
                        display: data.display,
                        hidden: data.hidden,
                    })
                }} />
            },
        }, {
            title: '工作台上显示模块',
            key: 'displayContent',
            render: (data) => {
                let displayContent = data.displayContent ? data.displayContent.replace('今日待办', '日历') : '';
                return <div className='text-left'>{displayContent}</div>
            }
        }, {
            title: '操作',
            key: 'todo',
            width: 120,
            render: (data) => <Link to={`${DOMAIN_OXT}/newadmin/crm/workbenchconfig/setting?id=${data.id}&name=${data.positionName || ' '}`}> 配置显示模块 </Link>,
        }
    ]
    proclamationColumns:any[] = [
        {
            title: '公告日期',
            key: 'announcementDate',
            width: 200,
            render(data){
                return data.edit ? <Input></Input> : data.announcementDate;
            }
        }, {
            title: '是否发布',
            width: 120,
            key: 'enable',
            render:(data) => {
                return <RenderSwitch id={data.id} checked={data.enable ? true : false} onChange={(checked)=>{return this.updateAnnouncement({id:data.id,enable:checked?1:0})}} />
            },
        }, {
            title: '公告标题',
            key: 'title',
            render: (text, record) => <div className='text-left'>{record.newLable ? record.title : record.title}</div>,
        }, {
            title: '操作',
            key: 'todo',
            width: 120,
            render: (data) => <span>
                <Link to={`${DOMAIN_OXT}/newadmin/crm/workbenchconfig/proclamation?id=${data.id}`}>编辑</Link>
                {data.content && <a target='_blank' style={{marginLeft:20}} href={`${DOMAIN_OXT}/newadmin/crm/workbenchconfig/proclamation?readId=${data.id}`}>查看</a>}
            </span>,
        }
    ]

    renderAddInput(text, record){
        let {add} = this.state;
        return record.edit ? <Input value={add} onChange={(event) => {this.setAddInput(event.target.value)}} /> : text;
    }
    setAddInput(add){
        this.setState({add})
    }

    async updateAnnouncement(params){
        // this.setState({proclamationLoading: true})
        let res:any = await updateAnnouncement(params)
        if(res.errcode == 0){
            message.success(res.msg)
            // this.setState({proclamationLoading: false})
            return true;
        }else{
            // this.setState({proclamationLoading: false})
            return false;
        }
        
    }

    async updateWorkbenchDefined(params){
        let res:any = await updateWorkbenchDefined(params)
        // console.log(res)
        if(res.errcode == 0){
            message.success(res.msg)
            return true;
        }else{
            // message.error(res.msg)
            // this.props.dispatch(getAllList())
            return false;
        }
    }

    async updateWelcomeContent(params){
        let res:any = await updateWelcomeContentApi(params)
        if(res.errcode == 0){
            let welCome = this.props.welCome.toJS();
            params.content !== undefined && (welCome.content = params.content);
            params.title !== undefined && (welCome.title = params.title);
            this.props.dispatch(setWelcomeContent(welCome));
            message.success(res.msg)
            params.content !== undefined && this.setState({welcomeVisible: false});
            params.title !== undefined && this.setState({faceVisible: false});
        }else{
            message.error(res.msg)
            this.props.dispatch(getAllList())
        }
    }
    componentWillMount(){
        this.props.dispatch(getAllList())
    }
    renderOptions(data){
        let configSource = this.props.configSource.toJS();
        let arr:any[] = [];
        configSource.map(item=>{arr.push(item.positionName)})
        const options = data.map(item => {
            if(arr.indexOf(item.dictName) === -1){
                return <Select.Option value={item.code}>{item.dictName}</Select.Option>
            }else{
                return <Select.Option disabled value={item.code}>{item.dictName}</Select.Option>
            }
        })
        return options;
    }
    async addPositionApi(){
        if(this.state.addPositionId === 0 || !this.state.addPositionId){
            message.error('请选择职位');
            return;
        }
        this.setState({addPositionLoading: true});
        let res:any = await addPositionApi({
            positionId:this.state.addPositionId,
            tableType: 2,
            type:1,
        });
        if(res.errcode == 0){
            this.setState({addPositionVisible:false, addPositionLoading: false});
            this.props.dispatch(getConfigList({type:1, tableType:2, start:0, length:this.props.configPagination.toJS().defaultPageSize}));
        }else{
            this.setState({addPositionLoading: false});
        }
    }
    addPositionSelectOnChange = (addPositionId)=>{
        this.setState({addPositionId})
    }
    positionSelectHandleVisibleChange = (addPositionVisible) => {
        this.setState({addPositionVisible})
    }
    getProclamation=(current, pageSize)=>{
        this.props.dispatch(getProclamation({start: (current-1)*pageSize, length:pageSize}))
    }
    getConfigList=(current, pageSize)=>{
        this.props.dispatch(getConfigList({
            start: (current-1)*pageSize, 
            length:pageSize,
            tableType:2,
            type:1,
        }))
    }
    
    render(){
        const {
            faceVisible,
            configSource,
            proclamationSource,
        } = this.state
        const welCome = this.props.welCome.toJS();
        // console.log('proclamationSource',proclamationSource)
        const options = this.renderOptions(this.props.position.toJS())
        const addContent = <Spin
            spinning={this.state.addPositionLoading}
        >
            <div id='d1'>
            <div style={{margin: '5px 0',marginBottom:15}}><span>职位：</span>
                <Select 
                    style={{width: 150}}
                    placeholder={'请选择职位'}
                    onChange={this.addPositionSelectOnChange}
                    getPopupContainer={() => document.getElementById('d1') as HTMLElement}
                >
                    {options}
                </Select>
            </div>
            <div style={{textAlign:'right'}}><Button disabled={this.state.addPositionLoading} onClick={() => {this.addPositionApi()}} size='small' type='primary'>确定</Button></div> 
        </div>
        </Spin>
        return <QueueAnim>
            <Spin tip="Loading..." spinning={this.props.loading}>
        <div
            className='crm-workbench-config'
        >
            <RenderTitle 
                title='工作台欢迎区显示内容'
                buttons={[
                    <Button onClick={() => {this.setState({faceVisible:true})}} type='primary'>更换表情</Button>,
                    <Button onClick={() => {this.setState({welcomeVisible:true})}} style={{marginLeft:20}} type='primary'>编辑欢迎语</Button>,
                ]}
            />
            <table
                style={{marginBottom:20, height:'80px'}}
            >
            <tbody>
            <tr>
                <td style={{width:60}}>
                <span style={{display:'inline-block', verticalAlign:'middle', width:'60px',height:'60px', lineHeight:'60px', borderRadius:'5px', overflow:'hidden'}}>
                    <img style={{width:'100%'}} src={welCome.title} alt=""/>
                </span>
                </td>
                <td>
                <span style={{display:'inline-block', wordBreak:'break-all', fontSize: 18, marginLeft: 10, color:'#999', fontWeight:600}}>{welCome.content}</span>
                </td>
            </tr>
            </tbody>
            </table>
            {this.state.faceVisible && <RenderFaceModal
                src={welCome.title}
                id={welCome.id}
                onSave={(params) => {this.updateWelcomeContent(params)}}
                onCancel={() => {this.setState({faceVisible: false})}}
            />}
            {this.state.welcomeVisible && <RenderWelcome 
                welcomeVisible={this.state.welcomeVisible}
                content={welCome.content}
                id={welCome.id}
                onSave={(params) => {this.updateWelcomeContent(params)}}
                onCancel={() => {this.setState({welcomeVisible: false})}}
            />}


            <RenderTitle 
                title='工作台显示模块配置'
                buttons={[
                    <Popover
                        trigger="click"
                        title="新增"
                        visible={this.state.addPositionVisible}
                        onVisibleChange={this.positionSelectHandleVisibleChange}
                        placement="topRight"
                        content={addContent}
                    ><Button type='primary'>新增</Button></Popover>,
                ]}
            />
            <Table
                columns={this.configColumns}
                className='ant-table-wrapper-text-center'
                loading={this.props.configLoading}
                bordered
                dataSource={this.props.configSource.toJS()}
                scroll={{ y: 450 }}
                pagination={{
                    ...this.props.configPagination.toJS(),
                    onChange:this.getConfigList,
                    onShowSizeChange:this.getConfigList,
                }}
            />

            <RenderTitle 
                title='公告栏'
                buttons={[
                    <Button type='primary'><Link to={`${DOMAIN_OXT}/newadmin/crm/workbenchconfig/proclamation?new`}>新增公告</Link></Button>,
                ]}
            />
            <Table
                columns={this.proclamationColumns}
                className='ant-table-wrapper-text-center'
                loading={this.state.proclamationLoading}
                bordered
                scroll={{ y: 450 }}
                dataSource={this.props.proclamationSource.toJS()}
                pagination = {{
                    ...this.props.proclamationPagination.toJS(),
                    onChange:this.getProclamation,
                    onShowSizeChange:this.getProclamation,
                }}
            />

        </div>
        </Spin>
        </QueueAnim>
    }
}

interface renderSwitchPropsOnChange {
    onChange(checked:boolean): boolean;
}
interface renderSwitchProps{
    checked: boolean,
    onChange: (checked:boolean)=> boolean | Promise<boolean>; //需要返回字段 Boolean 判断是否可以改变
    id: number;
}

class RenderSwitch extends React.Component<renderSwitchProps,any>{
    constructor(props){
        super(props)
        this.state={
            checked: props.checked,
            loading: false,
        }
    }
    async onChange(checked){
        this.setState({checked:!this.state.checked,loading: true})
        let res = await this.props.onChange(checked)
        if(!res){
            this.setState({checked:!this.state.checked},()=>{
                this.setState({loading: false})
            })
        }
        this.setState({loading: false})
    }
    shouldComponentUpdate(nextProps,nextStates){
        if(nextProps.id !== this.props.id){
            this.setState({checked:nextProps.checked})
        }
        if(nextProps.id === this.props.id && nextProps.checked !== this.props.checked){
            this.setState({checked:nextProps.checked})
        }
        return true;
    }
    render(){
        return <Switch loading={this.state.loading} checked={this.state.checked} onChange={(checked)=>{this.onChange(checked)}} />
    }
}
interface renderTitleProps{
    title:string;
    buttons: any;
}
class RenderTitle extends React.Component<renderTitleProps>{
    constructor(props){
        super(props)
    }
    render(){
        const {
            title,
            buttons,
        } = this.props
        return <div className='crm-workbench-config-title-container'>
            <div className='crm-workbench-config-title'>
                <span>{title}</span>
            </div>
            <span className='rt'>
                {
                    buttons.map(item => item)
                }
            </span>
        </div>
    }
}
class RenderWelcome extends React.Component<any,any>{

    constructor(props){
        super(props)
        this.state={
            welcomeVisible: props.welcomeVisible,
            visible: false,
            content: props.content,
            loading: false,
        }
    }

    onSave(){
        this.setState({loading:true});
        if(this.state.content.length>80){
            message.error('不可超过80个字');
            this.setState({loading: false});
            return ;
        }
        this.props.onSave({content:this.state.content, id: this.props.id});
    }

    render(){
        return this.props.welcomeVisible && <Modal
            title="编辑欢迎语"
            visible={true}
            confirmLoading={this.state.loading}
            onOk={() => {this.onSave()}}
            onCancel={() => {this.props.onCancel()}}
        >
            <Input.TextArea 
                value={this.state.content}
                rows={4} 
                onChange={(e) => {this.setState({content:e.target.value})}}
            />
        </Modal>
    }
}

class RenderFaceModal extends React.Component<any,any>{
    constructor(props){
        super(props)
        // console.log('321',base64);
        this.state={
            src: '',
            loading: false,
            err: false,
            avatars:{},
            file: null as any,
            isCustom: false,
        }
        this.getBase64(props.src);
    }
    getBase64(src){ // 将地址转为base64
        var image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        // image.crossOrigin="anonymous";
        image.src = src;
        return image.onload = ()=>{
            var base64 = getBase64Image(image);
            this.setState({src:base64})
            // return base64;
        }
    }
    cropper:any
    beforeUpload = (file) => {
        const isImage = file.type.indexOf('image/') == -1 ? false : true;
        if(!isImage){
            message.error('只支持.jpg .jpeg .bmp .gif .png .svg格式');
            this.setState({err: true});
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if(!isLt2M){
            message.error('图片不可大于2M');
            this.setState({err: true});
            return false;
        }
        return isLt2M && isImage;
    }
    onChange = ({file, fileList, event}) =>{
        if(file.status == 'done'){
            this.getBase64(file.response.data)
            this.setState({loading: false});
        }else if(file.status == 'error'){
            message.error(file.response.msg || file.response.data || '服务器无响应');
            this.setState({loading: false})
        }else{
            if(!file.status){
                this.setState({loading: false})
            }else{
                this.setState({loading: true})
            }
        }
    }
    async getIconLibraryList(current){
        return await getIconLibraryListApi({length: 18, start:(current-1)*18})
    }
    async prevNextOnClick(current){
        this.setState({loading: true})
        let res:any = await this.getIconLibraryList(current)
        this.setState({avatars: res.data, loading: false})
    }
    async componentWillMount(){
        this.setState({loading: true})
        let res:any = await this.getIconLibraryList(1)
        this.setState({avatars: res.data, loading: false})
    }
    iconOnClick(src){
        this.getBase64(src)
    }
    cropperOnChange = () => {
        // console.log(value, value.getCroppedCanvas().toDataURL())
        // image in dataUrl
        //   console.log(this.refs.cropper, this.refs.cropper.getCroppedCanvas().toDataURL());
        let url = this.cropper.getCroppedCanvas().toDataURL();
        // console.log(this.cropper, base64ToBlob(url),url);
        this.setState({file: base64ToBlob(url)})
    }
    onOk = async() => {
        this.setState({loading:true});
        // console.log(this.state.file);
        let res:any = await fetchFile(FILEUPLOAD, this.state.file);
        // console.log(res);
        if(Number(res.status) === 0){
            const src = res.data;
            this.setState({src},() => {
                this.props.onSave({title: res.data, id: this.props.id})
            })
        }else{
            this.setState({loading:false});
            message.error('设置失败')
        }
    }
    render(){
        return <Modal
            title="更换表情"
            visible={true}
            onOk={this.onOk}
            onCancel={() => {this.props.onCancel()}}
            confirmLoading={this.state.loading}
        >
            <Spin
                spinning={this.state.loading}
            >
            <div style={{textAlign:'center'}}>
            <Cropper
                // ref='cropper'
                ref={(reactNode)=>{ this.cropper = reactNode}}
                dragMode='move'
                src={this.state.src}
                style={{height: 150, width: 200, display: 'inline-block'}}
                // Cropper.js options
                aspectRatio={1 / 1}
                guides={false}
                crop={this.cropperOnChange} 
                checkCrossOrigin={false}// 不检查跨域
                // getImageData={(value) => {console.log(value)}}
            />
            </div>
            <div style={{margin:'10px 0'}}>
                天吴图标库：
                <span className='rt'>
                    <Upload 
                        action={FILEUPLOAD}
                        beforeUpload={this.beforeUpload}
                        data={{}}
                        accept={'image/*'}
                        showUploadList={false}
                        onChange={this.onChange}
                    >
                        <span style={{cursor:'pointer', color:'#22baa0'}}>+ 上传本地图片</span>
                    </Upload>
                </span>
            </div>
            <div>   
            {
                this.state.avatars.result && <Avatars
                dataSource={this.state.avatars}
                onClick={(src) => {this.iconOnClick(src)}}
                onChange={(current) => {this.prevNextOnClick(current)}}
            />
            }
            </div>
            </Spin>
        </Modal>
    }
}

class Avatars extends React.Component<any>{
    constructor(props){
        super(props)
    }

    renderAvatar(){
        let avatarProps:any ={
            className: 'crm-workbench-config-avatar',
            shape: 'square',
            size: 'large',
        }
        const {result} = this.props.dataSource;
        let avatars:any[] = [];
        if(result){
            result.map(item =>{
                avatars.push(<Avatar
                    {...avatarProps}
                    src={item.content}
                    onClick={() => {this.props.onClick(item.content)}}
                 />)
            })
        }
        const differ = 18 - avatars.length;
        if(differ !== 0){
            for(let i = 0;i<differ; i++){
                avatars.push(<Avatar
                    {...avatarProps}
                    className= 'crm-workbench-config-avatar crm-workbench-config-avatar-noSrc'
                 />)
            }
        }
        return avatars;
    }

    render(){
        const {current, pagesize, total} = this.props.dataSource;
        const totalPage = total / pagesize;
        const avatars = this.renderAvatar();
        return <div className='crm-avatars-container'>
            <div style={{height: '100%'}} className='crm-avatars-container-left'>
                <i 
                    className={`crmiconfont crmicon-shangyiye-bukedianji 
                        ${current > 1 ? 'crmiconfont-enable' : 'crmiconfont-disabled'}
                    `}
                    onClick={() => {
                        current > 1 && this.props.onChange(current-1);
                    }}
                ></i>
            </div>
            <div className='crm-avatars-container-content'>
                {<List
                    grid={{ gutter: 8, column: 6}}
                    dataSource={avatars}
                    renderItem={item => (
                    <List.Item>
                        {item}
                    </List.Item>
                    )}
                />}
                <div style={{textAlign:'center'}}>
                    {current} / {Math.ceil(totalPage) > 0 ? Math.ceil(totalPage) : 1}
                </div>
            </div>
            <div style={{height: '100%'}} className='crm-avatars-container-right'>
                <i 
                    className={`crmiconfont crmicon-xiayiye-kedianji 
                        ${current < totalPage ? 'crmiconfont-enable' : 'crmiconfont-disabled'}
                    `}
                    onClick={() => {
                        current < totalPage && this.props.onChange(current+1);
                    }}
                ></i>
            </div>
        </div>
    }
}

interface TStateProps {
    configSource: any[];
    configPagination: any,
    proclamationSource: any[];
    loading: boolean;
    proclamationPagination:any;
    welCome:any;
    position:any;
    configLoading:any;
}

const mapStateToProps = (state: any): TStateProps => {
	return {
		configSource: state.getIn(['crmWorkbenchConfig', 'configSource']),  //职位工作台设置列表数据源 
		configPagination: state.getIn(['crmWorkbenchConfig', 'configPagination']),  //职位工作台设置列表分页
        proclamationSource: state.getIn(['crmWorkbenchConfig', 'proclamationSource']),  //公告列表数据源
        loading: state.getIn(['crmWorkbenchConfig', 'loading']),
        proclamationPagination: state.getIn(['crmWorkbenchConfig', 'proclamationPagination']),  //公告列表分页
        welCome: state.getIn(['crmWorkbenchConfig', 'welCome']),
        position: state.getIn(['crmWorkbenchConfig', 'position']),  //所有职位列表
        configLoading: state.getIn(['crmWorkbenchConfig', 'proclamationLoading']), //职位工作台设置列表加载中
	}
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps)(WorkbenchConfig)