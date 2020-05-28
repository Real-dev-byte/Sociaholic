import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar = ()=>{
    const searchModal=useRef(null)
    const mobilemode=useRef(null)
    const [search,setSearch]=useState('')
    const [userDetails,setUserDetails]=useState([])
    const {state,dispatch} = useContext(UserContext)
    const history=useHistory()
    
    useEffect(() => {
        M.Modal.init(searchModal.current)
        M.Sidenav.init(mobilemode.current)
    }, [])
    const renderList = ()=>{
        if(state){
            return [
                <li key="1" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><i className="large material-icons modal-trigger" style={{color:"black"}} data-target="modal1">search</i></li>,
                <li key="2" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/profile">Profile</Link></li>,
                <li key="3" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/create">Create Post</Link></li>,
                <li key="4" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/myfollowingpost">My Following posts</Link></li>,
                <li key="5"><button className="btn #d32f2f red darken-2" 
                style={{marginLeft:"30px",marginRight:"30px"}}
                onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                    M.Sidenav.init(mobilemode.current).close();
                }}>Logout
                </button></li> 
            ]
        }else{
            return [
                <li key="6" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/signin">Login</Link></li>,
                <li key="7" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    const renderSideList = ()=>{
        if(state){
            return [
                <li><div class="user-view">
                <div class="background">
                  <img src="https://images.unsplash.com/photo-1494253109108-2e30c049369b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
                </div>
                <img class="circle" src={state.pic}/>
                <span class="white-text name">{state.name}</span>
                <span class="white-text email">{state.email}</span>
              </div></li>,
                <li key="1" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link className="modal-trigger" style={{color:"black"}} data-target="modal1"><i class="material-icons">search</i>Search</Link></li>,
                <li key="2" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/profile"><i class="material-icons">person</i>Profile</Link></li>,
                <li key="3" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/create"><i class="material-icons">panorama</i>Create Post</Link></li>,
                <li key="4" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/myfollowingpost"><i class="material-icons">collections_bookmark</i>My Following posts</Link></li>,
                <li><div class="divider"></div></li>,
                <li key="5"><button className="btn #d32f2f red darken-2" 
                style={{marginLeft:"30px",marginRight:"30px"}}
                onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                    M.Sidenav.init(mobilemode.current).close();
                }}>Logout
                </button></li> 
            ]
        }else{
            return [
                <li key="6" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/signin">Login</Link></li>,
                <li key="7" onClick={()=>{M.Sidenav.init(mobilemode.current).close();}}><Link to="/signup">Signup</Link></li>
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
        <>
        <nav>
            <div className="nav-wrapper white" >
            <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
            <a href="#" data-target="slide-out" class="sidenav-trigger" style={{float:"right"}} ><i class="material-icons">menu</i></a>
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
          <ul id="slide-out" class="sidenav" ref={mobilemode}>
                {renderSideList()}
          </ul>
        </>
    )
}

export default NavBar