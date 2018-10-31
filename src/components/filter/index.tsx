import React from 'react'
import { Icon, Tooltip, Input, Button } from 'antd'
import './index.less'

interface TagProps {
    name: string,
    content: string,
    close: () => void
}

export class Tag extends React.Component<TagProps, any> {
    constructor(props) {
        super(props)
    }

    render() {

        const { name, content, close } = this.props

        return (
            <span className="tagWrap">
                <span className="name">{`${name}: `}</span>
                <span className="content">{content}</span>
                <Icon className="tagIcon" type="close-square" onClick={close}/>
            </span>
        )
    }
}

interface FilterProps {
    tags: JSX.Element[],
    reset: () => void,
    filterCompany: any,
    inputChange: any,
    companyName: string
}

export default class Filter extends React.Component<FilterProps, any> {
    constructor(props) {
        super(props)
        this.state = { v: '' }
    }

    inputChange = (e) => {
        this.props.inputChange(e)
        this.setState({ v: e.target.value })
    }

    render() {

        const { tags, reset, filterCompany, inputChange } = this.props

        return (
            <div>
                <div style={{margin: '10px 0'}}>
                    <Input style={{width: 150}} value={this.props.companyName} onChange={this.inputChange} placeholder="请填写公司名称"/>
                    <Button style={{margin: 6}} type="primary" onClick={filterCompany}>搜索</Button>
                    <span className="desc" style={tags.length > 0 ? { display: 'inline' } : { display: 'none' }}>筛选：</span>
                    {tags}
                    <span>
                        {
                            tags.length > 2
                            ? <Tooltip title="清除">
                                    <Button onClick={reset}>重置</Button>
                            </Tooltip>
                            : null
                        }
                    </span>
                </div>
            </div>
        )
    }
}