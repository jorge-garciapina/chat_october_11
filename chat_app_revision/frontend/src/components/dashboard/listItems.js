import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddReactionSharpIcon from "@mui/icons-material/AddReactionSharp";

import { useTranslation } from "react-i18next";

export const MainListItems = ({ onContactsClick }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ListItemButton onClick={onContactsClick}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary={t("contacts")} />
      </ListItemButton>
      {/* ... (any other list items) */}
      <ListItemButton onClick={onContactsClick}>
        <ListItemIcon>
          <AddReactionSharpIcon />
        </ListItemIcon>
        <ListItemText primary={t("requests")} />
      </ListItemButton>
    </React.Fragment>
  );
};

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary="Contacts" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <MessageIcon />
      </ListItemIcon>
      <ListItemText primary="Conversations" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Group Conversations" />
    </ListItemButton>
  </React.Fragment>
);
