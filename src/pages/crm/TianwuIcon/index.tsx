import React from 'react'
import { Button, Modal, Select, message, Input } from 'antd'

import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';

import './style.less'

const Option = Select.Option;
import IconList from '../../../components/crm/IconList'
class TianwuIcon extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            iconLoading: false,
            delVisible: false,
            delSelectedVal: '删除分类',
            delParams: null,
            TBLXData: null,
            addVisible: false,
            addButtonVisible: false, //通过接口进行权限控制
            editButtonVisible: false, //通过接口进行权限控制
        }
    }

    getTBLXDate(){
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getDataByDictKey`, {dictKey: 'TBLX'})
        .then((res:any) => {
            this.setState({
                TBLXData: res.data
            })
        });
    }
    
    componentWillMount(){
        this.getTBLXDate();
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/getIconButton`, {})
        .then((res: any) => {
            if(res.data.createOrUpdateButton == 1){
                this.setState({
                    addButtonVisible: true
                })
            }
            if(res.data.deleteButton == 1){
                this.setState({
                    editButtonVisible: true
                })
            }
        });
    }

    dellistHandle = (value, option) => {
        this.setState({
            delVisible: true,
            delParams: {
                id: value,
                name: option.props.title
            }
        });
    }

    handleAdd = () => {
        this.setState({
            addVisible: true
        })
    }

    handleAddInput = (e) => {
        let val = e.target.value;
        if(val.trim() != ''){
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/addIconType`, {iconTypeName: val})
            .then((res:any) => {
                this.getTBLXDate();
                window.scrollTo(0, 0);
            });
        }
        this.setState({
            addVisible: false
        })
    }

    handleDelOk = (e) => {
        this.setState({
            delVisible: false,
        });
        fetchFn(
            `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/deleteIconLibraryByType`,
            {id: this.state.delParams.id}
        )
        .then(data => {
            this.setState({
                delSelectedVal: '删除分类'
            })
            this.getTBLXDate();
        });
    }

    handleDelCancel = (e) => {
        this.setState({
            delVisible: false,
        });
    }

    successCallback = () => {
        this.getTBLXDate();
    }

    render() {
        if(!this.state.TBLXData){
            return false;
        }
        const { 
            TBLXData,
            addVisible,
            addButtonVisible,
            editButtonVisible,
        } = this.state;

        return(
            <div>
                {addButtonVisible ? <Button type='primary' onClick={this.handleAdd} loading={addVisible}>新增分类</Button> : ''}
                {editButtonVisible ? 
                <Select
                    style={{'dispaly': 'inline-block', 'width': 120, 'margin-left': 20}}
                    size='default'
                    placeholder='删除分类'
                    value={this.state.delSelectedVal}
                    onSelect={(value, option) => {this.dellistHandle(value, option)}}
                >
                    {TBLXData.map(d => <Option key={d.id} value={d.id} title={d.dictName}>{d.dictName}</Option>)}
                </Select>: ''}
                {
                    addVisible ? <div className='crm-icon-card'>
                        <div className="crm-card-header">
                            <div className='crm-card-title'>
                                <span><Input placeholder="请填写名称" maxLength={100} autoFocus onBlur={(e) => {this.handleAddInput(e)}} /></span>
                            </div>
                        </div>
                    </div> : ''
                }
                {TBLXData.map((item, index) => {
                    return <IconList
                        key={item.id}
                        resItem={item}
                        addButtonVisible={addButtonVisible}
                        editButtonVisible={editButtonVisible}
                        successCallback={() => {this.successCallback()}}
                    />
                })}
                <Modal
                    title="删除分类"
                    visible={this.state.delVisible}
                    onOk={this.handleDelOk}
                    onCancel={this.handleDelCancel}
                >
                    <div className="tips-wrap">
                        <em className="my-dialog-icon icon-bounce"></em>
                        <div className="tips-box">
                            <strong>是否确定删除<em>{this.state.delParams ? this.state.delParams.name : ''}</em>？</strong>
                            <span>删除后，该分类下的图标会同步删除！ </span>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default TianwuIcon