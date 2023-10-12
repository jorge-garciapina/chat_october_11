import React, { useState, useEffect } from "react";
import { useDeleteContactLogic } from "./deleteContactLogic";
import {
  useRetrievePendingRequests,
  useRejectContactRequestLogic,
} from "./contactRequestLogic";
import { useAcceptContactRequestLogic } from "./contactRequestLogic";
import SearchComponent from "./contactElements/SearchComponent";
import PendingContactRequests from "./contactElements/PendingContactRequests";
import ContactList from "./contactElements/ContactList";

export default function Contacts({ contactList, contactRequests }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localContactList, setLocalContactList] = useState(contactList);
  const [localContactRequests, setLocalContactRequests] =
    useState(contactRequests);

  const { pendingRequests, refetch } = useRetrievePendingRequests();
  const acceptContactRequestLogic = useAcceptContactRequestLogic();
  const { handleReject, RejectContactDialog } = useRejectContactRequestLogic();

  useEffect(() => {
    refetch();
    setLocalContactList(contactList);
    setLocalContactRequests(contactRequests);
  }, [searchTerm, refetch, contactList, contactRequests]);

  const handleContactRemoval = (deletedContact) => {
    setLocalContactList((prevContacts) =>
      prevContacts.filter((contact) => contact !== deletedContact)
    );
  };

  const handleContactRequestRemoval = (deletedContactReq) => {
    setLocalContactRequests((prevContactReqs) =>
      prevContactReqs.filter((contactReq) => contactReq !== deletedContactReq)
    );
  };

  const handleAcceptContactRequest = async (acceptedContact) => {
    try {
      await acceptContactRequestLogic.handleAcceptContactRequest(
        acceptedContact
      );
      handleContactRequestRemoval(acceptedContact);
      setLocalContactList((prevContacts) => [...prevContacts, acceptedContact]);
    } catch (error) {
      console.error("Failed to accept contact request:", error);
    }
  };

  const { handleDelete, DeleteContactDialog } =
    useDeleteContactLogic(handleContactRemoval);

  return (
    <div>
      {/* SEARCH COMPONENT */}
      <SearchComponent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleDelete={handleDelete}
        localContactList={localContactList}
        pendingRequests={pendingRequests}
      />

      {/* PENDING CONTACT REQUESTS */}
      <PendingContactRequests
        localContactRequests={localContactRequests}
        handleAcceptContactRequest={handleAcceptContactRequest}
        handleReject={handleReject}
      />

      {/* CONTACT LIST */}
      <ContactList
        localContactList={localContactList}
        handleDelete={handleDelete}
      />

      {/* Dialog to Confirm Deletion */}
      <DeleteContactDialog />
      <RejectContactDialog />
    </div>
  );
}
