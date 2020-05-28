import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile = ()=>{
    const {state,loading,dispatch}=useContext(UserContext)
    const [userProfile,setProfile]=useState(null)
    const {userid}=useParams()
    const [showFollow,setshowFollow]=useState(state?!state.following.includes(userid):true)
    // 
    useEffect(()=>{
     if(!loading){
         ((state==null)?console.log("loading"):
         fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            if(state.following.includes(userid)){
                setshowFollow(false)
            }
            else{
                setshowFollow(true)
            }
            if(userProfile===null)
                setProfile(result)    
        })
        )
     }
    }
    ,[loading,state])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        })
        .then(res=>res.json())
            .then(data=>{
                console.log(userProfile)
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState)=>{
                    return {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }
                    }
                })
                
                setshowFollow(false)
            })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        })
        .then(res=>res.json())
            .then(data=>{
                dispatch({type:"UPDATE",payload:{following:data.following,
                followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState)=>{
                    const newfollowers=prevState.user.followers.filter(item=>item!=data._id)
                    return {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newfollowers
                        }
                    }
                })
                setshowFollow(true)
            })
    }

    return(

        <>
        {state&&userProfile? 
                <div style={{maxWidth:"550px",margin:"0px auto"}}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"5px 0px 0px 0px",
                    borderBottom:"1px solid grey"
                }}>
                    <div>
                        <img style={{display:"block",maxWidth:"160px",maxHeight:"160px",width:"100%",height:"auto",borderRadius:"50%"}}
                        src={userProfile.user.pic}
                        />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h6>{userProfile.user.email}</h6>
                        {showFollow?
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>followUser()}>Follow
                        </button> 
                        :
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>unfollowUser()}>UnFollow
                        </button> 
                        }
                    </div>
                </div>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"5px 0px 5px 0px",
                    borderBottom:"1px solid grey"
                }}>
                            <h6><div style={{position:"relative",left:"15px"}}>{userProfile.posts.length}</div> posts</h6>
                            <h6><div style={{position:"relative",left:"15px"}}>{userProfile.user.followers.length}</div> followers</h6>
                            <h6><div style={{position:"relative",left:"15px"}}>{userProfile.user.following.length}</div> following</h6>
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(item=>{
                            return(
                                <img key={item._id} className="item" src={item.photo}/>
                                )
                        })
                        
                    }
                </div>
            </div> 
        :<h2>loading ...</h2>}
  
        </>  

    )
}

export default Profile