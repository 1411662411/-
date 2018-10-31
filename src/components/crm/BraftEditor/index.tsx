import React from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import { message } from 'antd'

import { FILEUPLOAD } from '../../../api/crm/common'

import './style.less';

const fetchFile = async (url,file)=>{
    let headers = new Headers();
    var data = new FormData()
    data.append('file', file)
    let request = new Request(url, { credentials: 'include', method: 'POST', body: data, });
    let json;
    try {
        let response = await fetch(request)
        json = await response.json()
        console.log('Async parallel+fetch >>>', json);
    } catch (error) {
        json = 'error'
    }
    console.log('下面return json')
    return await json
}

interface richEditProps{
    htmlContent: string;
    handleChange: Function;
    config?: object;
}
class richEdit extends React.Component<any,any> {

    constructor(props) {
        super(props);
        this.state = {
            htmlContent: props.htmlContent,
            image:new Set(props.image),
        }
    }

    handleChange = (content) => {
        // console.log(content)
        this.setState({
            htmlContent: content
        })
    }

    handleRawChange = (rawContent) => {
        // console.log(rawContent)
        this.props.handleChange(rawContent,[...this.state.image])
    }

    handleSave = () => {
        //console.log(this.state.htmlContent)
    }

    handleBlur = (event) => {
        console.log(event)
    }

    render() {
        const uploadFn = async (param) => {

            const serverURL = FILEUPLOAD;
            const xhr = new XMLHttpRequest()
            const fd = new FormData()

            // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
            // console.log(param.libraryId)

            const successFn = (response) => {
                // 假设服务端直接返回文件上传后的地址
                // 上传成功后调用param.success并传入上传后的文件地址
                let image = this.state.image.add(JSON.parse(xhr.responseText).data)
                this.setState({image})
                param.success({
                    url: JSON.parse(xhr.responseText).data 
                })
            }

            const progressFn = (event) => {
                // 上传进度发生变化时调用param.progress
                param.progress(event.loaded / event.total * 100)
            }

            const errorFn = (response) => {
                // 上传发生错误时调用param.error
                param.error({
                    msg: 'unable to upload.'
                })
            }

            xhr.upload.addEventListener("progress", progressFn, false)
            xhr.addEventListener("load", successFn, false)
            xhr.addEventListener("error", errorFn, false)
            xhr.addEventListener("abort", errorFn, false)

            fd.append('file', param.file)
            fd.append('myType', '99')
            xhr.open('POST', serverURL, true)
            xhr.send(fd)
            // await fetchFile(FILEUPLOAD, )

        }

        // 不允许选择大于8m的文件
        const validateFn = (file) => {
            let name = file.name.split('.');
            name = name[name.length-1];
            if (name != 'jpg' 
                && name != 'jpeg' 
                && name != 'bmp' 
                && name != 'gif' 
                && name != 'png' 
                && name != 'svg' 
            ){
                message.error('只支持：.jpg .jpeg .bmp .gif .png .svg文件');
                return false;
            }
            if(file.size / 1024 / 1024 < 8){
                return true;
            }else{
                message.error('文件大小不能超过8M')
                return false;
            }
            
        }
        const editorProps = {
            placeholder: '请输入公告内容',
            contentFormat: 'html',
            initialContent: this.props.htmlContent,
            height: 500,
            media: {
                // allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
                image: true, // 开启图片插入功能
                video: false, // 开启视频插入功能
                audio: false, // 开启音频插入功能
                uploadFn: uploadFn, // 指定上传函数
                validateFn: validateFn, //指定图片大小校验函数
                // 如果以上三个值皆为false，则不允许插入任何外部媒体，也不会显示插入外部媒体的入口
                externalMedias: {
                    image: false,
                    audio: false,
                    video: false
                }
            },
            controls: [
                'undo', 'redo', 'split', 'font-size', /*'font-family', 'line-height', 'letter-spacing',
                'indent',*/ 'text-color', 'bold', 'italic', 'underline', 'strike-through',
                /*'superscript', 'subscript', 'emoji',*/ 'text-align', 'split', 'headings', 'list_ul',
                'list_ol', /*'blockquote', 'code',*/ 'split', /*'link', 'split',*/ 'hr', 'split', 'media'
            ],
            // onChange: this.props.handleChange,
            // onRawChange: this.handleRawChange,
            onHTMLChange : this.handleRawChange,
            // onSave: this.handleSave,
            // onBlur: this.handleBlur,
            // 增加自定义预览按钮
            // extendControls: [
            //     {
            //         type: 'split',
            //     },
            //     {
            //         type: 'button',
            //         text: '预览',
            //         className: 'preview-button',
            //         onClick: () => {
            //             //window.open().document.write(this.state.htmlContent)
            //         }
            //     }
            // ],
            ...this.props.config
        }
        return (
            <div className="editor-wrap">
                <BraftEditor {...editorProps} />
            </div>
        )

    }

    handleHTMLChange = (htmlContent) => {
        this.setState({ htmlContent })
    }

}

export default richEdit;