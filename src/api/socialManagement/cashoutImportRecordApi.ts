import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const CASHOUT_IMPORT_RECORD_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/input/record`;

const tempData  = {

        msg: "查询成功",
        recordsFiltered: "33",
        recordsTotal: "33",
        status: 0 ,
        
        data:{
            records:[
                {
                    id:'1',
                    operationTime:'2017-04-25 14:00:32',// 操作时间
                    importType:'付款账单（人月次维度明细表）',// 导入类型
                    contiguousFile:'https://oxt.joyomm.com/admin/api/excel/sign?fileName=325861369c25423e88b54d336d43f94c%2F%E7%A4%BE%E4%BF%9D%E5%AE%9E%E7%BC%B4%E8%B4%A6%E5%8D%95_20170426111606.xlsx&type=EXCEL',// 相关文件
                    contiguousFileName:'付款账单（人月次维度明细表）_20170425144725.csv',//文件名称
                },{
                    id:'2',
                    operationTime:'2017-04-24 14:03:17',// 操作时间
                    importType:'垫款明细',// 导入类型
                    contiguousFile:'https://oxt.joyomm.com/admin/api/excel/sign?fileName=325861369c25423e88b54d336d43f94c%2F%E7%A4%BE%E4%BF%9D%E5%AE%9E%E7%BC%B4%E8%B4%A6%E5%8D%95_20170426111606.xlsx&type=EXCEL',// 相关文件
                    contiguousFileName:'垫款明细_20170425144725.csv',//文件名称
                },{
                    id:'3',
                    operationTime:'2017-04-25 14:00:32',// 操作时间
                    importType:'付款账单（人月次维度明细表）',// 导入类型
                    contiguousFile:'https://oxt.joyomm.com/admin/api/excel/sign?fileName=325861369c25423e88b54d336d43f94c%2F%E7%A4%BE%E4%BF%9D%E5%AE%9E%E7%BC%B4%E8%B4%A6%E5%8D%95_20170426111606.xlsx&type=EXCEL',// 相关文件
                    contiguousFileName:'付款账单（人月次维度明细表）_20170425144725.csv',//文件名称
                },{
                    id:'4',
                    operationTime:'2017-04-25 14:00:32',// 操作时间
                    importType:'付款账单（人月次维度明细表）',// 导入类型
                    contiguousFile:'https://oxt.joyomm.com/admin/api/excel/sign?fileName=325861369c25423e88b54d336d43f94c%2F%E7%A4%BE%E4%BF%9D%E5%AE%9E%E7%BC%B4%E8%B4%A6%E5%8D%95_20170426111606.xlsx&type=EXCEL',// 相关文件
                    contiguousFileName:'付款账单（人月次维度明细表）_20170425144725.csv',//文件名称
                },{
                    id:'5',
                    operationTime:'2017-04-25 14:00:32',// 操作时间
                    importType:'付款账单（人月次维度明细表）',// 导入类型
                    contiguousFile:'https://oxt.joyomm.com/admin/api/excel/sign?fileName=325861369c25423e88b54d336d43f94c%2F%E7%A4%BE%E4%BF%9D%E5%AE%9E%E7%BC%B4%E8%B4%A6%E5%8D%95_20170426111606.xlsx&type=EXCEL',// 相关文件
                    contiguousFileName:'付款账单（人月次维度明细表）_20170425144725.csv',//文件名称
                }
            ]
        }
    };
export const cashoutImportRecordApi = (data) => {
    return fetchFn(CASHOUT_IMPORT_RECORD_API, data).then(data => data);
}


