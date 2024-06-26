import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { changePassword } from '@src/api/UserRoutes';
import { isLoggedIn } from '@src/api/utils/LoginStatus';
import routes from '@src/router/Routes';
import * as React from 'react';
import { useEffect } from 'react';
import { Bounce, toast } from 'react-toastify';




export default function ChangePasswordPage() {

  useEffect(() => {
    document.title = routes.changepasswordpage.name;


    //verificar se o user está logado
    if (!isLoggedIn()) {
      window.location.href = routes.loginpage.path;
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const passwords = {
      oldPassword: event.currentTarget.oldPassword.value,
      newPassword: event.currentTarget.newPassword.value
    };
    changePassword(passwords).then(() => {
      window.location.href = routes.profilepage.path;
    }).catch(() => {
      toast.error(
        "Ocorreu um erro ao modificar a palavra-passe! Por favor tenta novamente!",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    });
  };

  const theme = createTheme({
    components: {
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgb(232, 241, 250)',
            '&:hover': {
              backgroundColor: 'rgb(232, 241, 250)',
              '@media (hover: none)': {
                backgroundColor: 'rgb(232, 241, 250)',
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'rgb(232, 241, 250)',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgb(232, 241, 250)',
            '&:hover': {
              backgroundColor: 'rgb(232, 241, 250)',
              '@media (hover: none)': {
                backgroundColor: 'rgb(232, 241, 250)',
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'rgb(232, 241, 250)',
            },
          },
        },
      },
    }
  });

  return (
    <>

      <Container component="main" maxWidth="xs" sx={{ marginTop: '60px', marginBottom: '60px' }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Alterar a Palavra Passe
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '70%' }}>
            <TextField
              margin="normal"
              required
              variant="filled"
              fullWidth
              name="oldPassword"
              label="Antiga Palavra Passe"
              type="password"
              id="oldPassword"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              variant="filled"
              label="Nova Palavra Passe"
              type="password"
              id="newPassword"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#054496", color: "#FFFFFF" }}
            >
              Alterar
            </Button>
            <Grid container>
              <Grid item>
                <Link href={routes.profilepage.path} variant="body2">
                  {"Queres voltar para trás? Perfil"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
