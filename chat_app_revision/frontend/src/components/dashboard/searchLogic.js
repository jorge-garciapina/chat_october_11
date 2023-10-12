import React, { useState } from "react";
import { Paper, ListItem, ListItemText, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import NotInterestedSharpIcon from "@mui/icons-material/NotInterestedSharp";
import { useQuery } from "@apollo/client";
import { SEARCH_USERS } from "../../graphql/userQueries";
import {
  useSendContactRequest,
  useCancelContactRequestLogic,
} from "./contactRequestLogic";

export function SearchResults({
  results,
  handleDelete,
  contactList,
  pendingRequests,
}) {
  const [sentRequests, setSentRequests] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);

  const { handleSendContactRequest } = useSendContactRequest();

  const { handleCancelContactRequest } = useCancelContactRequestLogic({
    onSuccess: (username) => {
      setCancelledRequests((prev) => [...prev, username]);
    },
  });

  const handleSendRequest = async (username) => {
    await handleSendContactRequest(username);
    setSentRequests((prev) => [...prev, username]);
  };

  const handleCancelRequest = async (username) => {
    await handleCancelContactRequest(username);
    setCancelledRequests((prev) => [...prev, username]);
  };

  const renderUser = (user) => {
    let buttonComponent;

    if (contactList.includes(user.username)) {
      buttonComponent = (
        <>
          <IconButton color="primary">
            <SendIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleDelete(user.username)}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        </>
      );
    } else if (
      pendingRequests.includes(user.username) ||
      sentRequests.includes(user.username) ||
      cancelledRequests.includes(user.username)
    ) {
      if (cancelledRequests.includes(user.username)) {
        buttonComponent = (
          <IconButton
            color="primary"
            onClick={() => handleSendRequest(user.username)}
          >
            <AddCircleOutlineSharpIcon />
          </IconButton>
        );
      } else {
        buttonComponent = (
          <IconButton
            color="primary"
            onClick={() => handleCancelRequest(user.username)}
          >
            <NotInterestedSharpIcon />
          </IconButton>
        );
      }
    } else {
      buttonComponent = (
        <IconButton
          color="primary"
          onClick={() => handleSendRequest(user.username)}
        >
          <AddCircleOutlineSharpIcon />
        </IconButton>
      );
    }

    return (
      <Paper elevation={3} style={{ margin: "8px 0" }} key={user.username}>
        <ListItem>
          <ListItemText primary={user.username} />
          {buttonComponent}
        </ListItem>
      </Paper>
    );
  };

  return <div>{results.map(renderUser)}</div>;
}

export function useSearchUsers(searchTerm) {
  const { data, error, loading } = useQuery(SEARCH_USERS, {
    variables: { searchTerm },
    skip: !searchTerm,
  });

  return {
    users: data?.searchUser || [],
    loading,
    error,
  };
}
