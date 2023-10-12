import React from "react";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MainListItems } from "../listItems";

const drawerWidth = 240;

const StaticDrawer = styled(Box)({
  width: drawerWidth,
  boxSizing: "border-box",
});

export default function StaticDrawerComponent({ onContactsClick }) {
  return (
    <StaticDrawer>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: [1],
        }}
      >
        <IconButton>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <MainListItems onContactsClick={onContactsClick} />
        <Divider sx={{ my: 1 }} />
      </List>
    </StaticDrawer>
  );
}
