import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";
import "./confirmation.css";



const ConfirmationDialog = (props) => {
    const { open, onClose, onConfirm, title, description } = props;
    return (
      <Dialog
        open={open}
        onClose={() => onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="cancel-popup"
        style={{width:410,margin:"auto",height:240}}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={() => onClose()}
            className="btn pink-btn_"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
            }}
            autoFocus
            className="btn green-btn_"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmationDialog;
  