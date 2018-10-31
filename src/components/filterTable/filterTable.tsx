import React from 'react';
import {
    Popover,
    Button,
    Icon,
    Form,
} from 'antd';
import {
    FormComponentProps,
} from  'antd/lib/form/Form'
const FormItem = Form.Item;
import './filterTable';

/**
 * title 标题
 * type icon图标
 * dom icon内容
 * hasBtn 是否有按钮 true为有
 * ok 确认按钮方法
 * cancel 取消按钮方法
 * fixed 是否固定在父节点 默认false，指向body
 * placement 浮层方向
 * overlayStyle 浮层样式
 * overlayClassName 浮层类名
 * formStyle 外层form样式
 * keyDown 开启回车事件
 * 
 * 若需要验证
 * validType子节点类型
 * Validator校验规则functions
 * defaultValue默认值
 * 
 */
interface TOwnProps {
    /**子节点唯一标识 */
    keys?: Array<string>;
    /**子节点类型 */
    validType?: Array<'input' | 'select'>;
    /**校验规则functions */

    Validator?: Array<() => void>;
    /**默认值 */
    defaultValue?: Array<any>;
    /**外层form样式 */
    formStyle?: any;
}

interface FormItemProps{
    /**子节点Dom */
    children?: React.ReactNode
}

type FilterTableFromProps = TOwnProps & FormItemProps & FormComponentProps;

class FilterTableFrom extends React.Component<FilterTableFromProps,any> {

    constructor(props) {
        super(props);
    }

    getChildren() {
        const {
            children,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        let node:JSX.Element[] = [];

        const {
            keys,
            validType,
            Validator,
            defaultValue,
        } = this.props;

        if(keys){

            if(validType && Validator && defaultValue){
                let flag = [keys.length,validType.length,Validator.length,defaultValue.length].some(length => length !== keys.length);
                if(flag){
                    throw new Error("key,validType,Validator,defaultValue must be equal in length");
                }
            }else if(validType && Validator){
                let flag = [keys.length,validType.length,Validator.length].some(length => length !== keys.length);
                if(flag){
                    throw new Error("key,validType,Validator must be equal in length");
                }
            }
            
        }
        
        React.Children.map(children, function (child, i) {   

            if (keys) {
                switch (validType?validType[i]:'') {
                    case 'input':
                        node.push(
                            <FormItem>{
                                getFieldDecorator(keys[i], {
                                    rules: [
                                        {
                                            validator: Validator?Validator[i]:() =>{}
                                        }
                                    ],
                                    initialValue: defaultValue?defaultValue[i]:undefined,
                                })(
                                    child
                                )}
                            </FormItem>
                        );
                        break;
                    case 'select':
                        node.push(
                            <FormItem>{
                                getFieldDecorator(keys[i], {
                                    rules: [
                                        {
                                            validator: Validator?Validator[i]:() =>{}
                                        }
                                    ],
                                    initialValue: defaultValue?defaultValue[i]:undefined,
                                })(
                                    child
                                    )}
                            </FormItem>
                        );
                        break;
                    
                    default:
                        throw new Error('no type in validType')
                }
            } else {
                node.push(
                    <FormItem>{child}</FormItem>
                )

            }

        });
        return node;
    }
    

    render() {
        const {
             formStyle
        } = this.props;
        const children = this.getChildren();
        return (
            <Form style={formStyle ? formStyle : {}} className="form_style">
                {children}
            </Form>
            
        )
    }
}

/**
 * todo
 * 这里2.12.3的.d.ts写的不对
 * 所以写了 as any 类型。
 * 2.13.8之后的type已经正确。
 * 待2.13.10的Upload的before方法return false的bug解决后更新
 * 
 */
const FilterTableFromContent = Form.create()(FilterTableFrom) as any;


interface TOwnProps2{
    /**子节点唯一标识 */
    keys?: Array<string>;
    /**子节点类型 */
    validType?: Array<'input' | 'select'>;

    /**校验规则functions */
    Validator?: Array<() => void>;
    /**默认值 */
    defaultValue?: Array<any>;
    /**确认按钮方法 */
    ok?: (a:typeof FilterTableFromContent) => void;
    /**取消按钮方法 */
    cancel?: () => void;    
    /**是否有按钮 */
    hasBtn?: boolean;
    /**
     * 按钮样式 
     * 默认值 true
    */
    btnStyle?: any;
    /**外层form样式 */
    formStyle?: any;
    /**标题 */
    title: string;
    /**
     * icon图标类型
     * 默认值 filter
     */
    type?: string;
    /**icon内容 */
    dom?: JSX.Element;
    /**
     * 浮层方向 
     * 默认值 bottom
    */
    placement?: 'top' | 'left' | 'bottom' |'right';
    /**浮层样式 */
    overlayStyle?: any;
    /**浮层类名 */
    overlayClassName?: string;
    /**设置子组件的值 */
    setValue?: (a:typeof FilterTableFromContent) => void;
    /**开启回车事件 */
    keyDown?: boolean;
}

type FilterTableProps = TOwnProps2;

class FilterTable extends React.Component<FilterTableProps,any> {
    constructor(props) {
        super(props);

        this.state = {
            controlVisible: false,
        }
    }

    FilterTableFromContent: any;

    controlVisible(e) {

        //e.nativeEvent.stopImmediatePropagation();
        //this.fireEvent(document, 'click');
        const { setValue } = this.props;
        if(setValue){
            setValue(this.FilterTableFromContent);
        }
        this.setState({
            controlVisible: !this.state.controlVisible,
        });

    }

    handleVisibleChange(visible){
        this.setState({
            controlVisible: visible,
        });
    }

    success(e){

        const {
            ok,
        } = this.props;


        /**
         * 验证
         */
        let result = false;
        this.FilterTableFromContent.validateFields((err, values) => {

            if (!err) {
                //.log('Received values of form: ', values);
                result = true;
            }
        });
        if (!result) return;

        if (ok) {

            ok(this.FilterTableFromContent);

            this.controlVisible(e);
            return;
        }

        this.controlVisible(e);
    }

    ok(e) {
        this.success(e);

    }

    cancel(e) {
        const {
            cancel,
        } = this.props;

        if (cancel) {
            cancel();
            this.controlVisible(e);
            return;
        }
        this.controlVisible(e);
    }

    onKeyDown(e){
        if(e.keyCode === 13 && this.props.keyDown){
            this.success(e);
        }
        
    }
    

    getPopupContainer(triggerNode) {

        return triggerNode.parentNode;
    }

    contentProps() {
        const {
            keys,
            validType,
            Validator,
            defaultValue,
            children,
            hasBtn = true,
            btnStyle = {display: 'inline-block'},
            formStyle = {display: 'inline-block'},
        } = this.props;
        return (
            <div className="popover_div" style={{ minWidth: 200}} onKeyDown={e => this.onKeyDown(e)}>
                <FilterTableFromContent keys={keys} validType={validType} Validator={Validator} defaultValue={defaultValue} formStyle={formStyle} ref={node => this.FilterTableFromContent = node}>{children}</FilterTableFromContent>
                {
                    hasBtn ?
                        <div className="btn_div" style={btnStyle}>
                            <Button
                                className="ok"
                                type="primary"
                                onClick={e => this.ok(e)}
                            >
                                保存
                        </Button>
                            <Button
                                className="cancel"
                                onClick={e => this.cancel(e)}
                            >
                                取消
                        </Button>
                        </div>
                        :
                        ''
                }
            </div>
        )
    }
    render() {
        const {
            title,
            placement,
            type,
            dom,
            overlayStyle,
            overlayClassName,
        } = this.props;

        let popoverProps:any = {
            content: this.contentProps(),
            trigger: "click",
            visible: this.state.controlVisible,
            placement: placement ? placement : 'bottom',
            overlayStyle: overlayStyle ? overlayStyle : {},
            overlayClassName: overlayClassName ? overlayClassName : '',
            arrowPointAtCenter: true,
            onVisibleChange: (visible) => this.handleVisibleChange(visible),
        }

        return (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                {title}

                <Popover key={this.state.controlVisible}
                    {...popoverProps}
                >
                    <Icon type={type ? type : 'filter'} style={{color: '#fff'}} onClick={(e) => this.controlVisible(e)}>
                        {dom ? dom : ''}
                    </Icon>
                </Popover>

            </div>
        );
    }
}


export default FilterTable;