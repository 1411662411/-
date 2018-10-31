'use strict';
import React, { Component } from 'react';
import Tab from './Tab';
import TabCon from './TabCon';
import classSet from './util/classSet';
import Table from 'antd/lib/table/index';

import {
    parseAddressName
} from './util/util';

interface PostionContainerProps {
    matchQ: string;
    loading: boolean;
    searchDataSource: any[];
    setInputValue: (selectVal: number[], selectName: string[]) => void;
    index: number;
    selectVal: number[]
    valIndex: number;
    params: any;
    addressMap: Map<any, any>[];
    changeState: (params: any) => void;
    input: {
        left: number;
        top: number;
        width: number | string;
    }
    show,
    searching,
}
class PostionContainer extends Component<PostionContainerProps, {}> {
    zhReg = /[^\x00-\xff]$/;
    enReg = /[A-Za-z]$/;
    highlight = (data) => {
        let {
            matchQ,
        } = this.props;

        const {
            name,
            pinyin,
            py,
        } = data;
        matchQ = matchQ.trim();
        /**
         * 中文
         */
        if (this.zhReg.test(matchQ)) {
            const index = name.indexOf(matchQ);
            if (index >= 0) {
                let newName = name.replace(matchQ, `*&*${matchQ}*&*`);
                newName = newName.split('*&*').map((value) => {
                    if (value === matchQ) {
                        return <span style={{ color: '#ff6600' }}>{value}</span>
                    }
                    return value;
                });
                return newName
            }
            return name;

        }
        /**
         * 英文
         */
        if (this.enReg.test(matchQ)) {
            matchQ = matchQ.toLocaleUpperCase();
            const index = py.indexOf(matchQ.toLocaleUpperCase());
            if (index >= 0) {
                var reg = new RegExp(`(${matchQ})`, 'gi');
                let newName = py.replace(matchQ, (str) => `*&*${str}*&*`);

                newName = newName.split('*&*').map((value) => {
                    if (value === matchQ) {
                        return <span style={{ color: '#ff6600' }}>{value}</span>
                    }
                    return value;
                });

                return [name, <span>（{newName}）</span>,]
            }
            return name;
        }
        return name;
    }
    columns = () => {
        return [
            {
                key: 'city',
                render: (text, record, index) => {
                    const {
                    area,
                        city,
                        province,
                } = record;
                    return <div>
                        {/*{this.highlight(record)}*/}
                        {this.highlight(province)}，{this.highlight(city)}， {this.highlight(area)}
                    </div>
                },
            },
        ]
    }
    constructor(props) {
        super(props);
        // this.displayName = 'PostionContainer';
    }
    handClick(e) {
        /* 阻止冒泡 */
        e.nativeEvent.stopImmediatePropagation();
    }
    tableProps = () => {
        const {
            loading,
            searchDataSource,
            setInputValue,
            selectVal,
        } = this.props;
        let props = {
            size: 'small',
            rowKey: 　record => record.id,
            columns: this.columns(),
            showHeader: false,
            locale: {
                emptyText: '找不到你要的结果，换个试试',
            },
            pagination: {
                size: 'small',
                defaultPageSize: 8,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            },
            loading,
            dataSource: searchDataSource,
            onRowClick: (record, index, e) => {
                const {
                    area,
                    city,
                    province,
                } = record;
                setInputValue([province.value, city.value, area.value], [province.name, city.name, area.name]);
            },
            rowClassName: (record) => {
                if (selectVal.length <= 0) {
                    return '';
                }
                const {
                    area,
                    city,
                    province,
                } = record;
                const currentArr = [province.value, city.value, area.value];
                let className = 'active'
                for (let i = 0, l = selectVal.length; i < l; i++) {
                    if (selectVal[i] !== currentArr[i]) {
                        className = ''
                        break;
                    }
                }
                return className;
            }
        } as any;
        return props;
    }
    tabConProps = () => {
        const {
            index,
            selectVal,
            valIndex,
            params,
            addressMap,
            changeState,
        } = this.props;
        return {
            index,
            selectVal,
            valIndex,
            params,
            addressMap,
            changeState,
        };
    }
    render() {
        const {
            input,
            show,
            searching,
            loading,
            searchDataSource,
            params,
        } = this.props;
        /* className */
        let className = classSet({
            'show': show,
            'postion-container': true
        });



        /* 定位坐标 */
        let style = {
            left: input.left,
            top: input.top,
            width: input.width,
            ...params.popupStyle,
        }


        return (
            <div className={className} style={style} onClick={e => this.handClick(e)}>
                {
                    searching ?

                        <Table
                            {...this.tableProps() }
                        />
                        :
                        <div>
                            <Tab {...this.props} />
                            <TabCon {...this.tabConProps() } />
                        </div>
                }
            </div>
        )
    }
}



export default PostionContainer;




