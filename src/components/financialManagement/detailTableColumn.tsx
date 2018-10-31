/**
 * Created by caozheng on 2017/2/21.
 */
import * as React from 'react';
import { Tooltip } from 'antd';
export const dataSource = { "msg": "ok", "errcode": 0, "recordsFiltered": "1", "data": { "list": [{ "A": 1, "B": "已提交", "C": "未支付", "D": "/", "E": "西安外国企业服务有限公司", "F": "3", "G": "4_1", "H": "623025198611017832", "I": "城镇", "J": "新增", "K": "2017年03月", "L": "3500.00", "M": "700.00", "N": "3500.00", "O": "8.00%", "P": "280.00", "Q": "3500.00", "R": "20.00%", "S": "280.00", "T": "3500.00", "U": "8.00%", "V": "70.00", "W": "3500.00", "X": "2.00%", "Y": "35.00", "Z": "3500.00", "AA": "1.00%", "AB": "17.50", "AC": "3500.00", "AD": "0.50%", "AE": "87.50", "AF": "3500.00", "AG": "2.50%", "AH": "17.50", "AI": "3500.00", "AJ": "0.50%", "AK": "", "AL": "2.00", "AM": "", "AN": "", "AO": "0.00", "AP": "0.00", "AQ": "0.00", "AR": "0.00", "AS": "", "AT": "", "AU": "", "AV": "0.00", "AW": "0.00", "AX": "", "AY": "0.00", "AZ": "", "BA": "", "BB": "", "BC": "", "BD": "", "BE": "", "BF": "", "BG": "", "BH": "", "BI": "", "BJ": "", "BK": "1495.50", "BL": "", "BM": "", "BN": 0, "BO": "0", "BP": "0", "BQ": "0", "BR": "0", "BS": "0", "BT": "0", "BU": "0", "BV": "0", "BW": "0", "BX": "0", "BY": "0", "BZ": "0", "CA": "0.00", "CB": "1498.50", "CC": "" }], "money": "1498.50" }, "recordsTotal": "1" }

/**
 * 判断是否为空
 * @param {any} value 值
 * @return {any} 
 */
const isEmpty = (value) => {
    return value === null || value === undefined || value === '' ? '/' : value;
};

export const getColumns: any = (type) => {

    /* 14: 五险一金 , 15: 五险, 16: 一金 */
    switch (Number(type)) {
        case 14:
            return [{
                title: '序号',
                key: 'A',
                dataIndex: 'A',
                width: 100,
                fixed: 'left',
            }, {
                title: '姓名',
                key: 'G',
                dataIndex: 'G',
                width: 100,
                fixed: 'left'
            }, {
                title: '证件号码',
                key: 'H',
                dataIndex: 'H',
                width: 160,
                fixed: 'left'
            }, {
                title: '请款是否已提交',
                key: 'B',
                width: 150,
                dataIndex: 'B',
            }, {
                title: '预付款支付情况',
                key: 'C',
                dataIndex: 'C',
                width: 150,
            }, {
                title: '上月收款方名称（服务商/分公司）',
                key: 'D',
                dataIndex: 'D',
                width: 300,
            }, {
                title: '本月收款方名称（服务商/分公司）',
                key: 'E',
                dataIndex: 'E',
                width: 300,
            }, {
                title: <span>本月服务费<br />（金柚网给服务商/元）</span>,
                key: 'F',
                dataIndex: 'F',
                width: 150,
            }, {
                title: '户籍性质',
                key: 'I',
                dataIndex: 'I',
                width: 100,
            }, {
                title: '五险',
                children: [{
                    title: '参保类型',
                    key: 'J',
                    dataIndex: 'J',
                    width: 100,
                }, {
                    title: '社保缴纳月',
                    key: 'K',
                    dataIndex: 'K',
                    width: 100,
                }, {
                    title: '社保基数',
                    key: 'L',
                    dataIndex: 'L',
                    width: 100,
                }, {
                    title: '养老保险',
                    children: [{
                        title: '企业汇缴',
                        key: 'M',
                        dataIndex: 'M',
                        width: 100,
                    }, {
                        title: '企业基数',
                        key: 'N',
                        dataIndex: 'N',
                        width: 100,
                    }, {
                        title: '企业缴纳比例',
                        key: 'O',
                        dataIndex: 'O',
                        width: 100,
                    }, {
                        title: '个人汇缴',
                        key: 'P',
                        dataIndex: 'P',
                        width: 100,
                    }, {
                        title: '个人基数',
                        key: 'Q',
                        dataIndex: 'Q',
                        width: 100,
                    }, {
                        title: '个人缴纳比例',
                        key: 'R',
                        dataIndex: 'R',
                        width: 100,
                    }]
                }, {
                    title: '医疗保险',
                    children: [{
                        title: '企业汇缴',
                        key: 'S',
                        dataIndex: 'S',
                        width: 100,
                    }, {
                        title: '企业基数',
                        key: 'T',
                        dataIndex: 'T',
                        width: 100,
                    }, {
                        title: '企业缴纳比例',
                        key: 'U',
                        dataIndex: 'U',
                        width: 100,
                    }, {
                        title: '个人汇缴',
                        key: 'V',
                        dataIndex: 'V',
                        width: 100,
                    }, {
                        title: '个人基数',
                        key: 'W',
                        dataIndex: 'W',
                        width: 100,
                    }, {
                        title: '个人缴纳比例',
                        key: 'X',
                        dataIndex: 'X',
                        width: 100,
                    }]
                }, {
                    title: '失业保险',
                    children: [{
                        title: '企业汇缴',
                        key: 'Y',
                        dataIndex: 'Y',
                        width: 100,
                    }, {
                        title: '企业基数',
                        key: 'Z',
                        dataIndex: 'Z',
                        width: 100,
                    }, {
                        title: '企业缴纳比例',
                        key: 'AA',
                        dataIndex: 'AA',
                        width: 100,
                    }, {
                        title: '个人汇缴',
                        key: 'AB',
                        dataIndex: 'AB',
                        width: 100,
                    }, {
                        title: '个人基数',
                        key: 'AC',
                        dataIndex: 'AC',
                        width: 100,
                    }, {
                        title: '个人缴纳比例',
                        key: 'AD',
                        dataIndex: 'AD',
                        width: 100,
                    }]
                }, {
                    title: '工伤保险',
                    children: [{
                        title: '企业汇缴',
                        key: 'AE',
                        dataIndex: 'AE',
                        width: 100,
                    }, {
                        title: '企业基数',
                        key: 'AF',
                        dataIndex: 'AF',
                        width: 100,
                    }, {
                        title: '企业缴纳比例',
                        key: 'AG',
                        dataIndex: 'AG',
                        width: 100,
                    }]
                }, {
                    title: '生育保险',
                    children: [{
                        title: '企业汇缴',
                        key: 'AH',
                        dataIndex: 'AH',
                        width: 100,
                    }, {
                        title: '企业基数',
                        key: 'AI',
                        dataIndex: 'AI',
                        width: 100,
                    }, {
                        title: '企业缴纳比例',
                        key: 'AJ',
                        dataIndex: 'AJ',
                        width: 100,
                    }]
                }, {
                    title: '补充大病',
                    children: [{
                        title: '企业缴纳固定值/月',
                        key: 'AK',
                        dataIndex: 'AK',
                        width: 100,
                    }, {
                        title: '个人缴纳固定值/月',
                        key: 'AL',
                        dataIndex: 'AL',
                        width: 100,
                    }]
                }, {
                    title: '补充医疗',
                    children: [{
                        title: '企业月收',
                        key: 'AM',
                        dataIndex: 'AM',
                        width: 100,
                    }, {
                        title: '地方补充医疗',
                        key: 'AN',
                        dataIndex: 'AN',
                        width: 100,
                    }, {
                        title: '企业缴纳住补医保个人账户',
                        key: 'AO',
                        dataIndex: 'AO',
                        width: 100,
                    }, {
                        title: '个人缴纳住补医保个人账户',
                        key: 'AP',
                        dataIndex: 'AP',
                        width: 100,
                    }, {
                        title: '企业住院医疗保险',
                        key: 'AQ',
                        dataIndex: 'AQ',
                        width: 100,
                    }, {
                        title: '个人住院医疗保险',
                        key: 'AR',
                        dataIndex: 'AR',
                        width: 100,
                    }, {
                        title: '其他补充医疗',
                        key: 'AS',
                        dataIndex: 'AS',
                        width: 100,
                    }, {
                        title: '农民工医疗保险',
                        key: 'AT',
                        dataIndex: 'AT',
                        width: 100,
                    }, {
                        title: '医疗互助保障金',
                        key: 'AU',
                        dataIndex: 'AU',
                        width: 100,
                    }]
                }, {
                    title: '补充工伤',
                    children: [{
                        title: '企业月收',
                        key: 'AV',
                        dataIndex: 'AV',
                        width: 100,
                    }, {
                        title: '个人月收',
                        key: 'AW',
                        dataIndex: 'AW',
                        width: 100,
                    }]
                }, {
                    title: '残保金',
                    children: [{
                        title: '年缴',
                        key: 'AX',
                        dataIndex: 'AX',
                        width: 100,
                    }, {
                        title: '月缴',
                        key: 'AY',
                        dataIndex: 'AY',
                        width: 100,
                    }]
                }, {
                    title: '其他',
                    children: [{
                        title: '垃圾费-企业',
                        key: 'AZ',
                        dataIndex: 'AZ',
                        width: 100,
                    }, {
                        title: '垃圾费-个人',
                        key: 'BA',
                        dataIndex: 'BA',
                        width: 100,
                    }, {
                        title: '工会费',
                        key: 'BB',
                        dataIndex: 'BB',
                        width: 100,
                    }, {
                        title: '采暖费',
                        key: 'BC',
                        dataIndex: 'BC',
                        width: 100,
                    }, {
                        title: '教育附加费',
                        key: 'BD',
                        dataIndex: 'BD',
                        width: 100,
                    }, {
                        title: '工本/材料费',
                        key: 'BE',
                        dataIndex: 'BE',
                        width: 100,
                    }, {
                        title: '制卡费',
                        key: 'BF',
                        dataIndex: 'BF',
                        width: 100,
                    }, {
                        title: '档案费',
                        key: 'BG',
                        dataIndex: 'BG',
                        width: 100,
                    }, {
                        title: '户口费',
                        key: 'BH',
                        dataIndex: 'BH',
                        width: 100,
                    }, {
                        title: '政府滞纳金',
                        key: 'BI',
                        dataIndex: 'BI',
                        width: 100,
                    }, {
                        title: '延误滞纳金',
                        key: 'BJ',
                        dataIndex: 'BJ',
                        width: 100,
                    }],
                }, {
                    title: '社保合计',
                    key: 'BK',
                    dataIndex: 'BK',
                    width: 100,
                }]
            }, {
                title: '公积金',
                children: [{
                    title: '公积金缴纳类型',
                    key: 'BL',
                    dataIndex: 'BL',
                    width: 150,
                }, {
                    title: '公积金缴纳月',
                    key: 'BM',
                    dataIndex: 'BM',
                    width: 100,
                }, {
                    title: '公积金基数',
                    key: 'BN',
                    dataIndex: 'BN',
                    width: 150,
                }, {
                    title: '企业部分',
                    children: [{
                        title: '公积金企业汇缴',
                        key: 'BO',
                        dataIndex: 'BO',
                        width: 150,
                    }, {
                        title: '公积金企业基数',
                        key: 'BP',
                        dataIndex: 'BP',
                        width: 150,
                    }, {
                        title: '公积金企业缴纳比例',
                        key: 'BQ',
                        dataIndex: 'BQ',
                        width: 150,
                    }]
                }, {
                    title: '个人部分',
                    children: [{
                        title: '公积金个人汇缴',
                        key: 'BR',
                        dataIndex: 'BR',
                        width: 150,
                    }, {
                        title: '公积金个人基数',
                        key: 'BS',
                        dataIndex: 'BS',
                        width: 150,
                    }, {
                        title: '公积金个人缴纳比例',
                        key: 'BT',
                        dataIndex: 'BT',
                        width: 150,
                    }]
                }, {
                    title: '补充公积金',
                    children: [{
                        title: '企业汇缴',
                        key: 'BU',
                        dataIndex: 'BU',
                        width: 100,
                    }, {
                        title: '企业基数',
                        key: 'BV',
                        dataIndex: 'BV',
                        width: 100,
                    }, {
                        title: '企业缴纳比例',
                        key: 'BW',
                        dataIndex: 'BW',
                        width: 100,
                    }, {
                        title: '个人汇缴',
                        key: 'BX',
                        dataIndex: 'BX',
                        width: 100,
                    }, {
                        title: '个人基数',
                        key: 'BY',
                        dataIndex: 'BY',
                        width: 100,
                    }, {
                        title: '个人缴纳比例',
                        key: 'BZ',
                        dataIndex: 'BZ',
                        width: 100,
                    }]
                }, {
                    title: '公积金合计',
                    key: 'CA',
                    dataIndex: 'CA',
                    width: 100,
                }]
            }, {
                title: '总合计',
                key: 'CB',
                dataIndex: 'CB',
                width: 100,
            }, {
                title: '备注',
                key: 'CC',
                dataIndex: 'CC',
                width: 100,
                render: (data) => {
                    data = isEmpty(data);
                    if (data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style:any = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },

            }];
        case 15:
            return [
                {
                    title: '序号',
                    key: 'A',
                    dataIndex: 'A', /* 序号 */
                    width: 100,
                    fixed: 'left',
                }, {
                    title: '请款是否已提交',
                    key: 'B',
                    dataIndex: 'B', /* 请款是否已提交 */
                    width: 100,
                    fixed: 'left',
                }, {
                    title: '预付款支付情况',
                    key: 'C',
                    dataIndex: 'C', /* 预付款支付情况 */
                    width: 100,
                    fixed: 'left',
                }, {
                    title: '上月收款方名称（服务商/分公司）',
                    key: 'D',
                    dataIndex: 'D', /* 上月收款方名称（服务商/分公司） */
                    width: 300,
                }, {
                    title: '本月收款方名称（服务商/分公司）',
                    key: 'E',
                    dataIndex: 'E', /* 本月收款方名称（服务商/分公司） */
                    width: 300,
                }, {
                    title: '参保类型',
                    key: 'F',
                    dataIndex: 'F', /* 参保类型 */
                    width: 100,
                }, {
                    title: '社保缴纳月',
                    key: 'G',
                    dataIndex: 'G', /* 社保缴纳月 */
                    width: 100,
                }, {
                    title: '姓名',
                    key: 'H',
                    dataIndex: 'H', /* 姓名 */
                    width: 100,
                }, {
                    title: '证件号码',
                    key: 'I',
                    dataIndex: 'I', /* 证件号码 */
                    width: 200,
                }, {
                    title: '户籍性质',
                    key: 'J',
                    dataIndex: 'J', /* 户籍性质 */
                    width: 100,
                }, {
                    title: '社保基数',
                    key: 'K',
                    dataIndex: 'K', /* 社保基数 */
                    width: 100,
                },
                {
                    title: '养老保险',
                    children: [
                        {
                            title: '企业汇缴',
                            key: 'L',
                            dataIndex: 'L', /* 养老保险企业汇缴 */
                            width: 100,
                        }, {
                            title: '企业基数',
                            key: 'M',
                            dataIndex: 'M', /* 养老保险企业基数 */
                            width: 100,
                        }, {
                            title: '企业缴纳比例',
                            key: 'N',
                            dataIndex: 'N',  /* 养老保险企业缴纳比例 */
                            width: 100,
                        }, {
                            title: '个人汇缴',
                            key: 'O',
                            dataIndex: 'O', /* 养老保险个人汇缴 */
                            width: 100,
                        }, {
                            title: '个人基数',
                            key: 'P',
                            dataIndex: 'P', /* 养老保险个人基数 */
                            width: 100,
                        }, {
                            title: '个人缴纳比例',
                            key: 'Q',
                            dataIndex: 'Q', /* 养老保险个人缴纳比例 */
                            width: 100,
                        },
                    ]
                },
                {
                    title: '医疗保险',
                    children: [
                        {
                            title: '企业汇缴',
                            key: 'R',
                            dataIndex: 'R', /* 医疗保险企业汇缴 */
                            width: 100,
                        }, {
                            title: '企业基数',
                            key: 'S',
                            dataIndex: 'S', /* 医疗保险企业基数 */
                            width: 100,
                        }, {
                            title: '企业缴纳比例',
                            key: 'T',
                            dataIndex: 'T', /* 医疗保险企业缴纳比例 */
                            width: 100,
                        }, {
                            title: '个人汇缴',
                            key: 'U',
                            dataIndex: 'U', /* 医疗保险个人汇缴 */
                            width: 100,
                        }, {
                            title: '个人基数',
                            key: 'V',
                            dataIndex: 'V', /* 医疗保险个人基数 */
                            width: 100,
                        }, {
                            title: '个人缴纳比例',
                            key: 'W',
                            dataIndex: 'W', /* 医疗保险个人缴纳比例 */
                            width: 100,
                        },
                    ]
                },
                {
                    title: '失业保险',
                    children: [
                        {
                            title: '企业汇缴',
                            key: 'X',
                            dataIndex: 'X', /* 失业保险企业汇缴 */
                            width: 100,
                        }, {
                            title: '企业基数',
                            key: 'Y',
                            dataIndex: 'Y', /* 失业保险企业基数 */
                            width: 100,
                        }, {
                            title: '企业缴纳比例',
                            key: 'Z',
                            dataIndex: 'Z', /* 失业保险企业缴纳比例 */
                            width: 100,
                        }, {
                            title: '个人汇缴',
                            key: 'AA',
                            dataIndex: 'AA', /* 失业保险个人汇缴 */
                            width: 100,
                        }, {
                            title: '个人基数',
                            key: 'AB',
                            dataIndex: 'AB', /* 失业保险个人基数 */
                            width: 100,
                        }, {
                            title: '个人缴纳比例',
                            key: 'AC',
                            dataIndex: 'AC', /* 失业保险个人缴纳比例 */
                            width: 100,
                        },
                    ]
                },
                {
                    title: '工伤保险',
                    children: [
                        {
                            title: '企业汇缴',
                            key: 'AD',
                            dataIndex: 'AD', /* 工伤保险企业汇缴 */
                            width: 100,
                        }, {
                            title: '企业基数',
                            key: 'AE',
                            dataIndex: 'AE', /* 工伤保险企业基数 */
                            width: 100,
                        }, {
                            title: '企业缴纳比例',
                            key: 'AF',
                            dataIndex: 'AF', /* 工伤保险企业缴纳比例 */
                            width: 100,
                        },
                    ]
                },
                {
                    title: '生育保险',
                    children: [
                        {
                            title: '企业汇缴',
                            key: 'AG',
                            dataIndex: 'AG', /* 生育保险企业汇缴 */
                            width: 100,
                        }, {
                            title: '企业基数',
                            key: 'AH',
                            dataIndex: 'AH', /* 生育保险企业基数 */
                            width: 100,
                        }, {
                            title: '企业缴纳比例',
                            key: 'AI',
                            dataIndex: 'AI', /* 生育保险企业缴纳比例 */
                            width: 100,
                        },
                    ]
                },
                {
                    title: '补充大病',
                    children: [
                        {
                            title: '企业缴纳固定值',
                            key: 'AJ',
                            dataIndex: 'AJ', /* 补充大病企业缴纳固定值 */
                            width: 100,
                        }, {
                            title: '个人缴纳固定值',
                            key: 'AK',
                            dataIndex: 'AK', /* 补充大病个人缴纳固定值 */
                            width: 100,
                        }
                    ]
                },
                {
                    title: '补充医疗',
                    children: [
                        {
                            title: '企业月收',
                            key: 'AL',
                            dataIndex: 'AL', /* 补充医疗企业月收 */
                            width: 100,
                        }, {
                            title: '地方补充医疗',
                            key: 'AM',
                            dataIndex: 'AM', //补充医疗地方补充医疗
                            width: 100,
                        }, {
                            title: '企业缴纳住补医保个人账户',
                            key: 'AN',
                            dataIndex: 'AN', //补充医疗企业缴纳住补医保个人账户
                            width: 150,
                        }, {
                            title: '个人缴纳住补医保个人账户',
                            key: 'AO',
                            dataIndex: 'AO', //补充医疗个人缴纳住补医保个人账户
                            width: 150,
                        }, {
                            title: '企业住院医疗保险',
                            key: 'AP',
                            dataIndex: 'AP', //补充医疗企业住院医疗保险
                            width: 150,
                        }, {
                            title: '个人住院医疗保险',
                            key: 'AQ',
                            dataIndex: 'AQ', //补充医疗个人住院医疗保险
                            width: 100,
                        }, {
                            title: '其他补充医疗',
                            key: 'AR',
                            dataIndex: 'AR', //补充医疗其他补充医疗
                            width: 100,
                        }, {
                            title: '农民工医疗保险',
                            key: 'AS',
                            dataIndex: 'AS', //补充医疗农民工医疗保险
                            width: 100,
                        }, {
                            title: '医疗互助保障金',
                            key: 'AT',
                            dataIndex: 'AT', //补充医疗医疗互助保障金
                            width: 100,
                        },
                    ]
                },
                {
                    title: '补充工伤',
                    children: [
                        {
                            title: '企业月收',
                            key: 'AU',
                            dataIndex: 'AU', //补充工伤企业月收
                            width: 100,
                        }, {
                            title: '个人月收',
                            key: 'AV',
                            dataIndex: 'AV', //补充工伤个人月收
                            width: 100,
                        },
                    ],
                },
                {
                    title: '残保金',
                    children: [
                        {
                            title: '年缴',
                            key: 'AW',
                            dataIndex: 'AW', //残保金残保金年缴
                            width: 100,
                        }, {
                            title: '月缴',
                            key: 'AX',
                            dataIndex: 'AX', /* 残保金残保金月缴 */
                            width: 100,
                        },
                    ]
                },
                {
                    title: '其他',
                    children: [
                        {
                            title: '垃圾费-企业',
                            key: 'AY',
                            dataIndex: 'AY', /* 其它垃圾费-企业 */
                            width: 100,
                        }, {
                            title: '垃圾费-个人',
                            key: 'AZ',
                            dataIndex: 'AZ', /* 其它垃圾费-个人 */
                            width: 100,
                        }, {
                            title: '工会费',
                            key: 'BA',
                            dataIndex: 'BA', /* 其它工会费 */
                            width: 100,
                        }, {
                            title: '采暖费',
                            key: 'BB',
                            dataIndex: 'BB', /* 其它采暖费 */
                            width: 100,
                        }, {
                            title: '教育附加费',
                            key: 'BC',
                            dataIndex: 'BC', /* 其它教育附加费 */
                            width: 100,
                        }, {
                            title: '工本',
                            key: 'BD',
                            dataIndex: 'BD', /* 其它工本/材料费 */
                            width: 100,
                        }, {
                            title: '制卡费',
                            key: 'BE',
                            dataIndex: 'BE', /* 其它制卡费 */
                            width: 100,
                        }, {
                            title: '档案费',
                            key: 'BF',
                            dataIndex: 'BF', /* 其它档案费 */
                            width: 100,
                        }, {
                            title: '户口费',
                            key: 'BG',
                            dataIndex: 'BG', /* 其它户口费 */
                            width: 100,
                        }, {
                            title: '政府滞纳金',
                            key: 'BH',
                            dataIndex: 'BH', /* 其它政府滞纳金 */
                            width: 100,
                        }, {
                            title: '延误滞纳金',
                            key: 'BI',
                            dataIndex: 'BI', /* 其它延误滞纳金 */
                            width: 100,
                        }
                    ]
                },
                {
                    title: '合计(元)',
                    key: 'BJ',
                    dataIndex: 'BJ', /* 社保合计 */
                    width: 100,
                }, {
                    title: '备注',
                    key: 'BK',
                    dataIndex: 'BK', /* 备注 */
                    width: 100,
                    render: (data) => {
                    data = isEmpty(data);
                    if (data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                },
            ]
        case 16:
            return [{
                title: '序号',
                dataIndex: 'A',
                key: 'A', //序号
                width: 100,
                fixed: 'left',
            }, {
                title: '请款是否已提交',
                dataIndex: 'B',
                key: 'B', //请款是否已提交
                width: 150,
                fixed: 'left',
            }, {
                title: '预付款支付情况',
                dataIndex: 'C',
                key: 'C', //预付款支付情况
                width: 150,
                fixed: 'left',
            }, {
                title: '上月收款方名称（服务商/分公司）',
                dataIndex: 'D',
                key: 'D', //上月收款方名称（服务商/分公司）
                width: 250,
            }, {
                title: '本月收款方名称（服务商/分公司）',
                dataIndex: 'E',
                key: 'E', //本月收款方名称（服务商/分公司
                width: 300,
            }, {
                title: '参保类型',
                dataIndex: 'F',
                key: 'F', //参保类型
                width: 100,
            }, {
                title: '社保缴纳月',
                dataIndex: 'G',
                key: 'G', //社保缴纳月
                width: 100,
            }, {
                title: '姓名',
                dataIndex: 'H',
                key: 'H', //姓名
                width: 100,
            }, {
                title: '证件号码',
                dataIndex: 'I',
                key: 'I', //证件号码
                width: 200,
            },
            {
                title: '公积金基数',
                dataIndex: 'J',
                key: 'J', //公积金基数
                width: 150,
            },
            {
                title: '企业部分',
                children: [
                    {
                        title: '企业汇缴',
                        dataIndex: 'K',
                        key: 'K', //公积金企业汇缴
                        width: 100,
                    }, {
                        title: '企业基数',
                        dataIndex: 'L',
                        key: 'L', //公积金企业基数
                        width: 100,
                    }, {
                        title: '企业缴纳比例',
                        dataIndex: 'M',
                        key: 'M', //公积金企业缴纳比例
                        width: 100,
                    },
                ]
            },
            {
                title: '个人部分',
                children: [
                   {
                        title: '个人汇缴',
                        dataIndex: 'N',
                        key: 'N', //公积金个人汇缴
                        width: 100,
                    }, {
                        title: '个人基数',
                        dataIndex: 'O',
                        key: 'O', //公积金个人基数
                        width: 100,
                    }, {
                        title: '个人缴纳比例',
                        dataIndex: 'P',
                        key: 'P', //公积金个人缴纳比例
                        width: 100,
                    },
                ],
            },
            {
                title: '补充公积金',
                children: [
                    {
                        title: '企业汇缴',
                        dataIndex: 'Q',
                        key: 'Q', //补充公积金企业汇缴
                        width: 100,
                    }, {
                        title: '企业基数',
                        dataIndex: 'R',
                        key: 'R', //补充公积金企业基数
                        width: 100,
                    }, {
                        title: '企业缴纳比例',
                        dataIndex: 'S',
                        key: 'S', //补充公积金企业缴纳比例
                        width: 100,
                    }, {
                        title: '个人汇缴',
                        dataIndex: 'T',
                        key: 'T', //补充公积金个人汇缴
                        width: 100,
                    }, {
                        title: '个人基数',
                        dataIndex: 'U',
                        key: 'U', //补充公积金个人基数
                        width: 100,
                    }, {
                        title: '个人缴纳比例',
                        dataIndex: 'V',
                        key: 'V', //补充公积金个人缴纳比例
                        width: 100,
                    }
                ]
            }, {
                title: '公积金合计',
                dataIndex: 'W',
                key: 'W', //公积金合计
                width: 100,
            }, {
                title: '备注',
                dataIndex: 'X',
                key: 'X', //备注
                width: 100,
                render: (data) => {
                    data = isEmpty(data);
                    if (data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
            },]
        default:
            return []
    }
}