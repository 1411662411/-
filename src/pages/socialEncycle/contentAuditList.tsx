import React from 'react'
import {
    Row,Col,Pagination,Input,Button,
    Modal,Spin
} from 'antd'
import Bubble from '../../components/drag/bubble';
import { connect } from 'react-redux';
import './contentAuditList.less'
import {
   categoryFormlistDis,
   articleEncycleListDis,
   articleEncycleAudittDis
} from '../../action/socialEncycleAction/socialEncycleAction';
import Udeitor from '../../components/common/udeitor';
import query from '../../util/query';
import { browserHistory } from 'react-router';
import { DOMAIN_OXT } from '../../global/global';
 let oneCategoryArrAll:any = []
 let classTop = 0
const mapStatus:any={
    1:'待审核',
    2:'通过',
    3:'驳回'
}
const { TextArea } = Input;
const ueditorConfig = [
    'anchor', 'undo', 'redo', 'bold', 'indent', 'snapscreen', 'italic', 'underline', 'strikethrough', 'subscript', //下标
    'fontborder', 'superscript', 'formatmatch', 'source', 'blockquote', 'pasteplain', 'selectall', 'preview', 'horizontal', //分隔线
    'removeformat', 'time', 'date', 'unlink', 'insertrow', 'insertcol', 'mergeright', 'mergedown', 'deleterow', 'deletecol', //删除列
    'splittorows', 'splittocols', 'splittocells', 'deletecaption', 'inserttitle', 'mergecells', 'deletetable', 'cleardoc', 'insertparagraphbeforetable', //"表格前插入行"
    'fontfamily', 'fontsize', 'paragraph', 'simpleupload', 'insertimage', 'edittable', 'edittd', 'link', 'spechars', 'searchreplace', //查询替换
    'map', 'insertvideo', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', 'forecolor', 'backcolor',
    'fullscreen', 'directionalityltr', 'directionalityrtl', 'rowspacingtop', 'rowspacingbottom', 'pagebreak', 'insertframe', //插入Iframe
    'imagenone', 'imageleft', 'imageright', 'attachment', 'imagecenter', 'wordimage', 'lineheight', 'edittip ','customstyle', //自定义标题
    'autotypeset','touppercase', 'tolowercase','background','inserttable','charts', // 图表
  ]
class ContentAuditList extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            currentPage:0,
            pageSize:20,
            oneCategory:[],
           twoCategory:[],
           threeCategory:[],
           fourCategory:[],
           fiveCategory:[],
           selectColor:[0,0,0,0,0],
           categoryList:[],
           whitchSel:{},
           inputTitle:'',
           textValue:'',
           visible:false,
           catyidList:'',
           articleId:'',
           content:'',
           clickSele:''
        }
    }
    componentWillMount(){
        const {dispatch} = this.props
        let promise = new Promise((resolve,reject)=>{
             dispatch(categoryFormlistDis({auditStatus:1,encyclopediaManageId:query('encyclopediaManageId'),resolve},'articleEncycleListDis')) 
        }).then((dataa:any)=>{
            let dataae = dataa.data
            let id = this.arrList(dataae)
            this.setState({
                whitchSel:id
            })
            this.sort(dataae,this.state.selectColor)
        })
       
    }
    componentWillReceiveProps(nextProps){
        let dataae = nextProps.categoryList
        this.sort(dataae,this.state.selectColor)
    }
    arrList(arr){
                 let len = arr.length 
                 let aa:any = ''
                 if(len>0){
                     if(arr[0].children){
                        return this.arrList(arr[0].children)
                     }else{
                         return arr[0]
                     }
                 }
             }
    
    sort=(arrSort:any,color:any)=>{
       oneCategoryArrAll= []
        classTop = 0
         let arr = this.forEachList(arrSort)
       let [oneCategory,twoCategory,threeCategory,fourCategory,fiveCategory] :any= [[],[],[],[],[]]
       arr.forEach((v,i) => {
           if(v.classTop===0){
               oneCategory.push(v)
           }else if(v.classTop===1){
               twoCategory.push(v)
           }else if(v.classTop===2){
               threeCategory.push(v)
           }else if(v.classTop===3){
               fourCategory.push(v)
           }else if(v.classTop===4){
               fiveCategory.push(v)
           }
       });
       let [oneCategoryNew,twoCategoryNew,threeCategoryNew,fourCategoryNew,fiveCategoryNew] :any= [[],[],[],[],[]]
       let oneSele = color[0]
       let twoSele = color[1]
       let threeSele = color[2]
       let fourSele = color[3]
       let fiveSele = color[4]
        if(oneCategory.length>0){
            let oneId:any =null
            if(oneCategory[oneSele]){
                oneId = oneCategory[oneSele].id
            }
            twoCategory.forEach((v,i)=>{
                if(v.parentId===oneId){
                    twoCategoryNew.push(v)
                }
            })
        }
       
        if(twoCategoryNew.length>0){
            let id
            if(twoCategoryNew[twoSele]){
                id=twoCategoryNew[twoSele].id
            }
                threeCategory.forEach((v,i)=>{
                    if(v.parentId==id){
                        threeCategoryNew.push(v)
                    }
                })
        }
    
       
           if(threeCategoryNew.length>0){
               let threeId:any =null
                if(threeCategoryNew[threeSele]){
                    threeId = threeCategoryNew[threeSele].id
                }
                    fourCategory.forEach((v,i)=>{
                        if(v.parentId===threeId){
                            fourCategoryNew.push(v)
                        }
                    })
           }  
       
           if(fourCategoryNew.length>0){
               let fourId:any =null
                if(fourCategoryNew[fourSele]){
                    fourId = fourCategoryNew[fourSele].id
                }
                    fiveCategory.forEach((v,i)=>{
                        if(v.parentId===fourId){
                            fiveCategoryNew.push(v)
                        }
                    })
           
       }
           this.setState({
               oneCategory:oneCategory,
               twoCategory:twoCategoryNew,
               threeCategory:threeCategoryNew,
               fourCategory:fourCategoryNew,
               fiveCategory:fiveCategoryNew,
               categoryList:arr
           })
    }
    forEachList(arr){
       arr.map((item,index)=>{
           
           oneCategoryArrAll.push(
               {
                   categoryName:item.categoryName,
                   id:item.id,
                   parentId:item.parentId,
                   encyclopediaCategoryIdString:item.encyclopediaCategoryIdString,
                   auditStatus:item.auditStatus,
                   classTop:classTop,
                   children:item.children
                }
               )
                
            if(item.children&&item.children.length>0){
               classTop++
                this.forEachList(item.children)
                return
            }
       })
       classTop--
       return oneCategoryArrAll
    }
    sonForEach(source, targetName) {
        if (source && source.length) {
            let bb
        let aa = this.forEachList(source)
            for (let item of aa) {
                if (item.id === targetName) {
                    return bb = item
                } 
            }
            return bb
        }
    }
    sonfind(arr){
        if(arr.children&&arr.children.length){
            return this.sonfind(arr.children[0])
        }else{
            return arr
        }
    }
    inputTitle(e){
        this.setState({
            inputTitle:e.target.value
        })
    }
    SeleColor(index,classTop,v){
        let selectColoarrr = this.state.selectColor
        let count = false
        let t=0

        //点击当前一级，当前一级下面的所有级都是0
        for(let i=0;i<selectColoarrr.length;i++){
            if(i>t&&count){
                selectColoarrr[i] = 0
            }
            if(i==classTop){
                selectColoarrr[i] = index
                t= i
                count = true
            }
        }
        this.setState({
            selectColor:selectColoarrr
        })
        const {dispatch} = this.props
        this.sort(this.props.categoryList,selectColoarrr)
        let whitchArr = this.sonForEach(this.props.categoryList,v.id)
        let whitchSel = this.sonfind(whitchArr)
        this.setState({
            whitchSel:whitchSel
        })
        let promise =new Promise((resolve,reject)=>{
            dispatch(articleEncycleListDis({
                currentPage:0,
                pageSize:20,
                categoryId:whitchSel.id,
                auditStatus:'',
                resolve,
            }))
        }).then((data:any)=>{
            let dataw = data.data
            let content = dataw.result.length>0?dataw.result[0].content:''
            let title = dataw.result.length>0?dataw.result[0].title:''
            let catyidList = dataw.result.length>0?dataw.result[0].socialEncyclopediaCategoryId:''
            let articleId = dataw.result.length>0?dataw.result[0].id:''
            this.setState({
                content:content,
                inputTitle:title,
                catyidList:catyidList,
                articleId:articleId
            })
        })
        
        // 并不是每次点击都要实例 编辑器，需要判断
    }
     onPaginationChange(pageNumber){
        this.setState({
            currentPage:pageNumber,
            pageSize:20,
        })
        const {dispatch} = this.props
        dispatch(articleEncycleListDis({
                currentPage:pageNumber,
                pageSize:20,
                categoryId:this.state.whitchSel.id,
                auditStatus:'',
            }))
    }
    handleSave(v){
        this.setState({
        visible: false,
        });
        const {dispatch} = this.props
        const articleList = this.props.articleList.result[0]
        const {
                    whitchSel,
                    inputTitle,
                    catyidList,
                    clickSele
                } = this.state
                let UE = window.UE; 
        
        let promise = new Promise((resolve,reject)=>{
            dispatch(articleEncycleAudittDis({
                id:clickSele?clickSele.id:articleList.id,		//政策文章表主键
                title:inputTitle?inputTitle:articleList.title,		//文章标题
                richTextContent:v=='old'?UE.getEditor("newcontainer").getContent():UE.getEditor("newnews").getContent(), 	//文章内容		
                auditStatus:2,	//审核状态 2通过 3驳回
                rejectReason:''	,//驳回原因
                resolve,
                categoryId:catyidList?catyidList:whitchSel.id
            }))
        }).then((data:any)=>{
            let dataww = data.data
                if(dataww===0){
                     dispatch(articleEncycleListDis({
                        currentPage:this.state.currentPage,
                        pageSize:20,
                        categoryId:this.state.whitchSel.id,
                        auditStatus:'',
                    }))
                }
            })
    }
    inputChange(e){
        this.setState({
            textValue:e.target.value,
        })
    }
    noOkSave(v){
        this.setState({
            visible: false,
        })
        let UE = window.UE; 
        const {dispatch} = this.props
        const articleList = this.props.articleList.result[0]
         const {
                    whitchSel,
                    inputTitle,
                    textValue,
                    catyidList,
                    articleId,
                    clickSele
                } = this.state
        let promise = new Promise((resolve,reject)=>{
            dispatch(articleEncycleAudittDis({
                id:clickSele?clickSele.id:articleList.id,		//政策文章表主键
                title:clickSele?clickSele.title:articleList.title,		//文章标题
                richTextContent:v=='old'?UE.getEditor("newcontainer").getContent():UE.getEditor("newnews").getContent(), 	//文章内容		
                auditStatus:3,	//审核状态 2通过 3驳回
                rejectReason:textValue,	//驳回原因
                categoryId:catyidList?catyidList:whitchSel.id,
                resolve,
            }))
        }).then((data:any)=>{
            let dataww = data.data
                if(dataww===0){
                     dispatch(articleEncycleListDis({
                        currentPage:this.state.currentPage,
                        pageSize:20,
                        categoryId:this.state.whitchSel.id,
                        auditStatus:'',
                    }))
                }
            })
        
    }
    hasShow(v){
        this.setState({
            inputTitle:v.title,
            visible:true,
            content:v.content,
            clickSele:v,
        })
    }
    
    handleCancel(){
        this.setState({
            visible: false,
        });
    }
    render(){
        const List = this.props.articleList
        let ListItem:any = []
        if(List.result){
            ListItem = List.result
        }
        return <div>
            <Spin tip="Loading..." spinning={this.props.spinLoading} delay={500}>
            <Row type="flex" justify="start" className="catygeory-row">
                <Col span={3} style={{textAlign:'center'}}>
                    <span>一级类目：</span>
                </Col>
                <ul className='aaaa'>
                    {this.state.oneCategory.map((v,i)=>{
                        if(i==this.state.selectColor[0]){
                          return <li 
                            style={{height: "30px", border: "solid 1px #22baa0",background:'#22baa0' }}
                            key={v.categoryName}
                            onClick={()=>{this.SeleColor(i,0,v)}}
                            >
                                <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                            </li>
                        }
                        else{
                            return <li 
                                    style={{height: "30px", border: "solid 1px #22baa0", }}
                                    key={v.categoryName}
                                    onClick={()=>{this.SeleColor(i,0,v)}}
                                    >
                                        <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                                    </li>
                        }
                    })}
                </ul>
            </Row>
            <Row type="flex" justify="start" className="catygeory-row">
                <Col span={3} style={{textAlign:'center'}}>
                    <span>二级类目：</span>
                </Col>
                <ul className='aaaa'>
                    {this.state.twoCategory.map((v,i)=>{
                       if(i==this.state.selectColor[1]){
                          return <li 
                            style={{height: "30px", border: "solid 1px #22baa0",background:'#22baa0' }}
                            onClick={()=>{this.SeleColor(i,1,v)}}
                            key={v.categoryName}
                            >
                                <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                            </li>
                        }
                        else{
                            return <li 
                                    style={{height: "30px", border: "solid 1px #22baa0", }}
                                    onClick={()=>{this.SeleColor(i,1,v)}}
                                    key={v.categoryName}
                                    >
                                        <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                                    </li>
                        }
                    })}
                </ul>
            </Row>
            <Row type="flex" justify="start" className="catygeory-row">
                <Col span={3} style={{textAlign:'center'}}>
                    <span>三级类目：</span>
                </Col>
                <ul className='aaaa'>
                    {this.state.threeCategory.map((v,i)=>{
                      if(i==this.state.selectColor[2]){
                          return <li 
                            style={{height: "30px", border: "solid 1px #22baa0",background:'#22baa0' }}
                            key={v.categoryName}
                            onClick={()=>{this.SeleColor(i,2,v)}}
                            >
                                <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                            </li>
                        }
                        else{
                            return <li 
                                    style={{height: "30px", border: "solid 1px #22baa0", }}
                                    onClick={()=>{this.SeleColor(i,2,v)}}
                                    key={v.categoryName}
                                    >
                                        <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                                    </li>
                        }
                    })}
                </ul>
            </Row>
            <Row type="flex" justify="start" className="catygeory-row">
                <Col span={3} style={{textAlign:'center'}}>
                    <span>四级类目：</span>
                </Col>
                <ul className='aaaa'>
                    {this.state.fourCategory.map((v,i)=>{
                       if(i==this.state.selectColor[3]){
                          return <li 
                            key={v.categoryName}
                            onClick={()=>{this.SeleColor(i,3,v)}}
                            style={{height: "30px", border: "solid 1px #22baa0",background:'#22baa0' }}
                            >
                                <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                            </li>
                        }
                        else{
                            return <li 
                                    style={{height: "30px", border: "solid 1px #22baa0", }}
                                    onClick={()=>{this.SeleColor(i,3,v)}}
                                    key={v.categoryName}
                                    >
                                        <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                                    </li>
                        }
                    })}
                </ul>
            </Row>
            <Row type="flex" justify="start" className="catygeory-row">
                <Col span={3} style={{textAlign:'center'}}>
                    <span>五级类目：</span>
                </Col>
                <ul className='aaaa'>
                    {this.state.fiveCategory.map((v,i)=>{
                       if(i==this.state.selectColor[4]){
                          return <li 
                            key={v.categoryName}
                            onClick={()=>{this.SeleColor(i,4,v)}}
                            style={{height: "30px", border: "solid 1px #22baa0",background:'#22baa0' }}
                            >
                                <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                            </li>
                        }
                        else{
                            return <li 
                                    style={{height: "30px", border: "solid 1px #22baa0", }}
                                    onClick={()=>{this.SeleColor(i,4,v)}}
                                    key={v.categoryName}
                                    >
                                        <span>{v.categoryName}</span>{v.auditStatus&&v.auditStatus!=2?<Bubble text={mapStatus[v.auditStatus]}/>:null}
                                    </li>
                        }
                    })}
                </ul>
            </Row>
            <Modal
                visible={this.state.visible}
                bodyStyle={{height:'100%'}}
                closable={false}
                footer={null}
                width='1000px'
                >
                <p style={{display:'flex',justify:"start"}}>
                    <span style={{width:50,height:32,lineHeight:'32px'}}>标题：</span>
                    <Input onChange={(e)=>this.inputTitle(e)} value={this.state.inputTitle}/>
                </p>
                <Row style={{marginTop:'10px'}}>
                    <Udeitor config={ueditorConfig} id="newnews" key={this.state.content} defaultValue={this.state.content}></Udeitor>
                </Row>
                <Row type="flex" justify="space-around" align="middle" style={{margin:'20px 0'}}>
                        <Button onClick={()=>this.handleCancel()}>返回</Button>
                        <Button type='primary' onClick={()=>this.handleSave('new')}>保存并同意</Button>
                        <Col>
                            原因：<TextArea rows={3} style={{width:200}} onChange={(e)=>this.inputChange(e)}/>
                            <Button style={{background:'rgba(107, 93, 171, 1)'}} onClick={()=>this.noOkSave('new')}>不同意</Button>
                        </Col>
                </Row>
            </Modal>
            <Row style={{borderTop:'1px solid #000'}}>
            {ListItem.length>1||this.state.currentPage>0?
            <div >
                <ul className='dash-list'>
                    {ListItem.map((v,i)=>{
                        
                        return <li  className={v.auditStatus==1?'color-red':''}>
                            <span className='text-left'>
                                <i className='black-dot'></i>
                                <a className={v.auditStatus==1?'color-red':''} onClick={()=>this.hasShow(v)}>{v.title}</a>
                            </span>
                            <span className='time-right'>
                                {v.auditStatus!=''?<span>
                                <i style={{display:'block',height:'50%',textAlign:'center',lineHeight:'50px'}}>{mapStatus[v.auditStatus]}</i>
                                <i style={{display:'block',height:'50%',textAlign:'center',lineHeight:'50px'}}>{v.submitTimeString}</i>
                            </span>:
                            <span>
                                {v.submitTimeString}
                            </span>
                            }
                                                        
                            </span>
                        </li>
                    })}
                </ul>
                <Pagination style={{margin:'20px 0'}} showQuickJumper defaultCurrent={1} defaultPageSize={20} total={List.total} onChange={(pageNumber)=>this.onPaginationChange(pageNumber)} />
            </div>
                :
                <div>
                    {
                        (ListItem[0]&&ListItem[0].content)
                        ?
                        <Udeitor config={ueditorConfig} id="newcontainer" key={ListItem[0].content} defaultValue={ListItem[0].content}></Udeitor>
                        :
                        <Udeitor config={ueditorConfig} id="newcontainer" key={1} defaultValue={'2222'}></Udeitor>
                    }
                    
                    <Row type="flex" justify="center" align="middle" style={{margin:'20px 0'}}>
                        <Col span={4}>
                            <Button type='primary' onClick={()=>this.handleSave('old')}>保存并同意</Button>
                        </Col>
                        <Col>
                            原因：<TextArea rows={3} style={{width:200}} onChange={(e)=>this.inputChange(e)}/>
                            <br/>
                            <Button style={{background:'#fff',margin:'10px 0 0 43px'}} onClick={()=>this.noOkSave('old')}>不同意</Button>
                        </Col>
                    </Row>
                </div>
            }  
            </Row>
            </Spin>
        </div>
    }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('socialEncycleListReducer');
    data = data.toJS()
    return {
      categoryList:data.categoryList,
      Acument:data.Acument,
      articleList:data.articleList,
      spinLoading:data.aDuitspinLoading
    }
}; 

export default connect(mapStateToProps)(ContentAuditList);
// export default ContentAuditList