import { Button } from "@mui/material";

export const HomePage = () => {

    const onHomePageButtonClick = () => {

    }
    return (
    <div style={{paddingLeft: 10, fontSize:"20px"}}>Home Page
        <div>
        <Button variant="contained" onClick={onHomePageButtonClick}>Navigate</Button>
        </div>
   </div>
    );
};