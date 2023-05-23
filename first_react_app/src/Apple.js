//import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';



export const Apple = () => {
    //const Navigate = useNavigate()
    const onHomePageButtonClick = () => {
        //Navigate('/');
        alert("The button has been clicked");
    };
    return(
    <div>
        <div style={{paddingLeft: 10, fontSize:"20px"}}> Apple Page</div>
        <Button variant="contained" onClick={onHomePageButtonClick}>Navigate to home page</Button>
         {/* <button onClick={onHomePageButtonClick}>Navigate to home page</button> */}
    </div>
    );
};

