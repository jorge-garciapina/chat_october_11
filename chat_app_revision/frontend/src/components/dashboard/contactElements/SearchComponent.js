import React from "react";
import { useTranslation } from "react-i18next";
import { SearchResults, useSearchUsers } from "../searchLogic";
import { TextField, Typography, Paper } from "@mui/material";

export default function SearchComponent({
  searchTerm,
  setSearchTerm,
  handleDelete,
  localContactList,
  pendingRequests,
}) {
  const { t } = useTranslation();
  const { users, loading, error } = useSearchUsers(searchTerm);

  return (
    <Paper elevation={5} style={{ padding: "16px", marginBottom: "16px" }}>
      <Typography variant="h5" gutterBottom>
        {t("searchContactPlaceholder")}
      </Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TextField
          variant="outlined"
          placeholder={t("searchContactPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, marginRight: "8px" }}
        />
        <div
          style={{
            position: "absolute",
            top: "100%",
            width: "100%",
            backgroundColor: "white",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            zIndex: 1,
          }}
        >
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          <SearchResults
            results={users}
            handleDelete={handleDelete}
            contactList={localContactList}
            pendingRequests={pendingRequests}
          />
        </div>
      </div>
    </Paper>
  );
}
