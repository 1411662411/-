import React from 'react';
import { Upload, Button, Icon, message, Input, Card, Col, Row, Pagination, Modal, Spin, Popconfirm } from 'antd'

const { Meta } = Card;
const Dragger = Upload.Dragger;

import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

let iconData:any = [];

class IconList extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            total: 0,
            pageSize: 16,
            dataSource: [],
            current: 1,
            isLoading: true,
            addVisible: false,
            addButtonLoading: false,
            fileList: [],
            uploadVisible: false,
            editImgVisible: [],
            modalNum: 0,
            previewVisible: false,
            previewImage:  '',
            err: false,
        }
    }

    getData = async (current, pageSize)=>{
        this.setState({isLoading: true})
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/iconLibraryList`, { 
            type: this.props.resItem.code,
            start: (current-1) * pageSize,
            length: pageSize,
        })
            .then((res: any) => {
                this.setState({
                    dataSource: res.data.result,
                    total: res.data.total,
                    current: res.data.current,
                    pageSize: 24,
                    isLoading: false,
                })
            });
    }

    getIconList() {
        if (this.props.resItem) {
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/iconLibraryList`, { 
                type: this.props.resItem.code,
                start: 0,
                length: 24
            })
                .then((res: any) => {
                    this.setState({
                        dataSource: res.data.result,
                        total: res.data.total,
                        current: res.data.current,
                        pageSize: 24,
                        isLoading: false,
                    })
                    let tempArr:any = [];
                    res.data.result.map((item, index) => {
                        let temp = {
                            id: item.id,
                            visible: false
                        }
                        tempArr.push(temp);
                    })
                    this.setState({
                        editImgVisible: tempArr
                    })
                });
        }
    }

    componentWillMount() {
        this.getIconList();
    }

    handleAdd = () => {
        this.setState({
            addVisible: true
        })
    }

    handleAddInput = (e) => {
        let val = e.target.value;
        if (val.trim() != '') {
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/updateIconType`, { id: this.props.resItem.id, iconTypeName: val })
                .then((res: any) => {
                    this.props.successCallback();
                });
        }
        this.setState({
            addVisible: false
        })
    }

    editImgHandle = (e, item) => {
        let tempArr = this.state.editImgVisible;
        tempArr[item.id] = true;
        this.setState({
            editImgVisible: tempArr
        })
    }

    saveImgHandle = (e, item) => {
        let val = e.target.value;
        if (val.trim() != '') {
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/update`, { id: item.id, title: val })
                .then((res: any) => {
                    let tempArr = this.state.editImgVisible;
                    tempArr[item.id] = false;
                    this.setState({
                        editImgVisible: tempArr,
                    })
                    this.getData(this.state.current,this.state.pageSize)
                });
        }else{
            let tempArr = this.state.editImgVisible;
            tempArr[item.id] = false;
            this.setState({
                editImgVisible: tempArr,
            })
        }
    }

    delIconHandle = (e, item) => {
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/update`, {
            id: item.id,
            isDelete: 1
        })
            .then((res: any) => {
                this.getData(this.state.current,this.state.pageSize)
            });
    }

    uploadHandle = () => {
        this.setState({
            fileList: [],
            uploadVisible: true,
        })
    }

    uploadCancle = () => {
        this.setState({
            uploadVisible: false,
            addButtonLoading: false,
            modalNum: this.state.modalNum + 1,
            fileList: [],
        })
    }

    saveIcon = () => {
        this.setState({
            addButtonLoading: true
        })
        const {fileList} = this.state;
        if(fileList.length){
            iconData = [];
            fileList.map((item, index) => {
                iconData.push({
                    iconName: item.name,
                    content: item.response.data
                })
            })
            
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/addIcon`, {
                iconData: JSON.stringify(iconData),
                type: this.props.resItem.code
            })
                .then((res: any) => {
                    message.success(`上传成功`);
                    this.getIconList();
                    this.setState({
                        uploadVisible: false,
                        addButtonLoading: false,
                        modalNum: this.state.modalNum + 1,
                        fileList: [],
                    })
                });
        }else{
            message.warning(`请上传`);
            this.setState({
                addButtonLoading: false
            })
        }
        
    }

    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
    }

    handleImgPreview= (e, item) => {
        this.setState({
            previewImage: item.content,
            previewVisible: true,
        });
    }

    handleCancel = () => this.setState({ previewVisible: false })

    render() {
        const pagination = {
            showTotal: (total, range) => `${range[0]} - ${range[1]} , 共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
            size: "small",
            pageSizeOptions: ['16', '24', '32', '48', '96'],
            onChange: this.getData,
            onShowSizeChange: this.getData,
        }

        const {
            code,
            dictName
        } = this.props.resItem;
        const {
            successCallback,
            addButtonVisible,
            editButtonVisible,
        } = this.props;
        const {
            fileList,
            uploadVisible,
            addVisible,
            addButtonLoading,
            dataSource,
            editImgVisible,
            previewImage,
            previewVisible,
        } = this.state;

        const props:any = {
            name: 'file',
            multiple: true,
            listType: 'picture',
            fileList: fileList,
            data: {
                type: 31,
            },
            accept: ['.jpg', '.jpeg', '.bmp', '.gif', '.png', '.svg'],
            action: `${DOMAIN_OXT}/api/fileUpload/common`,
            beforeUpload: (file) => {
                this.setState({addButtonLoading: true})
                const isImage = file.type.indexOf('image/') == -1 ? false : true;
                if(!isImage){
                    message.error('只支持.jpg .jpeg .bmp .gif .png .svg格式');
                    return false;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if(!isLt2M){
                    message.error('文件大小需控制在2M以内');
                    return false;
                }
                return isLt2M && isImage;
            },
            onChange:(info)=> {
                const status = info.file.status;
                if (status === 'error') {
                    message.error(`上传失败`);
                }
                const isImage = info.file.type.indexOf('image/') == -1 ? false : true;
                const isLt2M = info.file.size / 1024 / 1024 < 2;
                if(isLt2M && isImage){
                    this.setState({
                        fileList: info.fileList,
                        addButtonLoading: false
                    })
                }else{
                    this.setState({
                        fileList: [],
                        addButtonLoading: false
                    })
                }
            },
        };

        return (<div className='crm-icon-card'>
            <div className="crm-card-header">
                <div className='crm-card-title' onClick={this.handleAdd}>
                    <span>{addVisible && addButtonVisible ? <Input placeholder="请填写名称" maxLength={100} autoFocus defaultValue={dictName} onBlur={(e) => { this.handleAddInput(e) }} /> : dictName}</span>
                </div>
                {addButtonVisible ? 
                <Button onClick={this.uploadHandle} style={{'margin-left': 30}} className="rt">
                    <Icon type="upload" /> 点击上传
                </Button>: ''}
            </div>
            <div className="crm-card-content">
                <Spin tip="Loading..." spinning={this.state.isLoading}>
                <Row gutter={16}>
                    {dataSource.map((item, index) => {
                        return <Col span={3}><Card
                            key={item.id}
                            bordered={false}
                            cover={<img alt={item.title} onClick={(e) => {this.handleImgPreview(e, item)}} src={item.content} />}
                        >
                            <Meta
                                title={editImgVisible[item.id] && addButtonVisible ? <Input autoFocus maxLength={100} defaultValue={item.title} onBlur={(e) => { this.saveImgHandle(e, item) }} /> : <span onClick={(e) => this.editImgHandle(e, item)}>{item.title}</span>}
                                description={item.createUser}
                            />
                            {editButtonVisible ? <Popconfirm
                                title={<span>是否确定删除该图标？</span>}
                                okText="确定"
                                onConfirm={(e) => { this.delIconHandle(e, item) }}
                                cancelText="取消"
                            >
                                <Icon type="delete"></Icon>
                            </Popconfirm> : ''}
                        </Card></Col>
                    })}
                </Row>
                {this.state.total > 24 ?
                <Pagination
                    {...pagination}
                    total={this.state.total}
                    pageSize={this.state.pageSize}
                    current={this.state.current}
                />
                : ''}
                </Spin>
            </div>
            {uploadVisible ? 
            <Modal
                key={this.state.modalNum}
                visible={true}
                width={680}
                className="tianwu-icon-modal"
                title={'上传图标'}
                onCancel={this.uploadCancle}
                maskClosable={false}
                footer={[
                    <Button key="submit" type="primary" loading={addButtonLoading} onClick={this.saveIcon}>
                        确定
                    </Button>,
                  ]}
            >
                <Dragger {...props} onPreview={this.handlePreview}>
                    <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">支持：.jpg .jpeg .bmp .gif .png .svg </p>
                </Dragger>
            </Modal>
            : ''}
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>)
    }
}

export default IconList