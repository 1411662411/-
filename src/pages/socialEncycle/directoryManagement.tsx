import React from 'react'
import {
    Row,
    Col,
    Button,
    Input,
    message,
    Modal,
    Popconfirm,
    Pagination,
    Spin 
} from 'antd'
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
   policyEncycleAddDis,
   categoryFormlistDis,
   poicyEncycleEditorDis,
   poicyEncycleDeleteDis,
   articleEncycleAddDis,
   articleEncycleListDis,
   articleEncycleEditorDis,
   articleEncycleDeleteDis,
   isChangeColorDis,
   
} from '../../action/socialEncycleAction/socialEncycleAction';
import Drag from '../../components/drag/drag';
import query from '../../util/query';
import './directoryManagement.less'
import { DOMAIN_OXT } from '../../global/global';
import Udeitor from '../../components/common/udeitor';
const mapStatus:any={
    1:'待审核',
    2:'通过',
    3:'驳回'
}
declare global {
    interface Window { UE: any; }
}
 let oneCategoryArrAll:any = []
 let classTop = 0
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
class DirectoryManagment extends React.Component<any,any>{
    constructor(props){
        super(props);
        this.state={
            currentPage:0,
            pageSize:20,
            oneCategory:[],
            oneedtor:false,
            twoCategory:[],
            twoedtor:false,
            threeCategory:[],
            threeedtor:false,
            fourCategory:[],
            fouredtor:false,
            fiveCategory:[],
            fiveedtor:false,
            isaddClass:0,
            catygoryList:[],
            visible:false,
            inputTitle:'',
            articleId:'',
            isEditor:false,
            encyclopediaCategory:'',
            editorVlaue:[],
            editorInput:'', 
            mathNum:Math.random()
        }
       
    }
    componentDidMount(){
        const {dispatch}=this.props
        let promise = new Promise((resolve,reject)=>{
            dispatch(categoryFormlistDis({auditStatus:3,encyclopediaManageId:query('encyclopediaManageId'),resolve},'articleEncycleListDis'))
        })

    }
    componentWillUnmount(){
        const {dispatch} = this.props
        dispatch(isChangeColorDis({classic:'oneCategory',index:0,id:''},this.props))
    }
    addTable(num,id){
        this.setState({
            [id]:true,
        })
    }
    blurChang(id){
        this.setState({
            [id]:false,
        })
    }
    inputtext(e,idArr,isShow){
        let value = e.target.value
        if(value.length>7){
            return message.error('输入内容少于7个字')
          }
        let arr = this.state[idArr] 
        let parentId
        if(value===''){
            message.error('请添加目录名');
            return
        }
        if(arr.length<7){
            let leng = arr.length+1
            arr.push({newIndex:leng,text:value})
            this.setState({
                [idArr]:arr,
                [isShow]:false,
                isaddClass:length-1,
            })
        }
        const {dispatch}=this.props
        if(idArr=='oneCategory'){
            parentId=0
        }else{
            let index
            if(idArr=='twoCategory'){
                index = this.props.isChangeColor[0].index
                parentId = this.state.oneCategory[index].id
            }
            if(idArr=='threeCategory'){
                index = this.props.isChangeColor[1].index
                parentId = this.state.twoCategory[index].id
            }
            if(idArr=='fourCategory'){
                index = this.props.isChangeColor[2].index
                parentId = this.state.threeCategory[index].id
            }
            if(idArr=='fiveCategory'){
                index = this.props.isChangeColor[3].index
                parentId = this.state.fourCategory[index].id
            }
        }
        dispatch(policyEncycleAddDis({
            encyclopediaManageId:query('encyclopediaManageId'),
            parentId:parentId,
            categoryName:value
            },{classic:idArr,index:arr.length-1,old:this.props.isChangeColor,id:''}
        ))

    }
    showIcon(mode){
        let id = mode.id
        let value = mode.categoryName
        let e = mode.e
        e.stopPropagation();
        const {dispatch} = this.props
        dispatch(poicyEncycleDeleteDis({id:id,categoryName:value}))
    }
    sonInput(mode){
         let value = mode.value
         let id = mode.id
         const {dispatch} = this.props
        dispatch(poicyEncycleEditorDis({id:id,categoryName:value}))
    }
    clicka:any
    saveDate(ueEditor,title,editor){
        const {dispatch} = this.props
        let oneLen = this.state.oneCategory.length;
        let twoLen = this.state.twoCategory.length
        let threeLen = this.state.threeCategory.length
        let fourLen = this.state.fourCategory.length
        let fiveLen = this.state.fiveCategory.length
        let allLen = [
                {
                    len:oneLen,
                    fa:this.state.oneCategory
                },
                {
                    len:twoLen,
                    fa:this.state.twoCategory
                },{
                    len:threeLen,
                    fa:this.state.threeCategory 
                },{
                    len:fourLen,
                    fa:this.state.fourCategory
                },{
                    len:fiveLen,
                    fa:this.state.fiveCategory
                }      
            ]
        let whitchSel:any = null
        let encyclopediaCategory:any = null
        whitchSel = allLen.findIndex((value, index, arr) =>{
            return value.len===0
        })
        if(whitchSel>0){
            let classic = this.props.isChangeColor[whitchSel-1].classic//最后一级的哪个被选中
            let index = this.props.isChangeColor[whitchSel-1].index//最后一级的哪个被选中
            encyclopediaCategory = this.state[classic][index]
        }else if(whitchSel<0){
            whitchSel = allLen.length-1
            let classic = this.props.isChangeColor[whitchSel].classic//最后一级的哪个被选中
            let index = this.props.isChangeColor[whitchSel].index//最后一级的哪个被选中
            encyclopediaCategory = this.state[classic][index]
        }else{
            message.error('请选择类目');
            return
        }
        this.setState({
            encyclopediaCategory,
        })
        let UE = window.UE; 
        if(editor==='editor'){
            let richTextContent = ueEditor==='ue'?UE.getEditor("container").getContent():UE.getEditor("news").getContent()
            if(richTextContent==''){
                message.error('请填写文章内容')
                return
            }
            dispatch(articleEncycleEditorDis(
            {
                id:this.state.articleId,
                title:title,
                richTextContent:UE.getEditor("news").getContent(),
            },
            {
                encyclopediaCategoryId:encyclopediaCategory.id,
            }
        ))
        }else if(editor==='delete'){
            
            dispatch(articleEncycleDeleteDis(
            {
                id:title.id,
            },
            {
                encyclopediaCategoryId:encyclopediaCategory.id,
            }
        ))
        }else if(editor==='fenye'){
            dispatch(articleEncycleListDis({
                currentPage:title.currentPage,
                pageSize:title.pageSize,
                categoryId:encyclopediaCategory.id,
                auditStatus:'',
            }))
        }else if(editor=='editorInput'){
            let richTextContent = ueEditor==='ue'?UE.getEditor("container").getContent():UE.getEditor("news").getContent()
            if(richTextContent==''){
                message.error('请填写文章内容')
                return
            }
            dispatch(articleEncycleEditorDis(
            {
                id:this.props.articleList.result[0].id,
                title:this.state.editorInput?this.state.editorInput:this.props.articleList.result[0].title,
                richTextContent:ueEditor==='ue'?UE.getEditor("container").getContent():UE.getEditor("news").getContent()
            },
            {
                encyclopediaCategoryId:encyclopediaCategory.id,
            }))
        }
        else{
            let richTextContent = ueEditor==='ue'?UE.getEditor("container").getContent():UE.getEditor("news").getContent()
            if(richTextContent==''){
                message.error('请填写文章内容')
                return
            }
            dispatch(articleEncycleAddDis(
            {
                encyclopediaManageId:query('encyclopediaManageId'),
                encyclopediaCategoryId:encyclopediaCategory.id,
                title:title==='notitle'?'':title,
                categoryName:encyclopediaCategory.categoryName,
                richTextContent:richTextContent
            }
        ))
        }
        
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
    componentWillReceiveProps(nextProps){
        oneCategoryArrAll=[];
        classTop=0
       let arr = this.forEachList(nextProps.categoryList)
       let [oneCategory,twoCategory,threeCategory,fourCategory,fiveCategory] :any= [[],[],[],[],[]]
       arr.forEach((k,i) => {
           if(k.classTop==0){
               oneCategory.push(k)
           }else if(k.classTop==1){
               twoCategory.push(k)
           }else if(k.classTop==2){
               threeCategory.push(k)
           }else if(k.classTop==3){
               fourCategory.push(k)
           }else if((k.classTop==4)){
               fiveCategory.push(k)
           }
       })
       let [twoCategoryNew,threeCategoryNew,fourCategoryNew,fiveCategoryNew] :any= [[],[],[],[]]
       let oneSele = nextProps.isChangeColor[0].index
       let twoSele = nextProps.isChangeColor[1].index
       let threeSele = nextProps.isChangeColor[2].index
       let fourSele = nextProps.isChangeColor[3].index
       let fiveSele = nextProps.isChangeColor[4].index
       if(oneSele!==''){ 
           if(oneCategory.length>0){
                let oneId:any =null
                if(oneCategory[oneSele]){
                    oneId = oneCategory[oneSele].id
                }
                twoCategory.map((v,i)=>{
                    if(v.parentId===oneId){
                        twoCategoryNew.push(v)
                    }
                })
           }
       }
       if(twoSele!==''){ 
           if(twoCategoryNew.length>0){
               let twoId:any =null
                if(twoCategoryNew[twoSele]){
                    twoId = twoCategoryNew[twoSele].id
                }
                    threeCategory.map((v,i)=>{
                        if(v.parentId===twoId){
                            threeCategoryNew.push(v)
                        }
                    })
           }
       }
       if(threeSele!==''){
           if(threeCategoryNew.length>0){
               let threeId:any =null
                if(threeCategoryNew[threeSele]){
                    threeId = threeCategoryNew[threeSele].id
                }
                    fourCategory.map((v,i)=>{
                        if(v.parentId===threeId){
                            fourCategoryNew.push(v)
                        }
                    })
           }  
       }
       if(fourSele!==''){  
           if(fourCategoryNew.length>0){
               let fourId:any =null
                if(fourCategoryNew[fourSele]){
                    fourId = fourCategoryNew[fourSele].id
                }
                    fiveCategory.map((v,i)=>{
                        if(v.parentId===fourId){
                            fiveCategoryNew.push(v)
                        }
                    })
           }
       }
       this.setState({
           oneCategory:oneCategory,
           twoCategory:twoCategoryNew,
           threeCategory:threeCategoryNew,
           fourCategory:fourCategoryNew,
           fiveCategory:fiveCategoryNew
       })
    }
    showModel(){
        this.setState({
            visible: true,
            isEditor:false,
            inputTitle:'',
            mathNum:Math.random()
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.state.isEditor?this.saveDate('ueNew',this.state.inputTitle,'editor'):this.saveDate('ueNew',this.state.inputTitle,'')
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            isEditor:false,
        });
    }
    inputTitle(e){
        this.setState({
            inputTitle:e.target.value
        })
    }
    editorinputTitle(e){
        this.setState({
            editorInput:e.target.value
        })
    }
    articleEditor(v){
        this.setState({
            articleId:v.id
        });
        this.setState({
            visible: true,
            inputTitle:v.title,
            articleId:v.id,
            isEditor:true,
            editorVlaue:v
        });
    }
    articleDelete(v){
       this.saveDate('',v,'delete')
    }
    onPaginationChange(pageNumber){
        this.setState({
            currentPage:pageNumber,
            pageSize:20,
        })
        this.saveDate('',{currentPage:pageNumber,pageSize:20},'fenye')
    }
    render(){
        console.log(this.state.isEditor)
        const List = this.props.articleList
        let ListItem:any = []
        if(List.result && List.result.length>1){
            ListItem = List.result
        }else if(List.result && List.result.length>0){
            ListItem = List.result      
        }
       const isChangeColor= this.props.isChangeColor
    return <div>
                <Spin tip="Loading..." spinning={this.props.spinLoading} delay={500}> 
                    <Row style={{marginButton:'30px'}}>
                        <span>城市：</span>
                        <span>{query('province')}{query('cityname')}</span>
                    </Row>
                    <Row type="flex" justify="start" className="catygeory-row">
                        <Col span={3} style={{textAlign:'center'}}>
                            <span>一级类目：</span>
                        </Col>
                        <Drag dataListsss={this.state.oneCategory} 
                            ref={node => this.clicka = node}
                            sonInput={(mode)=>this.sonInput(mode)}
                            topClass={'oneCategory'} 
                            showIcon={(mode)=>this.showIcon(mode)}
                            isaddClass={isChangeColor.oneCategory}
                        />
                        {this.state.oneedtor==true?<Col span={2}><Input onBlur={()=>{this.blurChang('oneedtor')}} autoFocus={true} onPressEnter={(e)=>{this.inputtext(e,'oneCategory','oneedtor')}}/></Col>:null}
                        {this.state.oneCategory.length>=7?null:<Col span={3} style={{textAlign:'center'}}>
                                <Button 
                                style={{'color':'#22baa0','borderColor':'#22baa0','borderRadius':'8px'}} 
                                type="dashed" 
                                ghost
                                onClick={()=>this.addTable('oneCategory','oneedtor')}
                                >
                                    +添加
                                </Button>
                        </Col>}
                       
                    </Row>
                    <Row type="flex" justify="start" className="catygeory-row">
                        <Col span={3} style={{textAlign:'center'}}>
                            <span>二级类目：</span>
                        </Col>
                        <Drag dataListsss={this.state.twoCategory} 
                        ref={node => this.clicka = node}
                        sonInput={(mode)=>this.sonInput(mode)}
                        topClass={'twoCategory'}  
                        showIcon={(mode)=>this.showIcon(mode)}
                        isaddClass={isChangeColor.twoCategory}/>
                        {this.state.twoedtor==true?<Col span={2}><Input onBlur={()=>{this.blurChang('twoedtor')}} autoFocus={true} onPressEnter={(e)=>{this.inputtext(e,'twoCategory','twoedtor')}}/></Col>:null}
                        <Col span={3} style={{textAlign:'center'}}>
                        {this.state.oneCategory.length>0&&this.state.twoCategory.length<7?
                            <Button 
                            style={{'color':'#22baa0','borderColor':'#22baa0','borderRadius':'8px'}} 
                            type="dashed" 
                            ghost
                            onClick={()=>this.addTable('twoCategory','twoedtor')}
                            >
                                +添加
                            </Button>
                        :null}
                            
                        </Col>
                       
                    </Row>
                    <Row type="flex" justify="start" className="catygeory-row">
                        <Col span={3} style={{textAlign:'center'}}>
                            <span>三级类目：</span>
                        </Col>
                        <Drag dataListsss={this.state.threeCategory} 
                        ref={node => this.clicka = node}
                            sonInput={(mode)=>this.sonInput(mode)}
                        topClass={'threeCategory'} 
                        showIcon={(mode)=>this.showIcon(mode)}
                        isaddClass={isChangeColor.threeCategory}/>
                        {this.state.threeedtor==true?<Col span={2}><Input onBlur={()=>{this.blurChang('threeedtor')}} autoFocus={true} onPressEnter={(e)=>{this.inputtext(e,'threeCategory','threeedtor')}}/></Col>:null}
                        <Col span={3} style={{textAlign:'center'}}>
                            {this.state.twoCategory.length>0&&this.state.threeCategory.length<7?
                            <Button 
                            style={{'color':'#22baa0','borderColor':'#22baa0','borderRadius':'8px'}} 
                            type="dashed" 
                            ghost
                            onClick={()=>this.addTable('threeCategory','threeedtor')}
                            >
                                +添加
                            </Button>
                            :null}
                            
                        </Col>
                       
                    </Row>
                    <Row type="flex" justify="start" className="catygeory-row">
                        <Col span={3} style={{textAlign:'center'}}>
                            <span>四级类目：</span>
                        </Col>
                        <Drag dataListsss={this.state.fourCategory} 
                        ref={node => this.clicka = node}
                            sonInput={(mode)=>this.sonInput(mode)}
                        topClass={'fourCategory'} 
                        showIcon={(mode)=>this.showIcon(mode)}
                        isaddClass={isChangeColor.fourCategory}/>
                        {this.state.fouredtor==true?<Col span={2}><Input onBlur={()=>{this.blurChang('fouredtor')}} autoFocus={true} onPressEnter={(e)=>{this.inputtext(e,'fourCategory','fouredtor')}}/></Col>:null}
                        <Col span={3} style={{textAlign:'center'}}>
                            {this.state.threeCategory.length>0&&this.state.fourCategory.length<7?
                                <Button 
                            style={{'color':'#22baa0','borderColor':'#22baa0','borderRadius':'8px'}} 
                            type="dashed" 
                            ghost
                            onClick={()=>this.addTable('fourCategory','fouredtor')}
                            >
                                +添加
                            </Button>
                            :null}
                            
                        </Col>
                       
                    </Row>
                    <Row type="flex" justify="start" className="catygeory-row">
                        <Col span={3} style={{textAlign:'center'}}>
                            <span>五级类目：</span>
                        </Col>
                       <Drag dataListsss={this.state.fiveCategory} 
                       ref={node => this.clicka = node}
                            sonInput={(mode)=>this.sonInput(mode)}
                       topClass={'fiveCategory'} 
                       showIcon={(mode)=>this.showIcon(mode)}
                       isaddClass={isChangeColor.fiveCategory}/>
                        {this.state.fiveedtor==true?<Col span={2}><Input onBlur={()=>{this.blurChang('fiveedtor')}} autoFocus={true} onPressEnter={(e)=>{this.inputtext(e,'fiveCategory','fiveedtor')}}/></Col>:null}
                        <Col span={3} style={{textAlign:'center'}}>
                        {this.state.fourCategory.length>0&&this.state.fiveCategory.length<7?
                         <Button 
                            style={{'color':'#22baa0','borderColor':'#22baa0','borderRadius':'8px'}} 
                            type="dashed" 
                            ghost
                            onClick={()=>this.addTable('fiveCategory','fiveedtor')}
                            >
                                +添加
                            </Button>
                        :null}
                           
                        </Col>
                    </Row>
                    {this.state.oneCategory.length<1?
                        <p className='catygortNull'>请添加类目信息</p>
                    :
                        <div>

                            <Row type="flex" justify="end" style={{margin:'40px 0 20px 0'}}>
                                <Button disabled={ListItem.length>0?false:true} type='primary' onClick={()=>this.showModel()}>新建文章</Button>
                            </Row>
                            <Modal
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                bodyStyle={{height:'100%',width:'100%'}}
                                okText={this.state.isEditor?'提交审核':'保存并提交审核'}
                                cancelText="返回"
                                width='90%'
                                key={this.state.aeticle}
                                closable={false}
                                >
                                <p style={{display:'flex',justify:"start"}}>
                                    <span style={{width:50,height:32,lineHeight:'32px'}}>标题：</span>
                                    <Input onChange={(e)=>this.inputTitle(e)} value={this.state.inputTitle}/>
                                </p>
                                <Row style={{marginTop:'10px'}}>
                                    {this.state.isEditor
                                    ?
                                    <Udeitor config={ueditorConfig} id="news" key={this.state.editorVlaue.content} defaultValue={this.state.editorVlaue.content}></Udeitor>
                                    :
                                    <Udeitor config={ueditorConfig} id="news" key={this.state.mathNum}></Udeitor>
                                    }
                                    
                                    {this.state.editorVlaue.auditStatus==3?<span>驳回原因：{this.state.editorVlaue.rejectReason}</span>:null}
                                </Row>
                            </Modal>
                            {ListItem.length<2&&this.state.currentPage==0?
                                <div>
                                    <Row style={{postion:'relative'}}>
                                        {ListItem.length==1?
                                        <div>
                                            <Udeitor config={ueditorConfig} id="container" key={ListItem[0].content} defaultValue={ListItem[0].content}></Udeitor> 
                                            {ListItem[0].auditStatus==3?<span>驳回原因：{ListItem[0].rejectReason}</span>:''}
                                        </div>
                                        :
                                            <Udeitor config={ueditorConfig} id="container" key={1}></Udeitor>
                                        }         
                                    </Row>
                                    <Row type="flex" justify="center" align="middle" style={{marginTop:'30px'}}>
                                        <Col span={3}>
                                            {ListItem.length==1?
                                                <Button type='primary' loading={this.props.buttonLoading} onClick={()=>this.saveDate('ue','notitle','editorInput')}>保存并提交审核</Button>
                                            :
                                                <Button type='primary' loading={this.props.buttonLoading} onClick={()=>this.saveDate('ue','notitle','')}>保存并提交审核</Button>
                                            }
                                           
                                        
                                        </Col>
                                        <Col span={2}>
                                            <Button type='primary' onClick={()=>browserHistory.push(`${DOMAIN_OXT}/newadmin/socialensycle/policylist`)}>返回</Button>
                                        </Col>
                                    </Row>
                                </div>
                                : 
                                <div>
                                    <Row style={{borderTop:'1px solid #000'}}>
                                        <ul className='dash-list'>
                                            {ListItem.map((v,i)=>{
                                                return <li>
                                                            <span className='text-left'>
                                                                <i className='black-dot'></i>
                                                                {v.title}
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
                                                            <span className='caozuo'>
                                                                <a onClick={()=>this.articleEditor(v)}>编辑</a>
                                                            </span>
                                                            <span className='caozuo'>
                                                            <Popconfirm title="请确认该文章真的要删除？删除后将不可还原" onConfirm={()=>this.articleDelete(v)} okText="是" cancelText="否">
                                                                <a>删除</a>
                                                            </Popconfirm>
                                                                
                                                            </span>
                                                        </li>
                                            })}
                                        </ul>
                                        <Pagination style={{marginTop:'20px'}} showQuickJumper defaultCurrent={1} defaultPageSize={20} total={List.total} onChange={(pageNumber)=>this.onPaginationChange(pageNumber)} />
                                        <Row type="flex" justify="center" align="middle">
                                            <Col span={2}>
                                                <Button type='primary' onClick={()=>browserHistory.push(`${DOMAIN_OXT}/newadmin/socialensycle/policylist`)}>返回</Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                </div>
                            }
                        </div>
                    }
                </Spin>
            </div>
    }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('socialEncycleListReducer');
    data = data.toJS()
    return {
      categoryList:data.categoryList,
      isChangeColor:data.isChangeColor,
      articleList:data.articleList,
      allEncycleList:data.allEncycleList,
      buttonLoading:data.buttonLoading,
      spinLoading:data.spinLoading
    }
}; 
export default connect(mapStateToProps)(DirectoryManagment);