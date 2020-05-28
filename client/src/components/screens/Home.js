import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import {FacebookShareButton} from 'react-share';
const Home = ()=>{
    const [data,setData]=useState([])
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result.posts);
            setData(result.posts);
        })
    },[])
    const likePost = (id) =>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData=data.map(item=>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
                
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const unlikePost = (id) =>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
                
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const makeComment = (text,postId) =>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id == postId){
                    return result
                }
                else{
                    return item
                }
                
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const deletePost =(postId) =>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.filter(item=>{
                return item._id != result._id
            })
            setData(newData)
        })
    }
    const deleteComment = (postId,commentId) =>{
        fetch(`/deletecomment/${postId}/${commentId}`,{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id == postId){
                    return result
                }
                else{
                    return item
                }
                
            })
            setData(newData)
        })
    }
    return(
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><p style={{margin:"0px"}}><Link to={(state._id != item.postedBy._id) ? "/profile/"+item.postedBy._id:"/profile"}>
                                <img src={item.postedBy.pic} style={{borderRadius:"50%",height:"30px",width:"30px",verticalAlign:"middle",marginRight:"5px"}}/>{item.postedBy.name}</Link> {state._id == item.postedBy._id 
                             &&<i className="material-icons right"
                                        onClick={()=>{deletePost(item._id)}}>delete</i>}</p></h5>
                            <div className="card-image">
                            {item.likes.includes(state._id)
                                ?
                                <img src={item.photo} onDoubleClick={()=>unlikePost(item._id)}/>
                                :
                                <img src={item.photo} onDoubleClick={()=>likePost(item._id)}/>
                            }
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {item.likes.includes(state._id)
                                ?
                                    <i className="material-icons" 
                                        onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                                :
                                    <i className="material-icons" 
                                        onClick={()=>{likePost(item._id)}}>thumb_up</i>   
                                }
                                
                                
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                    return <h6 key={record._id}><Link to={record.postedBy._id!==state._id?`/profile/${record.postedBy._id}`:'/profile'}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span></Link> {record.text} {state._id == record.postedBy._id 
                                        && <i className="material-icons right" 
                                                    onClick={()=>{deleteComment(item._id,record._id)}}>delete</i>}</h6>
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                    e.target[0].value=''
                                }}>
                                    <input type="text" placeholder="add a comment"/>
                                </form>
                                
                            </div>
                        </div>
                    )
                })
            }
        </div>  
    )
}

export default Home