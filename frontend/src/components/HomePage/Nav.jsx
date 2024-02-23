import React from "react";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";

const Nav = ({ buttonType, statusType, bgColor, color }) => {
  return (
    <div className="wrapper">
      <TextField
        onInput={{ className: "ontextfield" }}
        inputProps={{ className: "textfield" }}
        InputLabelProps={{ className: "textfield-label" }}
        id="standard-basic"
        label={statusType}
        variant="standard"
      />

      <Button
        sx={{
          color: "#141414",
          backgroundColor: "#AF5A76",
        }}
        variant="contained">
        {buttonType}
      </Button>
    </div>
  );
};

export default Nav;
