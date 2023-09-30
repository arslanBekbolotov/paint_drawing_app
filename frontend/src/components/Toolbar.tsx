import React from "react";

interface Props{
    setColor:(color:string) => void;
}

const Toolbar:React.FC<Props>= ({setColor}) => {
    const colors = ['white','black','red','blue','yellow','orange','pink','purple','green'];

    return (
        <div
            style={{display:'grid',gridTemplateRows:"repeat(3,1fr)",gridTemplateColumns:"repeat(3,1fr)",maxWidth:"120px",gap:"5px",position:"absolute",right:"10px",top:'10px'}}>
            {colors.map(color=>(
                <div
                    onClick={() => setColor(color)}
                    key={color}
                    style={{backgroundColor:color,width:'25px',height:'25px',borderRadius:'50%',border:"2px solid gray"}}/>
            ))}
        </div>
    );
};

export default Toolbar;