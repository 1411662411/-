import {
    message,
    Modal,
} from 'antd';
import * as R from 'ramda'
interface UploadProps {
    (params: { 
        key: string;
        number?: number; 
        fileSize?: number;
        accept?: [keyof FileTypesInterface];
        listType?: 'text' | 'picture' | 'picture-card';
    }): any;
}
/**
 * MINI 类型
 */
interface FileTypesInterface {
    '.pdf': 'application/pdf',
    '.csv': 'application/vnd.ms-excel';
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.bmp': 'image/bmp',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.jpe': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
}
const fileTypes: FileTypesInterface = {
    '.pdf': 'application/pdf',
    '.csv': 'application/vnd.ms-excel',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.bmp': 'image/bmp',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.jpe': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
}

export const uProps = function(
    fieldName: string, 
    num: number = 1, 
    listType: 'text'|'picture'|'picture-card' = 'text',
    fileSize: number = 8,
    accept: string[] = ['.jpg', '.jpeg', '.bmp', '.gif', '.pdf']
) {
    const { form, uploadApi } = this.props
    let fieldValue = form.getFieldValue(fieldName)
    return {
        listType,
        accept,
        action: uploadApi,
        beforeUpload: (file, fileList) => {
            if (fieldValue && fieldValue.length === num) {
                message.error(`上传附件数量限制为${num}份`)
                return false
            }
            if (file.size > fileSize*1024*1024) {
                message.error(`上传的文件大小需控制在 ${fileSize}M以内`)
                return false
            }
            if (file.size === 0) {
                message.error(`您上传的文件为空白文件!`)
                return false
            }
            if (!accept.map(item => fileTypes[item]).some(item => file.type === item)) {
                message.error(`上传文件仅支持 ${accept.join(',')} 格式`)
                return false
            }
            this.uploading = true
            return true
        },
        onChange: ({file, fileList, event}) => {
            // 上传完成
            if(file.status === 'done') {
                const { uid, name, response, status } = file
                const { data, errmsg, status: resStatus } = response
                if (resStatus == '1') {
                    fieldValue.pop()
                    fieldValue.push({ uid, name, status: 'error', response: errmsg })
                    form.setFieldsValue({fieldName: fieldValue})
                }
                if (response.data) {
                    const { url, ossKey } = response.data 
                    if (fieldValue && fieldValue.length <= num) {
                        fieldValue.pop()
                        fieldValue.push({ uid, name, url, ossKey, status })
                    } else {
                        fieldValue.pop()
                    }
                    form.setFieldsValue({fieldName: fieldValue})
                }
            }
        },
        onRemove: (file) => {
            return new Promise((resolve, reject) => {
                Modal.confirm({
                    title: '是否确定删除？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.props.form.setFieldsValue({
                            [`${fieldName}`]: fieldValue.filter(item=>item.uid !== file.uid),
                        })
                        resolve();
                    },
                    onCancel: () => {
                        resolve(false);
                    }
                })
            })
        }
    }
}


const uploadProps:UploadProps = function ({ key, number, fileSize,  listType, accept})  {
    const {
        form,
        uploadApi,
    } = this.props
    const props: any = {
        name: "file",
        action: uploadApi,
        accept: accept ? accept.join(',') : undefined,
        listType,
        beforeUpload: (file) => {
            const attachment = this.props.form.getFieldValue(key);
            if (number && attachment && attachment.length >= number) {
                message.error(`上传附件数量限制为${number}份`);
                return false;
            }
            if (accept !== undefined) {
                const types = accept.map((value) => {
                    if (Object.prototype.hasOwnProperty.call(fileTypes, value)) {
                        return fileTypes[value];
                    }
                    return value;
                });

                if (types.length > 0 && types.indexOf(file.type) === -1) {
                    message.error(`上传文件仅支持 ${accept.join('，')} 格式 `);
                    return false;
                }
            }
            if (fileSize !== undefined && !(file.size / 1024 / 1024 < fileSize)) {
                message.error(`上传的文件大小需控制在 ${fileSize}M以内`);
                return false;
            }
            
            this.uploading = true;
        },
        onRemove: (file) => {
            const deleteUid = file.uid;
            let fileList = this.props.form.getFieldValue(key);
            let deletIndex: number | null = null;
            // for (let [index, { uid }] of fileList.entries()) {
            //     if (uid === deleteUid) {
            //         deletIndex = index;
            //         break;
            //     }
            // }
            if (!fileList) {
                return true;
            }
            return new Promise((resolve, reject) => {
                Modal.confirm({
                    title: '是否确定删除？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        for (let i = 0, l = fileList.length; i < l; i++) {
                            let uid = fileList[i].uid;
                            if (uid === deleteUid) {
                                deletIndex = i;
                                break;
                            }
                        }
                        if (deletIndex !== null) {
                            fileList.splice(deletIndex, 1);
                            this.props.form.setFields({
                                [`${key}`]: {
                                    value: fileList,
                                },
                            });
                        }
                        resolve();
                    },
                    onCancel: () => {
                        resolve(false);
                    }
                });
            });
        },
        onError: (err, response, file) => {
            const {
                uid,
                name,
            } = file;
            const newfile = {
                uid,
                name,
                status: 'error',
                response: '上次失败',
            };
            let fileList = this.props.form.getFieldValue(key);
            if(number && number === 1) {
                fileList = [newfile];
            }
            else {
                for (let i = 0, l = fileList.length; i < l; i++) {
                    let tempUid = fileList[i].uid;
                    if (tempUid === uid) {
                        fileList[i] = newfile;
                        break;
                    }
                }
            }
            /**
             * 设置值
             */
            this.props.form.setFields({
                [`${key}`]: {
                    value: fileList,
                },
            });
            this.uploading = false;
        },
        onSuccess: (response, file) => {
            const {
                uid,
                name,
            } = file;
            const {
                msg,
                status,
                errcode,
                data,
                errmsg,
            } = response;
            // const {
            //     ossKey,
            //     url,
            // } = data;
            let fileList = this.props.form.getFieldValue(key);
            let newfile;
            if (Number(status) === 0 || Number(errcode) === 0) {
                newfile = {
                    uid,
                    name,
                    url: data.url,
                    ossKey: data.ossKey,
                    status: 'done',
                };
            }
            else {
                newfile = {
                    uid,
                    name,
                    status: 'error',
                    response: errmsg,
                };
            }
            if(number && number === 1) {
                fileList = [newfile];
            }
            else {
                for (let i = 0, l = fileList.length; i < l; i++) {
                    let tempUid = fileList[i].uid;
                    if (tempUid === uid) {
                        fileList[i] = newfile;
                        break;
                    }
                }
            }
            /**
             * 设置值
             */
            this.props.form.setFields({
                [`${key}`]: {
                    value: fileList,
                },
            });
            this.uploading = false;
        },
    }
    return props;
}

export default uploadProps;