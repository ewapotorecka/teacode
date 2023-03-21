import { Box, IconButton, Input, InputAdornment, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import LazyLoad from "react-lazy-load";

import Contact, { ContactInterface } from "../Contact/Contact";

const ContactsList = () => {
  const [users, setUsers] = useState<ContactInterface[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const handleCheck = (id: number) => {
    const elementIdx = checked.findIndex((el) => el === id);

    if (elementIdx < 0) {
      const checkedElements = [...checked, id];
      setChecked(checkedElements);
      console.log("Checked id's:", ...checkedElements);
    } else {
      const checkedElements = [...checked].filter((el) => el !== id);

      setChecked(checkedElements);
      console.log("Checked id's:", ...checkedElements);
    }
  };

  const filterResults = (input: string, element: ContactInterface) => {
    return (
      element.first_name
        .toLocaleLowerCase()
        .includes(input.toLocaleLowerCase()) ||
      element.last_name
        .toLocaleLowerCase()
        .includes(input.toLocaleLowerCase()) ||
      `${element.first_name.toLocaleLowerCase()} ${element.last_name.toLocaleLowerCase()}`.includes(
        input.toLocaleLowerCase()
      ) ||
      `${element.last_name.toLocaleLowerCase()} ${element.first_name.toLocaleLowerCase()}`.includes(
        input.toLocaleLowerCase()
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json"
      );
      const data = await response.json();
      const formattedData = data.sort(
        (a: ContactInterface, b: ContactInterface) => {
          const nameA = a.last_name;
          const nameB = b.last_name;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      );

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
          .filter((el) => filterResults(searchInput, el))
          .map((el) => {
            return (
              <LazyLoad key={el.id}>
                <Contact
                  user={el}
                  onChecked={() => handleCheck(el.id)}
                  isChecked={checked.includes(el.id)}
                />
              </LazyLoad>
            );
          })}
      </Stack>
    </Box>
  );
};

export default ContactsList;
