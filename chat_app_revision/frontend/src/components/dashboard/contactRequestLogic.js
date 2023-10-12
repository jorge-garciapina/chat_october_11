import React, { useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import {
  SEND_CONTACT_REQUEST,
  CANCEL_CONTACT_REQUEST,
  RETRIEVE_PENDING_CONTACT_REQUESTS,
  RETRIEVE_CONTACT_REQUESTS,
  ACCEPT_CONTACT_REQUEST_MUTATION,
  REJECT_CONTACT_REQUEST_MUTATION,
} from "../../graphql/userQueries";

import { useTranslation } from "react-i18next"; // Import useTranslation

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export function useSendContactRequest() {
  const [sendContactRequest, { data, loading, error }] =
    useMutation(SEND_CONTACT_REQUEST);

  const handleSendContactRequest = async (receiverUsername) => {
    try {
      const response = await sendContactRequest({
        variables: { receiverUsername },
      });
      return response.data.sendContactRequest.message;
    } catch (err) {
      console.error("Error sending contact request:", err);
    }
  };

  return {
    handleSendContactRequest,
    loading,
    error,
    data,
  };
}

export function useCancelContactRequestLogic(onCancelSuccess) {
  const [cancelContactRequestMutation] = useMutation(CANCEL_CONTACT_REQUEST);

  const handleCancelContactRequest = async (username) => {
    try {
      await cancelContactRequestMutation({
        variables: { receiverUsername: username },
      });
      onCancelSuccess && onCancelSuccess(username);
    } catch (err) {
      console.error("Error canceling contact request:", err);
    }
  };

  return {
    handleCancelContactRequest,
  };
}

export function useRetrievePendingRequests() {
  const { data, loading, error, refetch } = useQuery(
    RETRIEVE_PENDING_CONTACT_REQUESTS
  );
  return {
    pendingRequests: data?.retrievePendingContactRequests || [],
    loading,
    error,
    refetch,
  };
}

export function useRetrieveContactRequests() {
  const { data, loading, error, refetch } = useQuery(RETRIEVE_CONTACT_REQUESTS);
  return {
    contactRequests: data?.retrieveContactRequests || [],
    loading,
    error,
    refetch, // Add this line to return the refetch function
  };
}

export function useAcceptContactRequestLogic() {
  const [acceptContactRequestMutation] = useMutation(
    ACCEPT_CONTACT_REQUEST_MUTATION
  );

  const handleAcceptContactRequest = async (username) => {
    try {
      await acceptContactRequestMutation({
        variables: { senderUsername: username },
      });
    } catch (err) {
      console.error("Error accepting contact request:", err);
    }
  };

  return {
    handleAcceptContactRequest,
  };
}

export function useRejectContactRequestLogic(onRejectSuccess) {
  const { t } = useTranslation();
  const [rejectContact, setRejectContact] = useState(null);

  // Set up the mutation hook
  const [rejectContactRequestMutation, { loading, error }] = useMutation(
    REJECT_CONTACT_REQUEST_MUTATION
  );

  const handleReject = (username) => {
    setRejectContact(username);
  };

  const confirmReject = async () => {
    try {
      const response = await rejectContactRequestMutation({
        variables: { senderUsername: rejectContact },
      });
      console.log(response.data.rejectContactRequest.message);

      // Reset state after rejection
      setRejectContact(null);

      // Call the onRejectSuccess callback after a successful rejection
      onRejectSuccess(rejectContact);
    } catch (err) {
      console.error("Error rejecting contact request:", err);
      // Optionally, you can also set up some state to display the error message to the user
    }
  };

  const RejectContactDialog = () => (
    <Dialog
      open={Boolean(rejectContact)}
      onClose={() => setRejectContact(null)}
    >
      <DialogTitle>{t("confirmDeletionTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("confirmRejectContactRequest")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setRejectContact(null)} color="primary">
          {t("cancelButton")}
        </Button>
        <Button onClick={confirmReject} color="secondary" disabled={loading}>
          {loading ? "Loading..." : t("confirmButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return {
    handleReject,
    RejectContactDialog,
    error, // Added error to the returned object, in case you want to handle/display it
  };
}
