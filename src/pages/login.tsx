/**
 * Created by caozheng on 2017/1/9.
 */
import { Canvas } from "./canvas/login";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import * as  QueueAnim from "rc-queue-anim/lib";
import "./../css/login.less"
import {
    FormComponentProps,
} from 'antd/lib/form/Form';
const FormItem = Form.Item;

interface LoginTypeProps {
    form ?: any
}


class Login extends React.Component<LoginTypeProps & FormComponentProps, any> {
    constructor(props) {
        super(props);
        let bgCanvas = new Canvas(document.querySelector("#Mycanvas"))
    }


    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                location.href = "/admin/newadmin/financial/fund";
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{paddingTop: "200px"}}>
            <Form  onSubmit={this.handleSubmit.bind(this)}>
                <div className="login-form">
                    <QueueAnim key="page" type="bottom" delay="500">
                        <div key="page1">
                            <FormItem className="form-header-title">
                                <span>JOYOWO</span>
                            </FormItem>
                        </div>
                    </QueueAnim>
                    <QueueAnim  delay="1000" appear>
                        <div key="demo1">
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input id="inputUser" addonBefore={<Icon type="user" />} placeholder="Username" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please input your Password!' }],
                                })(
                                    <Input id="inputLock" addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox>Remember me</Checkbox>
                                )}
                                <a className="login-form-forgot">Forgot password</a>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                                Or <a>register now!</a>
                            </FormItem>
                        </div>

                    </QueueAnim>
                </div>
            </Form>

            </div>
        )
    }
}

let RootLogin = Form.create({})(Login);

ReactDOM.render(<RootLogin />, document.getElementById('wrapper'));