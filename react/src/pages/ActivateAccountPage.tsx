import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography, createTheme } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { activateAccount, getActivateAccountCode } from "@src/api/UserRoutes";
import routes from "@src/router/Routes";
import { toast, Bounce } from "react-toastify";
import { useEffect, useState } from "react";





export default function ActivateAccountPage() {
  const [clickGetCode, setClickGetCode] = useState(false);


  useEffect(() => {
    document.title = routes.activateaccountpage.name;
  }, []);

  const handleGetCode = async () => {
    const username = document.getElementById('username') as HTMLInputElement;
    if (username.value === "") {
      return;
    }
    getActivateAccountCode(username.value).then(() => {
      setClickGetCode(true);

      toast.success("Se o teu username existir, receberás um código!!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }).catch(() => {
      setClickGetCode(false);

      toast.error("Ocorreu um erro interno ao enviar o código! Por favor tenta novamente!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      username: event.currentTarget.username.value,
      code: event.currentTarget.resetCode.value,
    };

    activateAccount(data).then(() => {
      toast.success("Se os dados corresponderem, a tua conta será ativada!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }).catch(() => {
      toast.error("Ocorreu um erro interno ao alterar ao ativar a conta! Por favor tenta novamente!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
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
            Ativar Conta
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '70%' }}>
            {!clickGetCode &&
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  variant="filled"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, marginTop: '0px' }}
                  onClick={handleGetCode}
                >
                  Enviar Código
                </Button>
              </>
            }

            <TextField
              margin="normal"
              required
              fullWidth
              variant="filled"
              name="resetCode"
              label="Código"
              type="password"
              id="resetCode"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, marginTop: '0px', marginBottom: '20px' }}
            >
              Ativar
            </Button>
            <Grid container>
              <Grid item>
                <Link href={routes.loginpage.path} variant="body2">
                  {"Queres voltar para a tua sessão? Inicia Sessão"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}