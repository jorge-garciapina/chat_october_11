import React from "react";
import { useTranslation } from "react-i18next";
// import {
//   useAcceptContactRequestLogic,
//   useRejectContactRequestLogic,
// } from "./contactRequestLogic";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";

export default function PendingContactRequests({
  localContactRequests,
  handleAcceptContactRequest,
  handleReject,
}) {
  const { t } = useTranslation();

  return (
    localContactRequests.length > 0 && (
      <Paper elevation={3}>
        <Typography variant="h5" gutterBottom>
          {t("contactRequests")}
        </Typography>
        <List>
          {localContactRequests.map((contactReq, index) => (
            <Paper elevation={3} style={{ margin: "8px 0" }} key={index}>
              <ListItem>
                <ListItemText primary={contactReq} />
                <IconButton
                  color="primary"
                  onClick={() => handleAcceptContactRequest(contactReq)}
                >
                  <CheckSharpIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => handleReject(contactReq)}
                >
                  <ClearSharpIcon />
                </IconButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Paper>
    )
  );
}
