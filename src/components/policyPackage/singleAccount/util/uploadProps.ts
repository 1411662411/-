import {
    message,
    Modal,
} from 'antd';

interface UploadProps {
    (params: { 
        key: string;
        number?: number; 
        fileSize?: number;
        accept?: [keyof FileTypesInterface];
        listType?: 'text' | 'picture' | 'picture-card';
        uploadApi?: string;
        fileList:any[];
        callback:(key: string | number, fileList: any[] ) => void;
        uploading?:boolean;
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


const uploadProps:UploadProps = function ({ key, number, fileSize, listType, accept,uploadApi,callback,fileList,uploading})  {
    const props: any = {
        name: "file",
        action: uploadApi,
        accept: accept ? accept.join(',') : undefined,
        listType:listType||'text',
        defaultFileList:fileList||[],
        beforeUpload: (file) => {
            // const attachment = this.props.form.getFieldValue(key);
            // if (number && fileList && fileList.length >= number) {
            //     message.error(`上传附件数量限制为${number}份`);
            //     return false;
            // }
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
            
            file.status = 'uploading';
            // de
            callback(key,[file]);
            
        },
        onRemove: (file) => {
            const deleteUid = file.uid;
            
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
                            // this.props.form.setFields({
                            //     [`${key}`]: {
                            //         value: fileList,
                            //     },
                            // });
                            // TODO 删除为什么会更新缓存数据
                            callback(key,fileList);
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
            
            ;
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
            
            callback(key,fileList);
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
           
            
            let newfile;
            if (Number(status) === 0 || Number(errcode) === 0) {
                const {
                    ossKey,
                    url,
                } = data;
                newfile = {
                    uid,
                    name,
                    url: data.fileUrl,
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
            ;
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
            callback(key,fileList);
        },
    }
    return props;
}

export default uploadProps;