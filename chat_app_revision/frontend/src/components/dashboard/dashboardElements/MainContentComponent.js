import React from "react";
import { Box, Container, Grid, Toolbar } from "@mui/material";
import Contacts from "../Contacts";

export default function MainContentComponent({
  content,
  infoData,
  contactRequests,
}) {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {content === "contacts" && (
            <Contacts
              contactList={infoData?.userInfo?.contactList || []}
              contactRequests={contactRequests || []}
            />
          )}
        </Grid>
      </Container>
    </Box>
  );
}
