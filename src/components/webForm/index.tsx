import React from 'react'
import { connect } from 'react-redux';
import * as Immutable from 'immutable';
import { ROUTER_PATH } from '../../global/global';
import moment from 'moment';
import 'braft-editor/dist/braft.css'
import {
    Form,
    Input,
    Icon,
    Select,
    Row,
    Col,
    Button,
    DatePicker,
    Upload,
    Modal,
    message,
    Table,
    Tag,
    Spin
} from 'antd';
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
import Guest from './guest'
import { fetchFn, fetchFileL } from '../../util/fetch';
import { statePaginationConfig } from '../../util/pagination';
import SelectCity from '../../components/select-city/index';
import addressCityaa from '../../components/select-city/address.json';
import FilterTableHeader from '../../components/common/FilterTableHeader';
import {
    activityCheckDis,
    activitySignUpDis,
    activityAddDis,
} from '../../action/website/websiteAction'
import query from '../../util/query';
import { DOMAIN_OXT } from '../../global/global';
import Udeitor from '../../components/common/udeitor';
import EditorImg from '../../components/common/react-copper';
import {base64ToBlob} from '../../util/base64ToBlob'
const { Option } = Select;
const mapData = {
    1: '柚讲堂',
    2: '柚来了',
    3: '其他活动'
}
import "../../components/webForm/index.less";
const ueditorConfig = [
    'undo', //撤销
    'bold', //加粗
    'italic', //斜体
    'underline', //下划线
    'fontfamily', //字体
    'fontsize', //字号
    'link', //超链接
    'forecolor', //字体颜色
    'justifyleft', //居左对齐
    'justifyright', //居右对齐
    'justifycenter', //居中对齐
    'justifyjustify', //两端对齐
    'removeformat', //清除格式
    'simpleupload', //单图上传
]
class WebSiteForm extends React.Component<any, any>{
    constructor(props: any) {
        super(props)
        this.state = {
            currentPage: 0,
            pageSize: 5,
            num: 0,
            addParams: {
                subject: '',
                id: '',
                type: '',
                actStartTime: '',
                actEndTime: '',
                provinceId: '',
                cityId: '',
                areaName: '',
                address: '',
                signEndTime: '',
                cover: '',
                content: '',
                guests: [
                    {
                        id: this.onlyOny(),
                        name: '',
                        profilePhoto: '',
                        introduction: ''
                    }
                ],
                flow: ''
            },
            image: new Set(),
            image1: new Set(),
            endOpen: false,
            startValue: '',
            endValue: '',
            signEndTime: '',
            cityData: [],
            tagName: [],
            provinceId: '',
            cityId: '',
            areaName: '',
            contentShowModel:false,
            file:'',
            buttonLoabgding:false
        }
    }
    insuranceCitySelect: any;
    componentWillMount() {
        const { dispatch } = this.props
        let parmsType
        if (this.props.type == 2) {
            const id = query('id')
            let promise = new Promise((resolve, reject) => {
                dispatch(activityCheckDis({ id, resolve }))
            }).then((data) => {
             })
            dispatch(activitySignUpDis({ currentPage: this.state.currentPage, pageSize: this.state.pageSize, activityId: query('id') }))
        }
        if (this.props.type == 3) {
            const id = query('id')
            let promise = new Promise((resolve, reject) => {
                dispatch(activityCheckDis({ id, resolve }))
            }).then((data) => {
                const value: any = data
                let addParams = this.state.addParams
                parmsType = value.data.data.type
                fetchFn(`${DOMAIN_OXT}/apiv2_/website/api/address/actarea`, { type: parmsType }, {
                    method: 'get',
                }).then(data => {
                    let valueaa = value.data.data
                    let gust = valueaa.guests
                    if (typeof gust === 'string') {
                        gust = JSON.parse(gust)
                    }
                    valueaa.guests = gust
                    let { guests } = valueaa
                    guests.map((val, ind) => {
                        val.id = this.onlyOny() + ind
                    })
                    this.setState({
                        cityData: data.data,
                        startValue: addParams.actStartTime,
                        endValue: addParams.actEndTime,
                        signEndTime: addParams.signEndTime,
                        addParams: valueaa,
                    })
                })
            })
        }
    }
    onlyOny() {
        return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
    }
    timerStarttoUnix(str) {
        let a = str + " 00:00:00"
        return (new Date(a).getTime()) / 1000
    }
    timerEndtoUnix(str) {
        let a = str + " 23:59:59"
        return (new Date(a).getTime()) / 1000
    }
    onSearch = (name, value, title) => {
        const {
            dispatch,
        } = this.props;
        let tagStart = value[0].format('YYYY-MM-DD')
        let tagEnd = value[1].format('YYYY-MM-DD')
        let tagArr = [{ title: '报名时间：', items: value[0].format('YYYY.MM.DD') + '-' + value[1].format('YYYY.MM.DD') }]
        this.setState({
            tagName: tagArr
        })
        dispatch(activitySignUpDis({ currentPage: 0, pageSize: 5, startSignTime: tagStart, endSignTime: tagEnd, activityId: query('id') }))
    }
    columns: any = () => [
        {
            title: '姓名',
            dataIndex: 'name',
            className: 'centerStyle',
            render: (text, recode) => {
                return text
            }
        }, {
            title: '手机',
            dataIndex: 'phone',
            className: 'centerStyle',
            key: 'telphone',
            render: (text, recode) => {
                return text
            }
        }, {
            title: '公司',
            dataIndex: 'company',
            className: 'centerStyle',
            key: 'conpany',
            width: 150,
            render: (text, recode) => {
                return text
            }
        }, {
            title: '职位',
            key: 'type',
            className: 'centerStyle',
            dataIndex: 'position',
            render: (text, record) => (
                text
            ),
        }, {
            title: '邮箱',
            key: 'mail',
            className: 'centerStyle',
            dataIndex: 'mail',
            render: (text, recode) => {
                return text
            }
        },
        {
            title: <FilterTableHeader
                title='报名时间'
                name='startSignTime endSignTime'
                form={this.props.form}
                initialValue=''
                onOk={this.onSearch}
            >
                <RangePicker format='YYYY.MM.DD' getCalendarContainer={(triggerNode: any) => triggerNode.parentNode} />

            </FilterTableHeader>,
            className: 'centerStyle',
            dataIndex: 'signTimeString',
            key: 'signTimeString',
            render: (text, recode) => {
                return text
            }
        },
    ];
    pagination = () => {
        const {
            dispatch,

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
            total: this.props.baseData.signUp.recordsTotal,
        },
            (newParams) => activitySignUpDis({ ...Prams, ...newParams }),
            dispatch,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            },
        )
    }
    selectCityParams1 = ({ selectVal = [], selectName = [] } = {}) => {
        let proId = this.props.baseData.check.provinceId
        let ciId = this.props.baseData.check.cityId
        return {
            deepMap: [{ name: '省', value: proId }, { name: '市', value: ciId },],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder: '请选择省市',
            address: addressCityaa, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 200,
            }, /* input 的样式 */
            onChange: (selectVal, selectName, code) => {
                let { addParams } = this.state
                addParams.provinceId = selectVal[0]
                addParams.cityId = selectVal[1]
                addParams.areaName = selectName[0] + ' ' + selectName[1]
                this.setState({
                    addParams
                })
            },
        }
    }
    selectCityParams = ({ selectVal = [], selectName = [] } = {}) => {
        return {
            deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined },],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder: '请选择省市',
            address: addressCityaa, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            onChange: (selectVal, selectName, code) => {
                let { addParams } = this.state
                addParams.provinceId = selectVal[0]
                addParams.cityId = selectVal[1]
                addParams.areaName = selectName[0] + ' ' + selectName[1]
                this.setState({
                    addParams
                })
            },
        }
    }
    handleChange(value) {
        let newState = Immutable.fromJS(this.state.addParams).set('type', value)
        this.setState({
            addParams: newState.toJS(),
        })
    }
    disabledStartDate = (startValue) => {
        if (this.props.type === 1 || this.props.type === 3) {
            const endValue = this.state.endValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        } else {
            let start, end, hures: any, minutes: any
            const endValue = this.state.endValue;
            if (!startValue) {
                start = new Date(this.props.baseData.check.actStartTime * 1000)
            } else {
                start = startValue.valueOf()
            }
            if (!endValue) {
                end = this.props.baseData.check.actEndTime * 1000
            } else {
                end = endValue.valueOf()
            }
            return start >= end
        }
    }
    disabledEndDate = (endValue) => {
        if (this.props.type === 1) {
            const startValue = this.state.startValue;
            if (!endValue || !startValue) {
                return false;
            }
            let end = moment(endValue).format('YYYY-MM-DD');
            let start = moment(startValue).format("YYYY-MM-DD");
            return end < start;
        } else {
            const startValue = this.state.startValue;
            let start, end, hures: any, minutes: any
            if (!startValue) {
                start = new Date(this.props.baseData.check.actStartTime * 1000)
            } else {
                start = startValue.valueOf()
            }
            if (!endValue) {
                end = this.props.baseData.check.actEndTime * 1000
            } else {
                end = endValue.valueOf()
            }
            return end <= start
        }
    }
    range(start, end) {
        const result: any = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    disabledStartTime = () => {
        let start, end, hures: any, minutes: any
        let flag = true
        const startValue = this.state.startValue;
        const endValue = this.state.endValue;
        if (!startValue) {
            if (!this.props.baseData.check.actStartTime) {
                flag = false
            }
            start = new Date(this.props.baseData.check.actStartTime * 1000)
        } else {
            start = startValue.valueOf()
        }
        if (!endValue) {
            end = this.props.baseData.check.actEndTime * 1000
        } else {
            end = endValue.valueOf()
        }
        if (!flag) {
            hures = () => [],
                minutes = () => []
        } else {
            hures = () => new Date(start).getDate() === new Date(end).getDate() ? this.range(0, 24).splice(new Date(end).getHours(), 24) : []
            minutes = () => new Date(start).getDate() === new Date(end).getDate() ?
                (new Date(start).getHours() === new Date(end).getHours() ? this.range(0, 60).splice(new Date(end).getMinutes(), 60) : []) : []
        }
        return {
            disabledHours: hures,
            disabledMinutes: minutes,
        }
    }
    disabledEndTime = () => {
        let start, end, hures: any, minutes: any
        let flag = true
        const startValue = this.state.startValue;
        const endValue = this.state.endValue;
        if (!startValue) {
            if (!this.props.baseData.check.actStartTime) {
                flag = false
            }
            start = this.props.baseData.check.actStartTime * 1000
        } else {
            start = startValue.valueOf()
        }
        if (!endValue) {
            end = this.props.baseData.check.actEndTime * 1000
        } else {
            end = endValue.valueOf()
        }
        if (!flag) {
            hures = () => [],
                minutes = () => []
        } else {
            hures = () => new Date(start).getDate() === new Date(end).getDate() ? this.range(0, 24).splice(0, new Date(start).getHours()) : []
            minutes = () => new Date(start).getDate() === new Date(end).getDate() ?
                (new Date(start).getHours() === new Date(end).getHours() ? this.range(0, 60).splice(0, new Date(start).getMinutes() + 1) : []) : []

        }
        return {

            disabledHours: hures,
            disabledMinutes: minutes,
        }
    }
    onChange = (field, val) => {
        let value
        if (val != '' && val) {
            value = new Date(val.format()).getTime() / 1000

        } else {
            value = val
        }

        let newState
        if (field === 'startValue') {
            newState = Immutable.fromJS(this.state.addParams).set('actStartTime', value)

        } else if (field === 'endValue') {
            newState = Immutable.fromJS(this.state.addParams).set('actEndTime', value)
        }
        this.setState({
            addParams: newState.toJS(),
            [field]: val,
        });
    }
    onStartChange = (value) => {
        this.onChange('startValue', value);
    }
    onEndChange = (value) => {
        this.onChange('endValue', value);
    }
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    onCityChange = (v) => {
        const cityData = this.state.cityData
        let areaPro = ''
        let areaCity = ''
        for (let i = 0; i < cityData.length; i++) {
            if (cityData[i].value == v[0]) {
                areaPro = cityData[i].name
                for (let k = 0; k < cityData[i].children.length; k++) {
                    if (cityData[i].children[k].value == v[1]) {
                        areaCity = cityData[i].children[k].name
                    }
                }
            }
        }
        let areaName = areaPro + " " + areaCity
        let newState = Immutable.fromJS(this.state.addParams).set('provinceId', v[0]).set('cityId', v[1]).set('areaName', areaName)
        this.setState({
            addParams: newState.toJS(),
        })
    }
    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s;
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
    subChange(e) {
        let value = this.textCheck(e.target.value)
        if (value.length > 50) {
            message.error('活动主题请控制在50个字之内')
        }
        let newState = Immutable.fromJS(this.state.addParams).set('subject', e.target.value)
        this.setState({
            addParams: newState.toJS()
        })
    }
    textCheck(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "")
    }
    onAreaChange(e) {
        let value = this.textCheck(e.target.value)
        if (value.length > 50) {
            message.error('活动地址请控制在50个字之内')
        }
        let newState = Immutable.fromJS(this.state.addParams).set('address', e.target.value)
        this.setState({
            addParams: newState.toJS()
        })
    }
    onSignEndChange(val) {
        let value
        if (val != '' && val) {
            value = new Date(val.format()).getTime() / 1000

        } else {
            value = val
        }
        let newState = Immutable.fromJS(this.state.addParams).set('signEndTime', value)
        this.setState({
            addParams: newState.toJS(),
            signEndTime: val
        });
    }
    savaClick = () => {
        let UE = window.UE;
        if (this.state.addParams.subject == '') {
            message.error('请填写活动主题')
            return
        }
        if (this.state.addParams.type == '') {
            message.error('请选择活动类型')
            return
        }
        if (this.state.addParams.cityId == '') {
            message.error('请选择省市')
            return
        }
        if (this.state.addParams.actStartTime == '') {
            message.error('请选择开始时间')
            return
        }
        if (this.state.addParams.signStartTime == '') {
            message.error('请选择结束时间')
            return
        }
        if (this.state.addParams.cover == '') {
            message.error('请上传活动封面')
            return
        }
        if (UE.getEditor("content").getContent() == "<p></p>") {
            message.error('请上传活动内容')
            return
        }
        if (this.props.type === 1) {
            let aa = this.clicka.info()
            let flag = true
            if (aa.name == '') {
                message.error('请填写主讲嘉宾姓名')
                return flag = false
            }
            if (aa.profilePhoto == '') {
                message.error('请上传主讲嘉宾头像')
                return flag = false
            }
            if (aa.introduction == '') {
                message.error('请填写主讲嘉宾简介')
                return flag = false
            }
            if (!flag) {
                return
            }
            let gust = this.state.addParams.guests
            let addParams = this.state.addParams
            gust.map((val, index) => {
                if (aa.id == val.id) {
                    val.name = aa.name,
                        val.introduction = aa.introduction,
                        val.profilePhoto = aa.profilePhoto
                }
            })
            addParams.guests = gust
            let { signEndTime, actEndTime, actStartTime, guests } = addParams
            if (typeof guests != 'string') {
                guests = JSON.stringify(guests)
            }
            const { dispatch } = this.props
            if (actStartTime > actEndTime) {
                message.error('活动开始时间小于活动结束时间')
                return
            }
            dispatch(activityAddDis({ ...addParams, signEndTime, actEndTime, actStartTime, guests, richTextFlow: UE.getEditor("flow").getContent(), richTextContent: UE.getEditor("content").getContent() }, () => {
                window.location.href = `${ROUTER_PATH}/newadmin/web/activitymanergment`
            }))
        } else {
            let aa = this.state.addParams.guests
            if (typeof aa == 'string') {
                aa = JSON.parse(aa)
            } else {
                aa = aa
            }
            let flag = true

            aa.map((val, ind) => {
                if (val.name == '') {
                    message.error('请填写主讲嘉宾姓名')
                    return flag = false
                }
                if (val.profilePhoto == '') {
                    message.error('请上传主讲嘉宾头像')
                    return flag = false
                }
                if (val.introduction == '') {
                    message.error('请填写主讲嘉宾简介')
                    return flag = false
                }
            })
            if (!flag) {
                return
            }
            let gust = this.state.addParams.guests
            let addParams = this.state.addParams
            let { signEndTime, actEndTime, actStartTime, guests } = addParams
            if (typeof guests != 'string') {
                guests = JSON.stringify(gust)
            } else {
                guests = gust
            }
            if (actStartTime > actEndTime) {
                message.error('活动开始时间小于活动结束时间')
                return
            }
            const { dispatch } = this.props
            dispatch(activityAddDis({ ...addParams, signEndTime, actEndTime, actStartTime, guests, id: query('id'), richTextFlow: UE.getEditor("flow").getContent(), richTextContent: UE.getEditor("content").getContent() },
                () => {
                    window.location.href = `${ROUTER_PATH}/newadmin/web/activitymanergment`
                }
            ))
        }
    }
    cellClick() {
        window.location.href = `${ROUTER_PATH}/newadmin/web/activitymanergment`
    }
    clicka: any;
    handleEmail(value) {
        let addParams = this.state.addParams
        let gust = addParams.guests
        let aa
        if (typeof gust == 'string') {
            aa = JSON.parse(gust)
        } else {
            aa = gust
        }
        aa.map((val, index) => {
            if (val.id === value.id) {
                val.name = value.name,
                    val.profilePhoto = value.profilePhoto,
                    val.introduction = value.introduction
            }
        })
        addParams.guests = aa
        this.setState({
            addParams
        })
    }
    addChange() {
        let gust = this.state.addParams.guests
        let addParams = this.state.addParams
        let num = this.onlyOny() + gust.length
        let newObj = {
            id: num,
            name: '',
            profilePhoto: '',
            introduction: ''
        }
        if (typeof gust === 'string') {
            gust = JSON.parse(gust)
        }
        gust.push(newObj)
        addParams.guests = gust
        this.setState({
            addParams,
            num: num
        })
    }
    delect(ind, index) {
        const __this = this
        confirm({
            title: '提示',
            content: `是否删除嘉宾${index + 1}`,
            onOk() {
                let gust = __this.state.addParams.guests
                let gustFile = gust.filter(a => a.id != ind)
                let addParams = __this.state.addParams
                addParams.guests = gustFile
                __this.setState({
                    addParams
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    log(e, val, ind) {
        this.setState({
            tagName: []
        })
        const { dispatch } = this.props
        dispatch(activitySignUpDis({ currentPage: 0, pageSize: 5, activityId: query('id') }))
    }
    imgClose() {
        let newState = Immutable.fromJS(this.state.addParams).set('cover', '')
        this.setState({
            addParams: newState.toJS()
        })
    }
    editer:any
    dataURLtoFile (dataurl, filename = 'file') {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {type: mime})
      }
    contenthandleOk= ()=>{
        this.setState({
            contentShowModel:false,
            buttonLoabgding:true
        });
        let aa = this.editer.cropImage()//子元素裁剪后的base64
        let Formdata = this.dataURLtoFile(aa)//转换成file格式
        let res :any=  fetchFileL(`${DOMAIN_OXT}/api/fileUpload/common`, Formdata);
        let addParams = this.state.addParams
        res.then(((res)=>{
            if(res.status == 0){
                const src = res.data;
                addParams.cover = src
                this.setState({
                    addParams,
                    buttonLoabgding:false
                });
            }else{
                message.error('设置失败')
            }
        }))
    }
    contenthandleCancel(){
        this.setState({
            contentShowModel:false
      });
    }
    copperProps(e){
        this.setState({
            buttonLoabgding:true
        })
        let files = e.target.files[0]
        let reader = new FileReader()
        let dataU = reader.readAsDataURL(files)
        let accept: string[] = ['.jpg', '.jpeg', '.bmp', '.png']
        let fileType = files.name.split('.')
        fileType = '.' + fileType.pop()
        let isJPG = false
        for (let i = 0; i < accept.length; i++) {
            if (fileType == accept[i]) {
                isJPG = true;
                break
            }
        }
        if (!isJPG) {
            message.error(`活动封面格式错误`)
            return false
        }
        reader.onload=(e:any)=>{
           this.setState({
                contentShowModel:true,
                file:e.target.result,
                buttonLoabgding:false
            })
        }
    }
    render() {
        const { startValue, endValue, endOpen, signEndTime } = this.state;
        const type = this.props.type
        let baseData
        let gust
        if (type === 2 || type === 3) {
            baseData = this.props.baseData.check
            if (baseData.guests != '') {
                gust = JSON.parse(baseData.guests)
            } else {
                gust = []
            }
        }
        let guests
        let typss
        if (type === 3) {
            guests = this.state.addParams.guests
            if (typeof guests == 'string') {
                guests = JSON.parse(guests)
            }
            typss = this.state.addParams.type
            typss = typss.toString()
        }
        let timerw = (new Date()).getTime()
        const keyCity = [this.props.baseData.check.provinceId, this.props.baseData.check.cityId]
        const {addParams} = this.state
        return (
            <Spin spinning={false} delay={1000}>
            <div className="webForm">
                {type === 2 ? <p className='activity-detail'>
                    <span>活动详情</span>
                </p> : ''}
                <Row>
                    <Col span={24}>
                        <table className='tableborder'>
                            <tr className='tableborder'>
                                <td className='bgc'>活动主题&nbsp;&nbsp;<span className='icon-require'>*</span></td>
                                <td colSpan={2}>
                                    {type === 2 ? <span style={{ display: 'inline-block', width: '100%', textAlign: 'left' }}>{baseData.subject}</span> :
                                        (type === 3 ? <Input onChange={(value) => this.subChange(value)} value={this.state.addParams.subject} /> : <Input onChange={(value) => this.subChange(value)} placeholder={type === 3 ? baseData.subject : "请填写活动主题"} />)}
                                </td>
                                <td className='bgc' rowSpan={5}><Col className='text-top' span={20}>活动封面&nbsp;&nbsp;<span className='icon-require'>*</span></Col></td>
                                <td rowSpan={5} colSpan={2} className='text-left'>
                                    {type === 2 
                                    ? 
                                    <span style={{ display: 'inline-block', height: '190px', width: '100%' }} ><img style={{ display: 'inline-block', maxHeight: '190px', maxWidth: '100%' }} src={baseData.cover} /></span> 
                                    :
                                    <Row type="flex" justify="space-between" align="middle">
                                        <Col span={16}>
                                            <div className='img-left' style={{ position: 'relative' }}>
                                                {this.state.addParams.cover == '' 
                                                ? 
                                                '' 
                                                : 
                                                <Icon type="close" style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => this.imgClose()} />}
                                                {type === 3 
                                                ? 
                                                <span style={{ display: 'inline-block', height: '190px', width: '100%' }}><img style={{ display: 'inline-block', maxHeight: '190px', mixMidth: '100%' }} src={this.state.addParams.cover} alt="" /></span> 
                                                : 
                                                (
                                                    this.state.addParams.cover == '' 
                                                    ? 
                                                    <Icon type="picture" style={{ fontSize: 60, color: '#d9d9d9', position: 'absolute', left: '40%', top: '30%' }} /> 
                                                    : 
                                                    <span style={{ display: 'inline-block', height: '190px', width: '100%' }}><img style={{ display: 'inline-block', maxHeight: '190px', maxMidth: '100%' }} src={this.state.addParams.cover} alt="" /></span>)
                                                }
                                            </div>
                                        </Col>
                                        <Col span={7}>
                                            <div className='upload-right'>
                                                <Row><span>图片小于16M，格式：jpg、png、bmp，建议尺寸大于750×426px</span></Row>
                                                <Row style={{ marginTop: 20,position:'relative' }}>
                                                    <Modal
                                                    className='alincenter'
                                                    title="编辑活动封面"
                                                    visible={this.state.contentShowModel}
                                                    onOk={()=>this.contenthandleOk()}
                                                    onCancel={()=>this.contenthandleCancel()}
                                                    key={Math.random()}
                                                    >
                                                        <EditorImg 
                                                            imgsrc={this.state.file}
                                                            ref={node => this.editer = node}
                                                        />
                                                    </Modal>
                                                    <label className='uploadLable' htmlFor="xFile">
                                                        <Icon type="upload" /> 
                                                        上传文件
                                                    </label>
                                                        <input 
                                                                key={Math.random()}
                                                                type="file" 
                                                                onChange={(e)=>this.copperProps(e)} 
                                                                id="xFile" 
                                                                style={{position:'absolute',clip:'rect(0 0 0 0)'}}
                                                            />
                                                    <Button className='uploadButton' type='primary' ghost loading={this.state.buttonLoabgding} key={Math.random()}>
                                                    
                                                    </Button>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>}
                                </td>

                            </tr>
                            <tr className='tableborder'>
                                <td className='bgc'>活动类型&nbsp;&nbsp;<span className='icon-require'>*</span></td>
                                <td colSpan={2}>
                                    {type === 2 ? <span style={{ display: 'inline-block', width: '100%', textAlign: 'left' }}>{mapData[baseData.type]}</span> : (type === 3 ? <Select
                                        defaultValue={typss}
                                        onChange={value => this.handleChange(value)}
                                        style={{ width: '100%' }}
                                        key={typss}
                                    >
                                        <Option value='1'>柚讲堂</Option>
                                        <Option value='2'>柚来了</Option>
                                        <Option value='3'>其他活动</Option>
                                    </Select> : <Select
                                        placeholder="请选择活动类型"
                                        onChange={value => this.handleChange(value)}
                                        style={{ width: '100%' }}
                                    >
                                            <Option value="1">柚讲堂</Option>
                                            <Option value="2">柚来了</Option>
                                            <Option value="3">其他活动</Option>
                                        </Select>)}
                                </td>
                            </tr>
                            <tr className='tableborder'>
                                <td className='bgc'>活动时间&nbsp;&nbsp;<span className='icon-require'>*</span></td>
                                <td colSpan={2}>
                                    {type === 2 ? <span style={{ display: 'inline-block', width: '100%', textAlign: 'left' }}>{this.ShowtimestampToTime(baseData.actStartTime)}--{this.ShowtimestampToTime(baseData.actEndTime)}</span> :
                                        (type === 3 ?
                                            <Row type="flex" justify="space-around" align="middle">
                                                <Col span={11}>
                                                    {startValue !== '' ?
                                                        <DatePicker
                                                            disabledDate={this.disabledStartDate}
                                                            disabledTime={this.disabledStartTime}
                                                            showTime={{ format: 'HH:mm' }}
                                                            format="YYYY-MM-DD HH:mm"
                                                            value={startValue}
                                                            placeholder="请选择开始时间"
                                                            onChange={this.onStartChange}
                                                            onOpenChange={this.handleStartOpenChange}
                                                            style={{ width: '100%' }}
                                                            key={timerw}
                                                        /> :
                                                        <DatePicker
                                                            disabledDate={this.disabledStartDate}
                                                            disabledTime={this.disabledStartTime}
                                                            showTime={{ format: 'HH:mm' }}
                                                            defaultValue={moment(new Date(this.props.baseData.check.actStartTime * 1000), "YYYY-MM-DD HH:mm")}
                                                            format="YYYY-MM-DD HH:mm"
                                                            value={startValue}
                                                            placeholder="请选择开始时间"
                                                            onChange={this.onStartChange}
                                                            onOpenChange={this.handleStartOpenChange}
                                                            style={{ width: '100%' }}
                                                            key={timerw}
                                                        />
                                                    }

                                                </Col>
                                                <Col span={2}>
                                                    <span>至</span>
                                                </Col>
                                                <Col span={11}>
                                                    {endValue !== '' ?
                                                        <DatePicker
                                                            disabledDate={this.disabledEndDate}
                                                            disabledTime={this.disabledEndTime}
                                                            showTime={{ format: 'HH:mm' }}
                                                            format="YYYY-MM-DD HH:mm"
                                                            value={endValue}
                                                            placeholder="请选择结束时间"
                                                            onChange={this.onEndChange}
                                                            open={endOpen}
                                                            onOpenChange={this.handleEndOpenChange}
                                                            style={{ width: '100%' }}
                                                            key={timerw}
                                                        /> :
                                                        <DatePicker
                                                            disabledDate={this.disabledEndDate}
                                                            disabledTime={this.disabledEndTime}
                                                            defaultValue={moment(new Date(this.props.baseData.check.actEndTime * 1000), "YYYY-MM-DD HH:mm")}
                                                            showTime={{ format: 'HH:mm' }}
                                                            format="YYYY-MM-DD HH:mm"
                                                            value={endValue}
                                                            placeholder="请选择结束时间"
                                                            onChange={this.onEndChange}
                                                            open={endOpen}
                                                            onOpenChange={this.handleEndOpenChange}
                                                            style={{ width: '100%' }}
                                                            key={timerw}
                                                        />

                                                    }

                                                </Col>

                                            </Row>
                                            : <Row type="flex" justify="space-around" align="middle">
                                                <Col span={11}>
                                                    <DatePicker
                                                        disabledDate={this.disabledStartDate}
                                                        disabledTime={this.disabledStartTime}
                                                        showTime={{ format: 'HH:mm' }}
                                                        format="YYYY.MM.DD HH:mm"
                                                        value={startValue}
                                                        placeholder="请选择开始时间"
                                                        onChange={this.onStartChange}
                                                        onOpenChange={this.handleStartOpenChange}
                                                        style={{ width: '100%' }}

                                                    />
                                                </Col>
                                                <Col span={2}>
                                                    <span>至</span>
                                                </Col>
                                                <Col span={11}>
                                                    <DatePicker
                                                        disabledDate={this.disabledEndDate}
                                                        disabledTime={this.disabledEndTime}
                                                        showTime={{ format: 'HH:mm' }}
                                                        format="YYYY.MM.DD HH:mm"
                                                        value={endValue}
                                                        placeholder="请选择结束时间"
                                                        onChange={this.onEndChange}
                                                        open={endOpen}
                                                        onOpenChange={this.handleEndOpenChange}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Col>

                                            </Row>)}

                                </td>
                            </tr>
                            <tr className='tableborder'>
                                <td className='bgc'>活动地点&nbsp;&nbsp;<span className='icon-require'>*</span></td>
                                <td colSpan={2}>
                                    {type === 2 ? <span style={{ display: 'inline-block', width: '100%', textAlign: 'left' }}>{baseData.areaName}{baseData.address}</span> :
                                        (type === 3 ? <Row type="flex" justify="space-around" align="middle">
                                            <Col span={8} key={this.props.baseData.provinceId}>
                                                <SelectCity params={this.selectCityParams1()} key={keyCity.join('')}> </SelectCity>
                                            </Col>
                                            <Col span={1}>
                                                <span></span>
                                            </Col>
                                            <Col span={15}>
                                                <Input style={{ width: '100%' }} value={this.state.addParams.address} onChange={(e) => this.onAreaChange(e)} />
                                            </Col>
                                        </Row> : <Row type="flex" justify="space-around" align="middle">
                                                <Col span={8}>
                                                    <SelectCity params={this.selectCityParams(undefined)}> </SelectCity>
                                                </Col>
                                                <Col span={1}>
                                                    <span></span>
                                                </Col>
                                                <Col span={15}>
                                                    <Input style={{ width: '100%' }} placeholder="请填写详细地址" onChange={(e) => this.onAreaChange(e)} />
                                                </Col>
                                            </Row>)}
                                </td>
                            </tr>
                            <tr className='tableborder'>
                                <td className='bgc'>报名截止时间&nbsp;&nbsp;<span className='icon-require'>*</span></td>
                                <td colSpan={2}>
                                    {type === 2 ? <span style={{ display: 'inline-block', width: '100%', textAlign: 'left' }}>{this.ShowtimestampToTime(baseData.signEndTime)}</span> : (type === 3 ?
                                        (signEndTime !== '' ?
                                            <DatePicker
                                                showTime={{ format: 'HH:mm' }}
                                                format="YYYY.MM.DD HH:mm"
                                                value={signEndTime}
                                                key={timerw}
                                                onChange={(value) => this.onSignEndChange(value)}
                                                placeholder="请选择报名截止时间"
                                                style={{ width: '100%' }}
                                            />
                                            : <DatePicker
                                                showTime={{ format: 'HH:mm' }}
                                                format="YYYY.MM.DD HH:mm"
                                                defaultValue={moment(new Date(this.props.baseData.check.signEndTime * 1000), "YYYY-MM-DD HH:mm")}
                                                value={signEndTime}
                                                key={timerw}
                                                onChange={(value) => this.onSignEndChange(value)}
                                                placeholder="请选择报名截止时间"
                                                style={{ width: '100%' }}
                                            />)

                                        : <DatePicker
                                            showTime={{ format: 'HH:mm' }}
                                            format="YYYY.MM.DD HH:mm"
                                            value={signEndTime}
                                            onChange={(value) => this.onSignEndChange(value)}
                                            placeholder="请选择报名截止时间"
                                            style={{ width: '100%' }}
                                        />)}
                                </td>
                            </tr>
                            <tr className='tr-position tableborder'>
                                <td className='bgc'><Col className='text-top'>活动内容&nbsp;&nbsp;<span className='icon-require'>*</span></Col></td>
                                <td colSpan={5}>
                                    {type === 2 ? <span style={{ display: 'inline-block', width: '100%', textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: baseData.content }}></span> : (type === 3?
                                        <div className="editor-wrap" style={{border:'none'}}>
                                            {addParams.content?<Udeitor id='content' config={ueditorConfig} key={addParams.id} defaultValue={addParams.content}></Udeitor>
                                            :
                                            null}
                                        </div>
                                        : <div className="editor-wrap" style={{border:'none'}}>
                                            <Udeitor id='content' config={ueditorConfig} key={1}></Udeitor>
                                        </div>)}
                                </td>
                            </tr>
                            <tr className='tr-position add-tr tableborder'>

                                <td className='bgc'><Col className='text-top'>主讲嘉宾&nbsp;&nbsp;<span className='icon-require'>*</span></Col></td>
                                <td colSpan={5} style={{ textAlign: 'left', background: '#f0f2f5', padding: '0' }}>
                                    {type === 2 ? gust.map((val, index) => {
                                        return <div>
                                            <p style={{ textAlign: 'left', height: '35px', padding: '0 5px' }}>主讲嘉宾{index + 1}</p>
                                            <Row type="flex" justify="start" align="middle" style={{ background: '#fff' }}>
                                                <Col span={4}>
                                                    <div style={{ width: '100%', display: 'inline-block', padding: '3px' }}>
                                                        <Row type="flex" justify="space-between" align="middle">
                                                            <span style={{ display: 'inline-block', height: '190px', width: '100%' }} >
                                                                <img style={{ display: 'inline-block', maxHeight: '190px', maxWidth: '100%' }} src={val.profilePhoto} alt="" />
                                                            </span>
                                                        </Row>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div style={{ height: '191px', width: '100%', display: 'inline-block', }}>
                                                        <p>{val.name}</p>
                                                        <p>{val.introduction}</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    })
                                        : (type === 3 ? <div>
                                            {
                                                guests.map((val, index) => {

                                                    return <div>
                                                        {guests.length > 1 ?

                                                            <p style={{ textAlign: 'left', height: '35px', padding: '0 5px' }}>主讲嘉宾{index + 1}&nbsp;<Icon onClick={() => this.delect(val.id, index)} style={{ color: '#22baa0', fontSize: '18px' }} type="delete" /></p>
                                                            : <p style={{ textAlign: 'left', height: '35px', padding: '0 5px' }}>主讲嘉宾&nbsp;</p>
                                                        }
                                                        <Guest ref={node => this.clicka = node} key={val.id} type={type} number={val} handleEmail={this.handleEmail.bind(this)} id={val.id} />
                                                    </div>

                                                })
                                            }

                                            <p style={{ textAlign: 'left', padding: '10px 0 0 4px' }}>
                                                <Button type='primary' onClick={() => this.addChange()} ghost>+新增嘉宾</Button>
                                            </p>
                                        </div> : <div>
                                                {
                                                    this.state.addParams.guests.map((val, index) => {
                                                        return <div>
                                                            {this.state.addParams.guests.length > 1 ?

                                                                <p style={{ textAlign: 'left', height: '35px', padding: '0 5px' }}>主讲嘉宾{index + 1}&nbsp;<Icon onClick={() => this.delect(val.id, index)} style={{ color: '#22baa0', fontSize: '18px' }} type="delete" /></p>
                                                                : <p style={{ textAlign: 'left', height: '35px', padding: '0 5px' }}>主讲嘉宾&nbsp;</p>
                                                            }
                                                            <Guest ref={node => this.clicka = node} key={val.id} type={type} number={val} handleEmail={this.handleEmail.bind(this)} id={val.id} />
                                                        </div>

                                                    })
                                                }

                                                <p style={{ textAlign: 'left', padding: '10px 0 0 4px' }}>
                                                    <Button type='primary' onClick={() => this.addChange()} ghost>+新增嘉宾</Button>
                                                </p>
                                            </div>)}

                                </td>

                            </tr>
                            <tr className='tr-position tableborder'>
                                <td className='bgc'><Col className='text-top'>活动流程&nbsp;&nbsp;<span className='icon-require'>*</span></Col></td>
                                <td colSpan={5}>
                                    {type === 2 ? <span style={{ display: 'inline-block', width: '100%', textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: baseData.flow }}></span> : 
                                            (
                                                type === 3
                                                ?
                                                <div className="editor-wrap" style={{border:'none'}}>
                                                    {addParams.flow?
                                                        <Udeitor config={ueditorConfig} id='flow'key={addParams.flow} defaultValue={addParams.flow}></Udeitor>
                                                        :
                                                        null
                                                    }
                                                    
                                                </div>
                                                :
                                                <div className="editor-wrap" style={{border:'none'}}>
                                                    <Udeitor config={ueditorConfig} id='flow' key={2}></Udeitor>
                                                </div>
                                            )
                                            
                                        
                                    }
                                </td>

                            </tr>

                        </table>
                    </Col>
                </Row>

                {
                    type === 2 ?
                        <div>
                            <p className='activity-detail' style={{ marginTop: '40px' }}>
                                <span>报名详情</span>
                            </p>
                            {this.state.tagName.length > 0 ? <span>已选条件：</span> : ''}
                            {this.state.tagName.map((val, ind) => {
                                return <span key={timerw}>

                                    <Tag style={{ fontSize: 14 }} closable key={val.text} afterClose={(e) => this.log(e, val, ind)}>{val.title}{val.items}</Tag>
                                </span>
                            })}
                            <Table
                                style={{ marginTop: "30px" }}
                                columns={this.columns()}
                                dataSource={this.props.baseData.signUp.data}
                                scroll={{ x: 1250 }}
                                pagination={this.pagination()}
                                bordered
                                loading={this.props.orderLoading}
                            />
                        </div> :
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={10}></Col>
                            <Col span={2}><Button type="primary" onClick={this.savaClick}>保存</Button></Col>
                            <Col span={2}><Button onClick={this.cellClick}>取消</Button></Col>
                        </Row>}
            </div>
            </Spin>
        )
    }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('websiteActivityListReducer');
    data = data.toJS()

    return {
        baseData: data,
        singupLoading: data.singupLoading
    }
};
export default connect(mapStateToProps)(Form.create()(WebSiteForm))