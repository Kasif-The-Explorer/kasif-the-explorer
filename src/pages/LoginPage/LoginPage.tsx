import { ActionIcon, Text, Title, Input, Button } from "@mantine/core";
import { style } from "./style";
import { QuestionMark } from "tabler-icons-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const { classes } = style();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/");
  }, []);

  return (
    <div className={classes.loginWrapper}>
      <div className={classes.hero}>
        <Text className={classes.attribution} size="sm">
          Vectors by Vecteezy
        </Text>
      </div>
      <div className={classes.formWrapper}>
        <Title
          style={{ fontSize: 46 }}
          order={1}
        >
          Enter Your <br />
          Credentials
        </Title>
        <Text color="blue" size="sm" sx={{ lineHeight: "22px" }}>
          Kâşif needs to know your credentials to allow you to see this route becuase it is
          protected. Learn more about protected routes.
          <ActionIcon
            color="blue"
            variant="hover"
            ml="xs"
            size="sm"
            sx={{ display: "inline", "& > svg": { marginBottom: -4 } }}
          >
            <QuestionMark size={16} />
          </ActionIcon>
        </Text>
        <div className={classes.form}>
          <Input variant="filled" placeholder="Username" />
          <Input type="password" variant="filled" placeholder="Password" />
          <Button onClick={handleClick} variant="light">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
