import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
const Profile = ()=>{
    const {state,dispatch}=useContext(UserContext)
    const [mypics,setPics]=useState([])
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    },[])
    useEffect(() => {
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","instaclone")
            data.append("cloud_name","instaclone-mern")
            fetch("https://api.cloudinary.com/v1_1/instaclone-mern/image/upload",{
            method:"post",
            body:data
            })
            .then(res=>res.json())
            .then(data=>{
                setUrl(data.url)
                console.log(data)

                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                })
                .then(res=>res.json())
                .then(data=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
                    dispatch({type:"UPDATEPIC",payload:data.pic})
                })
            })
            .catch(err=>{
                console.log(err) 
            })
        }
    }, [image])

    const updatePhoto =(file)=>{
        setImage(file)

    }
    return(
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{margin:"5px 0px 0px 0px",
                borderBottom:"1px solid grey"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={state?state.pic:"loading"}
                    />
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h6>{state?state.email:"loading"}</h6>   
                </div>
            </div>
            <div className="file-field input-field" style={{margin:"10px"}}>
                <div className="btn #64b5f6 blue darken-1">
                    <span>Update pic</span>
                    <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
               </div>   
            </div>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"5px 0px 5px 0px",
                    borderBottom:"1px solid grey"
                }}>
                            <h6><div style={{position:"relative",left:"15px"}}>{mypics.length}</div> posts</h6>
                            <h6><div style={{position:"relative",left:"15px"}}>{ state?state.followers.length :"0" }</div> followers</h6>
                            <h6><div style={{position:"relative",left:"15px"}}>{ state?state.following.length :"0" } </div> following</h6>
                </div>
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo}/>
                            )
                    })
                    
                }
            </div>
        </div>      
    )
}

export default Profile