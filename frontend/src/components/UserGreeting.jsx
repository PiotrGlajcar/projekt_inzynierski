
function UserGreeting(props) {
    if(props.isLoggedIn){
        return <h2 className="welcome-message"> Witaj {props.username}</h2>
    }
    else{
        return <h2 className="pls-login"> Zaloguj się, aby kontynuować</h2>
    }
}

export default UserGreeting