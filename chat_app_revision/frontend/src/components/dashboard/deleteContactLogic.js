import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";

import { DELETE_CONTACT_MUTATION } from "../../graphql/userQueries";

export function useDeleteContactLogic(onDeleteSuccess) {
  const { t } = useTranslation();
  const [deleteContact, setDeleteContact] = useState(null);

  // Set up the mutation hook
  const [deleteContactMutation, { loading, error }] = useMutation(
    DELETE_CONTACT_MUTATION
  );

  const handleDelete = (contact) => {
    setDeleteContact(contact);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteContactMutation({
        variables: { receiverUsername: deleteContact },
      });

      // Handle the response if needed
      console.log(response.data.deleteContact.message);

      // Reset state after deletion
      setDeleteContact(null);

      // Call the onDeleteSuccess callback after a successful deletion
      onDeleteSuccess(deleteContact);
    } catch (mutationError) {
      console.error("Error deleting contact:", mutationError);
      // Optionally, you can also set up some state to display the error message to the user
    }
  };

  const DeleteContactDialog = () => (
    <Dialog
      open={Boolean(deleteContact)}
      onClose={() => setDeleteContact(null)}
    >
      <DialogTitle>{t("confirmDeletionTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("confirmDeletionMessage")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteContact(null)} color="primary">
          {t("cancelButton")}
        </Button>
        <Button onClick={confirmDelete} color="secondary" disabled={loading}>
          {loading ? "Loading..." : t("confirmButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { handleDelete, DeleteContactDialog, error }; // Added error to the returned object, in case you want to handle/display it
}
