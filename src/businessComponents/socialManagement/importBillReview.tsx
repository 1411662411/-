import * as React from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Input,
  Button,
  Modal,
  Upload,
  message,
  Timeline
} from "antd";
import { connect } from "react-redux";
import {formatMoney} from '../../util/util'
import { DOMAIN_OXT } from "../../global/global";
import "../../css/socialManagement/importBillReview.less";
import {
  duoduoOrderDetailDis,
  duoduoListDetailDis,
  duoduoExportDetailDis,
  duoduoUploadDetailDis,
  duoduoUploadStatusDis
} from "../../action/socialManagement/importBillReviewAction";
import { SocialBill } from "../../components/common/socialBill";
import query from "../../util/query";
import "./importBillReciew.css";
const { TextArea } = Input;
const TimelineItem:any = Timeline.Item;
const gridStyleRight = {
  width: "20%",
  textAlign: "right",
  paddingRight: "0"
};
const gridStyleLeft = {
  width: "30%",
  textAlign: "left",
  paddingLeft: "0"
};

class ImportBillReview extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { visible: false, rejectText: "", osskey: "", fileList: [] };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(duoduoOrderDetailDis({ orderCode: query("id") }));

    dispatch(duoduoListDetailDis({ code: query("id") }));
  }

  getOpenTicket(state) {
    if (state == null) return "/";
    else if (state == 0) return "否";
    else if (state == 1 || state == "索取") return "是";
    else return "否";
  }

  timetrans(time) {
    let date = new Date(time * 1000); //如果date为10位不需要乘1000
    let Y = date.getFullYear() + "-";
    let M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;

    return Y + M;
  }
  CardUI() {
    const { orderDetail } = this.props;
    const CarUI = (
      <Card hoverable={false} bordered={false}>
        <Card.Grid className="control" style={gridStyleRight}>
          订单号：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {orderDetail? orderDetail.order_code: "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          企业名称：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {orderDetail? orderDetail.c_name: "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          订单内容：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {orderDetail? orderDetail.order_name: "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          订单类型：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {orderDetail? orderDetail.order_type_name: "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          金额：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
          ¥ {orderDetail.order_money ? formatMoney(orderDetail.order_money,2,''): "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          支付方式：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {orderDetail? orderDetail.pay_method_name: "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          订单状态：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {orderDetail? orderDetail.order_staus_name: "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          是否开发票：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
          {orderDetail && this.getOpenTicket(orderDetail.is_claim_invoice)}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          订单创建时间：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {orderDetail? orderDetail.create_time: "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          确认到款时间：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {this.props.operaterTime?this.props.operaterTime:"/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          业务端到款认领操作人：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
        {this.props.operaterUser? this.props.operaterUser: "/"}
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleRight}>
          工资发放月：
        </Card.Grid>
        <Card.Grid className="control" style={gridStyleLeft}>
          {this.timetrans(orderDetail.send_salary_month)}
        </Card.Grid>
      </Card>
    );
    return CarUI;
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = e => {
    if (this.state.rejectText==''){
      message.error("请填写驳回原因");
      return 
    }
     const { dispatch } = this.props;

    dispatch(
      duoduoUploadDetailDis(
        {
          code: query("id"),
          ossKey: this.state.osskey,
          rejectReason: this.state.rejectText
        },
        {
          flag: 1,
          orderId: this.props.orderDetail.id,
          updateUser: this.props.orderDetail.create_user
        }
      )
    );
    
  };
  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  textValue = e => {
    this.setState({
      rejectText: e.target.value
    });
  };
  export = () => {
    const { dispatch } = this.props;
    dispatch(duoduoExportDetailDis({ code: query("id") }));
  };
  uploadOrder = () => {};
  isOk = () => {
    const { dispatch } = this.props;
    dispatch(
      duoduoUploadStatusDis({
        flag: 0,
        orderId: this.props.orderDetail.id,
        updateUser: this.props.orderDetail.create_user
      })
    );
  };
  beforUpload = file => {
    file.status = "uploading";
    this.setState({ oneLoading: true });
    if (
      file.name.split(".").pop() == "xls" ||
      file.name.split(".").pop() == "xlsx"
    ) {
      return true;
    } else {
      this.setState({ oneLoading: false, fileList:[]});
      message.error("导入格式错误,请上传.xls或.xlsx文件");
      return false;
    }
  };
  filterHTMLTag (msg)  {
    if (msg) {
      var msga = msg.replace(/<\/?[^>]*>/g, ""); //去除HTML Tag
      return msga;
    }
    
    return msg;
  };
  render() {
    console.log(this.props)
    const __this = this;
    const props = {
      name: "file",
      action: `${DOMAIN_OXT}/apiv4_/v1/sppayu/upload/file`,
      headers: {
        authorization: "authorization-text"
      },
      fileList: this.state.fileList,
      beforeUpload: this.beforUpload,
      onChange(info) {
        let osskey
        console.log(info.file.state)
        if (info.file.status === "uploading") {
            if(info.file.name.split(".").pop() !== "xls" &&
            info.file.name.split(".").pop() !== "xlsx"){
              __this.setState({
                fileList:[]
              })
              return
            }
            
        }
        if (info.file.status === "done") {
         
          osskey = info.file.response.data.ossKey;
          message.success(`${info.file.name}上传成功！`);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name}上传失败！`);
          return 
        }
        __this.setState({ osskey: osskey, fileList: info.fileList });
      }
    };

        const textArea = this.props.confirmInfos
        
    return <div>
        <Row>
          <Col span={4}>
            <h3>订单详情</h3>
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={this.export}>
              导出账单明细
            </Button>
          </Col>
        </Row>
        {this.CardUI()}
        <Row>
          {this.props.orderList && (
            <SocialBill type={6} dataSource={this.props.orderList} />
          )}
        </Row>
        <Row>
          <h3>认款备注：</h3>
          <Timeline style={{ maxHeight: 300, overflowY: 'auto', overflowX: 'hidden', wordBreak: 'break-all' }}>
                            {
                                textArea.map((item, index) =>
                                    <TimelineItem key={index} >
                                        <Row>
                                            <Col>
                                                {item.claimTime}
                                            </Col>
                                            <Col>
                                                {item.confirmInfo}
                                            </Col>
                                        </Row>

                                    </TimelineItem>
                                )
                            }
          </Timeline>
         
        </Row>
        {this.props.orderDetail.order_staus===20? <Row style={{ marginTop: "20px" }} className="model-father">
            <Col span={2}>
              <Button type="primary" onClick={this.isOk}>
                确认通过
              </Button>
            </Col>
            <Col>
              <Button onClick={this.showModal}>驳回</Button>
            </Col>
            <Modal title="提示" visible={this.state.visible} onOk={this.handleOk} onCancel={e => this.handleCancel(e)} maskClosable={false}>
              <div className="duoduoBile">
                <h3>请填写驳回原因</h3>
                <TextArea onChange={this.textValue} />

                <Upload {...props}>
                  {this.state.fileList.length >= 1 ? null : <Button type="primary" style={{ marginTop: 12 }}>
                      上传调整后的多多账单
                    </Button>}
                </Upload>
              </div>
            </Modal>
          </Row> : ""}
      </div>;
  }
}
const mapStateToProps = (state: any, ownProps: any): any => {
  let data = state.get("importBillDetail");
  data = data.toJS();
  return {
    confirmInfos:data.confirmInfos,
    orderDetail: data.order,
    operaterTime:data.operaterTime,
    operaterUser:data.operaterUser,
    orderList: data.orderList
  };
};

export default connect(mapStateToProps)(ImportBillReview);
