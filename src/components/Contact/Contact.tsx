import { Avatar, Box, Checkbox } from "@mui/material";

export interface ContactInterface {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  checked?: boolean;
}

const Contact = ({
  user,
  onChecked,
  isChecked,
}: {
  user: ContactInterface;
  onChecked: (id: number) => any;
  isChecked: boolean;
}) => {
  const { id, avatar, first_name, last_name } = user;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        cursor: "pointer",
        padding: "1rem",
        border: "2px solid #040f0f",
        borderRadius: "4px",
        color: "#040f0f",
        "&:hover": {
          background: "#F5F5F5",
        },
      }}
      onClick={() => onChecked(id)}
    >
      <Avatar src={avatar} alt={`${first_name} ${last_name}`} />
      <p>{`${first_name} ${last_name}`}</p>
      <Checkbox checked={isChecked} />
    </Box>
  );
};

export default Contact;
