import React from 'react'
import Super from "./../../super"
import {Cascader} from 'antd'

export default class NewCascader extends React.Component{

    state={
        options:[]
    }
    handleChange=(value)=>{
        let res=""
        res=value.join("->")
        console.log(res)
        this.triggerChange(res)
    }
    triggerChange = (changedValue) => {
        const { onChange } = this.props
        if (onChange) {
          onChange(changedValue);
        }
      }
    requestLinkage=(optionKey)=>{ //第一级联动
        const optGroupId=optionKey.split("@")[0]
        const time=optionKey.split("@")[1]
        Super.super({
			url:`/api/field/cas_ops/${optGroupId}`,                
		}).then((res)=>{
			const ops=[]
            res.options.map((item)=>{
                const op={}
                op["value"]=item.title
                op["label"]=item.title
                op["key"]=item.id
                op["isLeaf"]= false
                ops.push(op)
                return false
            })
            this.setState({
                options:ops,
                time
            })
		})
    }
    loadData = (selectedOptions) => { //子集联动
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        this.setState({
            time:this.state.time-1
        })
        if(selectedOptions && this.state.time>=1){
            let id="";
            selectedOptions.map((item)=>{
                id=item.key
                return false
            })
            Super.super({
                url:`/api/field/cas_ops/${id}`,                
            }).then((res)=>{
                const ops=[]
                const time=this.state.time
                res.options.map((item)=>{
                    let op={}
                    op["value"]=item.title
                    op["label"]=item.title
                    op["key"]=item.id
                    if(time===1){
                        op["isLeaf"]= true
                    }else{
                        op["isLeaf"]= false
                    }
                    ops.push(op)
                    return false
                })
                setTimeout(() => {
                    targetOption.loading = false;
                    targetOption.children =ops
                    this.setState({
                        options: [...this.state.options],
                    });
                }, 300);
            })
        }       
      }
    
    render(){
        const { optionKey,fieldName }=this.props
        return (
            <Cascader
                onClick={()=>this.requestLinkage(optionKey)}
                placeholder={`请选择${fieldName}`}
                style={{width:220}}
                options={this.state.options}
                loadData={this.loadData}
                displayRender={label=>label.join('->')}
                getPopupContainer={trigger => trigger.parentNode}
                onChange={this.handleChange}
            />
        )
    }
}