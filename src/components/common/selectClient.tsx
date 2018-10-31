import React, { Component } from 'react';

import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
const Option = Select.Option;
interface SelectClientProps  {
    defaultValue?:defaultValue;
    placeholder?:string;
    callback?:any;
    selectLen?:number;
}
interface defaultValue {
    key:any;
    label:any;
}
export default class SelectClient extends Component<SelectClientProps, any> {
    lastFetchId:number;
    // fetchUser:any;
    constructor(props: SelectClientProps) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
        this.state = {
            data: [],
            value: props.defaultValue || {},
            fetching: false,
        }
    }
    fetchUser = (value) => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        const {
            selectLen
        } = this.props;
        // 默认大于4位数查询
        const len =  selectLen || 4;
        if(value.length>len){
            fetchFn(`${DOMAIN_OXT}/apiv2_/account/account/vague/getVugueResult`, {cName:value}).then(data => data).then((data: any) => {
                if (fetchId !== this.lastFetchId) { // for fetch callback order
                    return;
                  }
                  const dataTemp = data.data.map(user => ({
                    text: user.cName,
                    value: user.cId,
                    adviserId: user.adviserId,
                    adviserName: user.adviserName,
                  }));
                  this.setState({ data:dataTemp, fetching: false });
    
            });
        }else{
            this.setState({ data:[], fetching: false });
        }
        

        
    }
    handleChange = (value) => {
        const {
            data
        } = this.state;
        const record = data.find(function(item, index, arr) {
            return item.value == value.key;
        }) // 10
        this.setState({
          value,
          data: [],
          fetching: false,
        });
        this.props.callback && this.props.callback(record);
    }

    render() {
        const { fetching, data, value } = this.state;
        const {
            placeholder,
            defaultValue
        } = this.props;
        return (
          <Select
            // mode="multiple"
            showSearch
            labelInValue
           
            value={value}
            placeholder={placeholder||"Select users"}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={this.fetchUser}
            onChange={this.handleChange}
            style={{ width: '100%' }}
          >
            {data.map(d => <Option key={d.value}>{d.text}</Option>)}
          </Select>
        );
    }


}