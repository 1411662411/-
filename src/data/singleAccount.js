var http = require('http');
var url = require('url');

http.createServer(function(req, res){
    var query = url.parse(req.url, true).query;
    var callback = query.callback || "callback";
    var data = {

        msg: "查询成功",
        
        status: 0 ,
        
        data:[{
            // 生效时间
            effectiveTime:'2018-01-17',
            // 材料数据
            materialsData:[{
                key:'soical1_fund1',
                data:{
                    // 客户需提供
                    offerData:[{
                        id: '1',
                        materialsName: '组织机构代码',
                        materialsValue: 'EDDF6545454DF2D',
                        materialsType: 1,
                        status:1, // 材料状态 1新增 2修改 3删除|停用
                    }, {
                        id: '2',
                        materialsName: '单位简称',
                        materialsValue: '1',
                        materialsType: 2,
                        materialsList: ['选项选项选项一','选项选项选项二','选项选项选项三'],
                        status:2, // 材料状态 1新增 2修改 3删除|停用
                    }, {
                        id: '3',
                        materialsName: '单位名称',
                        materialsValue: 2,
                        materialsType: 2,
                        materialsList: ['选项选项选项一','选项选项选项二','选项选项选项三'],
                        status:1, // 材料状态 1新增 2修改 3删除|停用
                    }, {
                        id: '4',
                        materialsName: '单位电话',
                        // materialsValue: '15001894728',
                        materialsType: 1,
                        status:1, // 材料状态 1新增 2修改 3删除|停用
                    }],
                    // 客户需准备
                    prepareData:[],
                    }
                },{
                    // 社保已开户公积金未开户需要开户
                    key:'soical1_fund2',
                    data:{}
                },{
                    // 社保已开户公积金未开户暂不开户
                    key:'soical1_fund3',
                    data:{}
                },{
                    // 社保未开户需要开户公积金已开户
                    key:'soical2_fund1',
                    data:{}
                },{
                    // 社保未开户需要开户公积金未开户需要开户
                    key:'soical2_fund2',
                    data:{}
                },{
                    // 社保未开户需要开户公积金未开户暂不开户
                    key:'soical2_fund3',
                    data:{}
                }
                
            ],
            mark:'仅开放给政策包审核人用', // 备注
            isOnline: 2, //上线状态 1 启用 2停用 
            auditStatus: 3, // 审核状态 1 待审核 2审核通过 3 被驳回
            rejectReason: '仅开放给政策包审核人用' //驳回原因
        },{
            // 生效时间
            effectiveTime:'2018-01-18',
            // 材料数据
            materialsData:[],
            mark:'', // 备注
            isOnline: 2, //上线状态 1 启用 2停用 
            auditStatus: 3, // 审核状态 1 待审核 2审核通过 3 被驳回
        }]
    };
    res.writeHead(200, {
        // 'Context-Type': 'application/x-www-form-urlencode;charset=utf-8',
        'Context-Type': 'text/html;charset=utf-8',
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Credentials': true
    });
    //res.end(callback+'('+JSON.stringify(data)+')');
    res.end(JSON.stringify(data));
}).listen(3000, function() {
    console.log('server is runing...');
});