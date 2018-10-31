import React, { Component } from 'react';
import {
	Input,
	Tag,
	Tooltip,
	Button,
	Form,
} from 'antd';
import {
	WrappedFormUtils,
	FormComponentProps,
} from 'antd/lib/form/Form';
import * as isX from '../../util/isX';
import './index.less';
const FormItem = Form.Item;


interface TagInputProps extends Pick<EditableTagGroupProps, 'size' | 'style' | 'rule' | 'ruleMessage'> {
	value: any;
	onChange: (e) => void;
	handleInputConfirm: () => void;
}

class TagInputElement extends Component<TagInputProps & FormComponentProps> {
	validatorInput = (rules, value, callback) => {
		const {
			rule,
			ruleMessage,
		} = this.props;
		if(!rule || value === undefined || value === '') {
			return callback();
		}
		if(isX.isFunction(rule) && rule() === false) {
			return callback(ruleMessage);
		}
		if(isX.isRegExp(rule) && rule.test(value) === false) {
			return callback(ruleMessage)
		}
		return callback();
	}
	handleInputConfirm = () => {
		this.props.form.validateFields((err, values) => {
			if(!err) {
				this.props.handleInputConfirm();
			}
		})
	}
	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		const {
			value,
			size = 'small',
			style = {},
			onChange,
		} = this.props;
		return (
			<Form className="tags-form" layout="inline" style={{display: 'inline-block'}}>
				<FormItem>
					{
						getFieldDecorator('tagInput', {
							rules: [{
								validator: this.validatorInput
							}]
						})(
							<Input  onChange={onChange} style={style} onPressEnter={this.handleInputConfirm} onBlur={this.handleInputConfirm} size={size} />
							)
					}
				</FormItem>
			</Form>
		)
	}
}
const TagInput = Form.create<TagInputProps>({
	// mapPropsToFields: (props) => props,
	withRef: true,
})(TagInputElement);

interface EditableTagGroupProps {
	rule?:  RegExp | (() => boolean);
	ruleMessage?: string;
	value?: string[];
	style?: React.CSSProperties;
	size?: 'large' | 'default' | 'small';
	max?: number;
	buttonText?: string;
	onChange?: (value) => void;
}
interface EditableTagGroupState {
	tags: string[];
	inputVisible: boolean;
	inputValue: string;
}

export default class EditableTagGroup extends Component<EditableTagGroupProps, EditableTagGroupState> {
	constructor(props) {
		super(props);
		this.state = {
			tags: this.props.value || [],
			inputVisible: false,
			inputValue: '',
		};
	}
	max = this.props.max ? this.props.max : 99999;
	input: Input | null;
	tagInput: WrappedFormUtils | React.Component<TagInputProps> | null | any
	handleClose = (removedTag) => {
		const tags = this.state.tags.filter(tag => tag !== removedTag);
		this.setState({ tags });
		this.triggerChange(tags);
	}
	showInput = () => {
		this.setState(
			{ inputVisible: true }, 
			() => {
				// this.tagInput && this.tagInput.instances.tagInput.refs.input.focus()
			}
		)
	}
	handleInputChange = (e) => {
		this.setState({ inputValue: e.target.value });
	}
	handleInputConfirm = () => {
		let {
      		tags,
			inputValue,
    	} = this.state;
		if (inputValue && tags.indexOf(inputValue) === -1) {
			tags = [...tags, inputValue];
		}
		this.setState({
			tags,
			inputVisible: false,
			inputValue: '',
		});
		this.triggerChange(tags);
	}
	/**
     * 表单验证插件调用
     */
    triggerChange = (changedValue) => {
        const {
			onChange,
		} = this.props;
        if (onChange) {
            onChange(changedValue);
        }
    }
	render() {
		const {
        	tags,
			inputVisible,
			inputValue,
      	} = this.state;
		const {
			style,
			rule,
			ruleMessage,
			buttonText = '新增'
		} = this.props;
		return (
			<div style={{ display: 'inline-block' }}>
				{tags.map((tag, index) => {
					const isLongTag = tag.length > 20;
					const tagElem = (
						<Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
							{isLongTag ? `${tag.slice(0, 20)}...` : tag}
						</Tag>
					);
					return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
				})}
				{inputVisible && (
					<TagInput
						ref={node => this.tagInput = node}
						handleInputConfirm={this.handleInputConfirm}
						onChange={this.handleInputChange}
						value={inputValue}
						style={style}
						rule={rule}
						ruleMessage={ruleMessage}
					/>
				)}

				{tags.length < this.max && !inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ { buttonText }</Button>}
			</div>
		);
	}
}