
function StudentDetail(props){

    return(
        <div className="student">
            <p>Imię: {props.name}</p>
            <p>Nazwisko: {props.surname}</p>
            <p>Jestes student?  {props.isStudent ? "jo" : "ni"}</p>
        </div>
    );
}

export default StudentDetail