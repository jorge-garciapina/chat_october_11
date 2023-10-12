import React from "react";
import { styled, Toolbar, Typography, IconButton, Badge } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageSelector from "../LanguageSelector";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
}));

export default function AppBarComponent({ username }) {
  return (
    <AppBar position="absolute">
      <Toolbar
        sx={{
          pr: "24px",
        }}
      >
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {username}
        </Typography>
        <LanguageSelector />
        <IconButton color="inherit">
          <Badge badgeContent={1} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
