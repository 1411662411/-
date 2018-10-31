var http = require('http');
var url = require('url');

http.createServer(function(req, res){
    var query = url.parse(req.url, true).query;
    var callback = query.callback || "callback";
    var data = {

        msg: "查询成功",
        recordsFiltered: "14",
        recordsTotal: "14",
        status: 0 ,
        
        data:{
            records:[{
                "id": '1',
                "orderCode":  '2017030112',//请款单号
                "countdown":  '4天',//付款截止时间倒计时
                "endTime": '2017-04-05 15:00',//本次付款截止时间
                "createTime": '2017-03-01 12:00:00',//创建时间
                "planTime": '2017-03-01 12:00:00',//计划支付时间
                "exportStatus":   '已导出',// 导出状态
                "socialCashoutType":   '实付请款',// 社保业务请款性质
                "payeeType":   '服务商',//收款方类型
                "payeeName":  '北京外企德科人力资源服务深圳有限公司',//收款方名称
                "cashoutType":'代缴社保款',//请款单类型
                "helpbuyMoney":'1568.00',// 代发代付金额
                "cashoutUnit":'20',// 人月次
                "cashoutFeeSum":'189.9',// 总服务费
                "cashoutFee":'9.9',// 人均服务费（服务费/人月次）
                "prepayMoney":'129.9',// 垫付金额预付
                "cashoutMoney":'5568.00',// 请款总金额
                "socialMonth": '201703',//社保缴费月
                "cashoutSubmitter": '李四/150018945',//请款提交人
                "approvalHandler": '李大四（客户总监）/1551111233<br>王大五（服务总监）/1551111333',//审批经手人
            },{
                "id": '2',
                "orderCode":  '2017030113',//请款单号
                "countdown":  '4天',//付款截止时间倒计时
                "endTime": '2017-04-05 15:00',//本次付款截止时间
                "createTime": '2017-03-01 12:00:00',//创建时间
                "planTime": '2017-03-01 12:00:00',//计划支付时间
                "exportStatus":   '已导出',// 导出状态
                "socialCashoutType":   '实付请款',// 社保业务请款性质
                "payeeType":   '服务商',//收款方类型
                "payeeName":  '北京外企德科人力资源服务深圳有限公司',//收款方名称
                "cashoutType":'代缴社保款',//请款单类型
                "helpbuyMoney":'1568.00',// 代发代付金额
                "cashoutUnit":'20',// 人月次
                "cashoutFeeSum":'189.9',// 总服务费
                "cashoutFee":'9.9',// 人均服务费（服务费/人月次）
                "prepayMoney":'129.9',// 垫付金额预付
                "cashoutMoney":'5568.00',// 请款总金额
                "socialMonth": '201703',//社保缴费月
                "cashoutSubmitter": '李四/150018945',//请款提交人
                "approvalHandler": '李大四（客户总监）/1551111233<br>王大五（服务总监）/1551111333',//审批经手人
            },{
                "id": '3',
                "orderCode":  '2017030114',//请款单号
                "countdown":  '4天',//付款截止时间倒计时
                "endTime": '2017-04-05 15:00',//本次付款截止时间
                "createTime": '2017-03-01 12:00:00',//创建时间
                "planTime": '2017-03-01 12:00:00',//计划支付时间
                "exportStatus":   '已导出',// 导出状态
                "socialCashoutType":   '实付请款',// 社保业务请款性质
                "payeeType":   '服务商',//收款方类型
                "payeeName":  '北京外企德科人力资源服务深圳有限公司',//收款方名称
                "cashoutType":'代缴社保款',//请款单类型
                "helpbuyMoney":'1568.00',// 代发代付金额
                "cashoutUnit":'20',// 人月次
                "cashoutFeeSum":'189.9',// 总服务费
                "cashoutFee":'9.9',// 人均服务费（服务费/人月次）
                "prepayMoney":'129.9',// 垫付金额预付
                "cashoutMoney":'5568.00',// 请款总金额
                "socialMonth": '201703',//社保缴费月
                "cashoutSubmitter": '李四/150018945',//请款提交人
                "approvalHandler": '李大四（客户总监）/1551111233<br>王大五（服务总监）/1551111333',//审批经手人
            },
            
            ],
            cashoutSubmitter:[
                {
                    id:1,
                    name:'李四',
                    number:'JY001',
                    phone:'15001894728'
                },{
                    id:2,
                    name:'李四2',
                    number:'JY001',
                    phone:'15001894728'
                },{
                    id:3,
                    name:'李四3',
                    number:'JY001',
                    phone:'15001894728'
                }
            ],
            approvalHandler:[
                {
                    id:1,
                    name:'王四',
                    number:'JY001',
                    phone:'15001894728'
                },{
                    id:2,
                    name:'王四2',
                    number:'JY001',
                    phone:'15001894728'
                },{
                    id:3,
                    name:'王四3',
                    number:'JY001',
                    phone:'15001894728'
                }
            ],
            url:'https://oxt.joyomm.com/admin/api/excel/sign?fileName=325861369c25423e88b54d336d43f94c%2F%E7%A4%BE%E4%BF%9D%E5%AE%9E%E7%BC%B4%E8%B4%A6%E5%8D%95_20170426111606.xlsx&type=EXCEL'
        } 
    };
    res.writeHead(200, {
        'Context-Type': 'application/x-www-form-urlencode',
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Credentials': true
    });
    //res.end(callback+'('+JSON.stringify(data)+')');
    res.end(JSON.stringify(data));
}).listen(3000, function() {
    console.log('server is runing...');
});