import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { loginUser } from "@src/api/UserRoutes";
import { IUser } from "@src/interfaces/IUser";
import routes from "@src/router/Routes";
import * as React from "react";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";


export default function LoginPage() {

  useEffect(() => {
    document.title = routes.loginpage.name;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signIn: IUser = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    };
    const result = await loginUser(signIn);
    if (result != "") {
      toast.error(result, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    window.location.href = routes.frontpage.path;
  };

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  return (
    <ThemeProvider theme={createTheme({ palette: { mode: darkMode ? 'dark' : 'light' } })}>

      <Container component="main" maxWidth="xl" sx={{ marginTop: '60px', marginBottom: '60px' }}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar Sessão
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Palavra-Passe"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href={routes.resetpasswordpage.path} variant="body2">
                  Esqueceste da palavra-passe?
                </Link>
              </Grid>
              <Grid item>
                <Link href={routes.registerpage.path} variant="body2">
                  {"Ainda não tens conta? Regista-te"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
