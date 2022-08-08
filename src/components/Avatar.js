import React, { useState } from "react";
import styled from "styled-components";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { ExitToApp } from "@material-ui/icons";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function Avatar() {
  const user = auth.currentUser;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getAvatar = () => {
    const { email } = user;
    return email ? email?.charAt(0)?.toUpperCase() : "";
  };

  const getEmail = () => {
    const { email } = user;
    return email || "";
  };

  const openMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onPressSignOut = async () => {
    try {
      await signOut(auth).then(() => {
        console.log("Cerrando sesión");
      });
    } catch (err) {
      console.log("Error al cerrar sesión: ", err);
    }
  };

  return (
    <>
      <Container onClick={openMenu}>
        <Text>{getAvatar()}</Text>
      </Container>
      <Menu
        style={{
          marginTop: 70,
          /* background: "rgba(0,0,0,0.6)", */
        }}
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        PaperProps={{
          elevation: 5,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            /* mt: 100, */
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}>
        <MenuContent>
          <Container onClick={openMenu}>
            <Text>{getAvatar()}</Text>
          </Container>
          <Email>{getEmail()}</Email>
          <MenuItem onClick={onPressSignOut}>
            <ListItemIcon>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            <MenuItemText>Cerrar sesión</MenuItemText>
          </MenuItem>
        </MenuContent>
      </Menu>
    </>
  );
}

const Container = styled.div`
  cursor: pointer;
  background-color: #00a680;
  height: 50px;
  width: 50px;
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Email = styled.p`
  font-weight: 600;
  font-size: 0.8rem;
  margin-top: 15px;
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 4px;
  padding-left: 15px;
  padding-right: 15px;
`;

const Text = styled.p`
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
`;

const MenuItemText = styled.p`
  color: black;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
`;
