import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar = ()=>{
    const searchModal=useRef(null)
    const [search,setSearch]=useState('')
    const [userDetails,setUserDetails]=useState([])
    const {state,dispatch} = useContext(UserContext)
    const history=useHistory()
    
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const renderList = ()=>{
        if(state){
            return [
                <li key="1"><i className="large material-icons modal-trigger" style={{color:"black"}} data-target="modal1">search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost">My Following posts</Link></li>,
                <li key="5"><button className="btn #d32f2f red darken-2" 
                onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                }}>Logout
                </button></li> 
            ]
        }else{
            return [
                <li key="6"><Link to="/signin">Login</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        })
        .then(res=>res.json())
        .then(results=>{
            setUserDetails(results.user)
            console.log(results)
        })
    }
    return(
        <nav>
            <div className="nav-wrapper white">
            <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                {renderList()}
            </ul>
            </div>
            <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content">
                <input 
                placeholder="Search User" 
                type="text"
                value={search}
                onChange={(e)=>fetchUsers(e.target.value)}
                />
                    <ul className="collection">
                    {userDetails.map(item=>{
                        return <li className="collection-item"  onClick={() => {
                            M.Modal.init(searchModal.current).close();
                            setSearch('');
                            window.open(item._id !== state._id ? "/profile/"+item._id : "/profile", "_self");
                            }}>{item.email}</li>  
                    })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch(''); setUserDetails([]);}}>Close</button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar