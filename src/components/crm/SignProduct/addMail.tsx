import React from 'react';
import { browserHistory } from 'react-router'
import { FormComponentProps } from 'antd/lib/form';
import {
    Spin,
    Form,
    Input,
    Button,
    Radio,
    Row,
    Col,
    message,
    InputNumber,
    Modal,
    Dropdown,
    Icon,
    Menu,
} from 'antd';

import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

import { DOMAIN_OXT } from "../../../global/global";
import { fetchFn } from "../../../util/fetch";
import query from '../../../util/query';

import './addMail.less'

const urlId = query('id');
const getMailSmsSetting = () => {
    return fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getMailSmsSetting`, {}).then(data => data);
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        xs: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 20 },
    },
}

interface UserFormProps extends FormComponentProps {
    visible: boolean;
    title: string,
    toggleVisible: Function;
    successCallback: Function;
    modalNumber: number;
    editId: string;
    createProduceIntroduceButton: number;
}

class AddMailSend extends React.Component<UserFormProps, any>{
    constructor(props: UserFormProps) {
        super(props)
        this.state = {
            loading: false,
            content: null,
            functionName: [],//提醒时间
            mailData: null,
            isShowMore: false,
            isMessage: false,
            variableList: [],//变量内容
            editId: this.props.editId ? this.props.editId : null,
            resData: null,//编辑时获取内容
            createProduceIntroduceButton: false,
            positionStart: null,
            positionEnd: null,
        }
    }

    editorInstance: any;

    /**
     * 获取邮件短信配置
     */
    getMailSmsSetting = async () => {
        if (urlId && this.props.visible) {
            let res: any = await getMailSmsSetting();
            if (res.status === 0) {
                let functionName: any = [];
                res.data.map((item) => {
                    functionName.push(
                        <Radio value={item.id}>{item.dictName}</Radio>
                    )
                })
                this.setState({
                    mailData: res.data,
                    functionName: functionName,
                    loading: false,
                })
            }
        }
    }

    /**
     * 获取邮件编辑内容
     */
    getEditDetail = async () => {
        if (this.props.editId && this.props.visible) {
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/jyMailSmsTemplatesSetting/getDetail`, {
                id: this.props.editId,
            })
            .then((res: any) => {
                this.setState({
                    resData: res.data
                })
                if(res.data.sendType === 2){
                    let newContent = res.data.richTextContent; //replace(/<tr+><td+>/g,"<p>").replace(/<\/td+><\/tr+>/g,"</p>");
                    this.setState({
                        isShowMore: true,
                        content: newContent,
                    })
                    this.editorInstance.setContent(newContent);
                    this.setVariable(res.data.configurationId);
                }else{
                    this.setState({
                        isShowMore: true,
                        isMessage: true,
                    }) 
                    this.setVariable(res.data.configurationId);
                }
            });
        }
    }

    async componentWillMount() {
        this.setState({ loading: true });
        await this.getMailSmsSetting();
        await this.getEditDetail();
    }

    handleChange(content) {
        this.setState({
            content,
        })
    }

    handleCancel = () => {
        this.props.toggleVisible()
    }

    handleRawChange = (rawContent) => {
        this.setState({
            content: rawContent
        })
    }

    changeSendTypeHandle = (e) => {
        let target = e.target.value;
        if (target == 1) {
            this.setState({
                isShowMore: true,
                isMessage: true,
            })
        } else {
            this.setState({
                isShowMore: true,
                isMessage: false,
            })
        }
    }

    changeAddType = (e) => {
        let target = e.target.value;
        if (target == 1) {
            this.setState({
                createProduceIntroduceButton: true,
            })
        } else {
            this.setState({
                createProduceIntroduceButton: false,
            })
        }
    }

    /**
     * 设置富文本变量的值
     */
    setVariable = (id) => {
        let target = this.state.mailData.find(item => item.id == id);
        let parameterList: any = [];
        target.parameterList.map((item) => {
            parameterList.push(
                <Menu.Item key={item.name}>{item.name}</Menu.Item>
            )
        })
        this.setState({
            variableList: parameterList,
        })
    }

    variableChange = (e) => {
        this.setVariable(e.target.value);
    }

    variablClick = ({ key }) => {
        // let content = this.editorInstance.getContent();
        // if(content == '<p></p>'){
        //     content = '';
        // }
        // content += key;
        // this.editorInstance.setContent(content);
        this.editorInstance.insertText(key);
    }

    getTextAreaPosition  = (e) => {
        let start = e.target.selectionStart;
        let end = e.target.selectionEnd;
        this.setState({
            positionStart: start,
            positionEnd: end,
        })
    }

    variablMessageClick = ({ key }) => {
        const {
            positionStart,
            positionEnd,
        } = this.state;
        let content = this.props.form.getFieldValue('richTextTemplatesContent');
        if(!content){
            content = '';
        }
        let newContent = content.substring(0, positionStart ? positionStart : content.length) + key + content.substring(positionEnd ? positionEnd : content.length);
        this.props.form.setFieldsValue({'richTextTemplatesContent': newContent});
        this.setState({
            positionStart: newContent.length,
            positionEnd: newContent.length,
        })
    }

    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {
                    content
                } = this.state;
                if (values.sendType == 2) {
                    if(!values.addType){
                        if (!content || content == '<p></p>') {
                            message.error('请填写邮件内容');
                            return false;
                        } else {
                            let newContent = content.replace(/<p+><\/p>/g, '<tr><td style="height: 20px;"></td></tr>').replace(/<p+>/g,"<tr><td>").replace(/<\/p+>/g,"</td></tr>");
                            values.richTextTemplatesContent = newContent;
                            values.richTextContent = content;
                        }
                    }
                }
                this.setState({ loading: true });
                let target = this.state.mailData.find(item => item.id == values.configurationId);
                values.associateId = urlId;
                values.type = 1;
                values.functionName = target.dictName;
                if(this.state.editId){
                    values.id = this.state.editId;
                    values.templatesId = this.state.resData.templatesId;
                }
                let submitUrl = this.state.editId ? `${DOMAIN_OXT}/apiv2_/crm/api/module/jyMailSmsTemplatesSetting/updateSetting` : `${DOMAIN_OXT}/apiv2_/crm/api/module/jyMailSmsTemplatesSetting/addSetting`
                fetchFn(submitUrl,
                    { ...values }
                )
                    .then((res: any) => {
                        if (res.status == 0) {
                            this.props.toggleVisible();
                            this.props.successCallback(this.state.editId);
                        }
                        this.setState({
                            loading: false,
                        });
                    });
            }
        });
    }

    render() {
        const {
            loading,
            content,
            isShowMore,
            isMessage,
            resData,
        } = this.state;

        const {
            visible,
            title,
            modalNumber,
        } = this.props;

        const editorProps = {
            placeholder: '请填写邮件内容',
            contentFormat: 'html',
            initialContent: '',
            height: 150,
            media: {
                // allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
                image: false, // 开启图片插入功能
                video: false, // 开启视频插入功能
                audio: false, // 开启音频插入功能
                //uploadFn: uploadFn, // 指定上传函数
                //validateFn: validateFn, //指定图片大小校验函数
                // 如果以上三个值皆为false，则不允许插入任何外部媒体，也不会显示插入外部媒体的入口
                externalMedias: {
                    image: false,
                    audio: false,
                    video: false
                }
            },
            colors: [
                '#FFFFFF', '#000000', '#999999', '#666666', '#dd3333', '#FF6600', '#22baa0', '#3366cc',
            ],
            controls: [
                'undo', 'font-size', 'text-color', 'bold', /*'redo', 'split', 'font-family', 'line-height', 'letter-spacing',
                'indent', 'italic', 'underline', 'strike-through',
                'superscript', 'subscript', 'emoji', 'text-align', 'split', 'headings', 'list_ul',
                'list_ol', 'blockquote', 'code', 'link', 'split', 'hr', 'split', 'media'*/
            ],
            // onChange: this.props.handleChange,
            // onRawChange: this.handleRawChange,
            onHTMLChange: this.handleRawChange,
            extendControls: [
                {
                    type: 'component',
                    component: <Dropdown overlay={(<Menu onClick={this.variablClick}>{this.state.variableList}</Menu>)}>
                        <span>添加变量<Icon type="down" /></span>
                    </Dropdown>
                }
            ]
        }

        const { getFieldDecorator, getFieldsError } = this.props.form;

        return visible ? <Modal
            key={modalNumber}
            title={title}
            width={780}
            visible={visible}
            onCancel={this.handleCancel}
            footer={false}
            maskClosable={false}
        >
            <Spin
                spinning={loading}
            >
                <div className="add-mail-cnt">
                    <Form
                        onSubmit={this.submit}
                    >
                        <FormItem
                            required={true}
                            label="提醒时间"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('configurationId', {
                                rules: [{
                                    required: true,
                                    message: '请选择提醒时间'
                                }],
                                initialValue: resData && resData.configurationId,
                            })(
                                <RadioGroup onChange={this.variableChange}>
                                    {this.state.functionName}
                                </RadioGroup>
                                )}
                        </FormItem>
                        <FormItem
                            required={true}
                            label="提醒方式"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('sendType', {
                                rules: [{
                                    required: true,
                                    message: '请选择提醒方式'
                                }],
                                initialValue: resData && resData.sendType,
                            })(
                                <RadioGroup onChange={this.changeSendTypeHandle}>
                                    <Radio value={2}>邮件</Radio>
                                    <Radio value={1}>短信</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem
                            required={false}
                            label="发送顺序"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('sort', {
                                rules: [{
                                    required: false,
                                    message: '请填写发送顺序'
                                }],
                                initialValue: resData && resData.sort,
                            })(
                                <InputNumber min={1} max={99} precision={0} placeholder={`请填写`} />
                                )}
                        </FormItem>
                        {!isShowMore ? '' :
                            isMessage ?
                                <div>
                                    <FormItem
                                        className="add-message-path"
                                        label=" "
                                        {...formItemLayout}
                                    >
                                        <Dropdown overlay={(<Menu onClick={this.variablMessageClick}>{this.state.variableList}</Menu>)}>
                                            <span>添加变量<Icon type="down" /></span>
                                        </Dropdown>
                                    </FormItem>
                                    <FormItem
                                        required={true}
                                        label="内容"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('richTextTemplatesContent', {
                                            rules: [{
                                                required: true,
                                                message: '请填写内容',
                                                whitespace: true,
                                            }],
                                            initialValue: resData && resData.content,
                                        })(
                                            <TextArea onClick={this.getTextAreaPosition} maxLength={601} placeholder={`请填写内容`} autosize={{ minRows: 6, maxRows: 9 }}></TextArea>
                                            )}
                                    </FormItem>
                                </div>
                                :
                                <div>
                                    <FormItem
                                        required={true}
                                        label="标题"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('title', {
                                            rules: [{
                                                validator:(rule, value, callback) =>{
                                                    if(!value.trim()){
                                                        callback(`请填写标题`);
                                                    }else if(value && value.length > 100){
                                                        callback(`标题请控制在100个字之内`);
                                                    }else{
                                                        callback();
                                                    }
                                                },
                                                whitespace: true,
                                            }],
                                            initialValue: resData && resData.title,
                                        })(
                                            <Input maxLength={101} placeholder={`请填写标题`} />
                                            )}
                                    </FormItem>
                                    {!resData && this.props.createProduceIntroduceButton ? <FormItem
                                        required={true}
                                        label="添加方式"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('addType', {
                                            rules: [{
                                                required: true,
                                                message: '请选择添加方式'
                                            }],
                                            initialValue: 0,
                                        })(
                                            <RadioGroup onChange={this.changeAddType}>
                                                <Radio value={0}>不带表格</Radio>
                                                <Radio value={1}>带表格</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem> : ''}
                                    {!this.state.createProduceIntroduceButton ?
                                    <FormItem
                                        required={true}
                                        label="内容"
                                        {...formItemLayout}
                                    >
                                        <div style={{ 'border': '1px solid #ddd', 'border-radius': '5px' }}><BraftEditor {...editorProps} ref={instance => this.editorInstance = instance} /></div>
                                    </FormItem>
                                    :
                                    <FormItem
                                        required={true}
                                        label="内容"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('richTextTemplatesContent', {
                                            rules: [{
                                                required: true,
                                                message: '请填写内容',
                                                whitespace: true,
                                            }],
                                            initialValue: '',
                                        })(
                                            <TextArea placeholder={`请填写内容`} autosize={{ minRows: 6, maxRows: 9 }}></TextArea>
                                            )}
                                    </FormItem>
                                    }
                                </div>
                        }
                        {urlId ?
                            <div className='text-center' style={{ marginTop: 20 }}>
                                <Button htmlType='submit' disabled={hasErrors(getFieldsError()) || loading} type='primary'>保存</Button>
                            </div>
                            :
                            ''
                        }
                    </Form>
                </div>
            </Spin>
        </Modal> : null
    }
}

export default Form.create()(AddMailSend);