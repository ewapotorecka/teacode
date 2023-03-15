import { Box, IconButton, Input, InputAdornment, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import Contact, { ContactInterface } from "../Contact/Contact";

const ContactsList = () => {
  const [users, setUsers] = useState<ContactInterface[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const handleCheck = (id: number) => {
    const userIdx = users.findIndex((el) => el.id === id);
    const usersCopy = [...users];
    const checkedIds = [...checked];
    const checkedIdIdx = checkedIds.findIndex((el) => el === id);

    usersCopy[userIdx].checked = !usersCopy[userIdx].checked;
    setUsers(usersCopy);

    if (checkedIdIdx > -1) {
      checkedIds.splice(checkedIdIdx);
    } else {
      checkedIds.push(id);
    }
    setChecked(checkedIds);
    console.log("Checked id's:", ...checkedIds);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        "https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json"
      ).then((data) => data.json());
      const formattedData = data
        .map((el: ContactInterface) => {
          return { ...el, checked: false };
        })
        .sort((a: ContactInterface, b: ContactInterface) => {
          const nameA = a.last_name;
          const nameB = b.last_name;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

      setUsers(formattedData);
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        maxWidth: "40rem",
        margin: "2rem auto",
        padding: "2rem",
      }}
    >
      <Input
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
        value={searchInput}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="start">
            <IconButton onClick={() => setSearchInput("")}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        }
      />
      <Stack sx={{ gap: "1rem" }}>
        {users
          .filter(
            (el) =>
              el.first_name
                .toLocaleLowerCase()
                .includes(searchInput.toLocaleLowerCase()) ||
              el.last_name
                .toLocaleLowerCase()
                .includes(searchInput.toLocaleLowerCase())
          )
          .map((el) => {
            return (
              <Contact
                user={el}
                key={el.id}
                onChecked={() => handleCheck(el.id)}
              />
            );
          })}
      </Stack>
    </Box>
  );
};

export default ContactsList;
