

import { useState } from 'react';
function App(){
    const[count,setCount]=useState(0);
    return(
        <div>
            <h1>count: {count}</h1>
            <button onClick={()=>setCount(count+1)}>click</button>
        </div>
    )
}
export default App;