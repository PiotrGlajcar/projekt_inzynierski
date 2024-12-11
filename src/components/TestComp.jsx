import React, {useState} from 'react'

function TestComp(){

    const [name, setName] = useState();

    const updateName = () => {
        setName("Tester");
        console.log(name);
    }

    return( 
    <div>
        <p>Name: {name} </p>
        <button onClick={updateName}>Set Name </button>
        
    </div>
    )
}
export default MyComponent