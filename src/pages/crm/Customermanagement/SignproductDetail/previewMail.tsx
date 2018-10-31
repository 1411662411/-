import React from 'react';
import {
    Table,
} from 'antd'

import query from '../../../../util/query';
import { DOMAIN_OXT } from '../../../../global/global';
import { fetchFn } from '../../../../util/fetch';

const urlId = query('id');

class PreviewMail extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dataSource: null,
        }
    }

    getMailDetail = async() => {
        this.setState({isLoading: true});
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/jyMailSmsTemplatesSetting/getDetail`, {
            'id': urlId,
        })
            .then((res: any) => {
                this.setState({
                    dataSource: res.data,
                    isLoading: false,
                })
            });
    }

    async componentWillMount() {
        await this.getMailDetail();
    }

    render() {
        const {
            dataSource
        } = this.state;

        if(!dataSource){
            return false;
        }

        return (
            <div className="preview-mail">
            {dataSource.sendType == 1 ? dataSource.content
            :
            <span dangerouslySetInnerHTML={{ __html: dataSource.headerContent + dataSource.content + dataSource.footerContent }}></span>
            }
            </div>
        )
    }
}

export default PreviewMail