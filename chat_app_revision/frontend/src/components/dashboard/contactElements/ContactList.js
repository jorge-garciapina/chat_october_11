import React from "react";
import { useTranslation } from "react-i18next";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function ContactList({ localContactList, handleDelete }) {
  const { t } = useTranslation();

  return (
    <Paper elevation={3}>
      <Typography variant="h5" gutterBottom>
        {t("contacts")}
      </Typography>
      <List>
        {localContactList.map((contact, index) => (
          <Paper elevation={3} style={{ margin: "8px 0" }} key={index}>
            <ListItem>
              <ListItemText primary={contact} />
              <IconButton color="primary">
                <SendIcon />
              </IconButton>
              <IconButton color="primary" onClick={() => handleDelete(contact)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Paper>
  );
}
