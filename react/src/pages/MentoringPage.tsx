import { createMentoring, createMentoringRequest, getMentoringList, getMentoringRequestList } from "@src/api/MentoringRoutes"
import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import CheckIcon from '@mui/icons-material/Check';
import { IMentoringRequest } from "@src/interfaces/IMentoringRequest";
import { IMentoring } from "@src/interfaces/IMentoring";
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import { ICurricularUnit } from "@src/interfaces/ICurricularUnit";
import { getCurricularUnitsCourseUser } from "@src/api/CourseRoutes";
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';


export default function MentoringPage() {
  const defaultTheme = createTheme();
  const [mentoringRequestList, setMentoringRequestList] = useState<IMentoringRequest[]>([]);
  const [mentoringList, setMentoringList] = useState<IMentoring[]>([]);
  const [curricularUnitList, setCurricularUnitList] = useState<ICurricularUnit[]>([]);
  const [selectedCurricularUnit, setSelectedCurricularUnit] = useState<ICurricularUnit>();

  useEffect(() => {
    document.title = "Mentoring - NEI"
    getMentoringRequestList().then((response) => {
      setMentoringRequestList(response)
    }).catch(() => {
      toast.error("Ocorreu um erro ao aceder aos Pedidos de Mentoria! Por favor tenta novamente!", {
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
    });
    getMentoringList().then((response) => {
      setMentoringList(response)
    }).catch(() => {
      toast.error("Ocorreu um erro ao aceder às Mentorias! Por favor tenta novamente!", {
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
    });
    getCurricularUnitsCourseUser().then((response) => {
      setCurricularUnitList(response)
    }).catch(() => {
      toast.error("Ocorreu um erro ao aceder às Unidades Curriculares! Por favor tenta novamente!", {
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
    })
  }, []);

  const handleCreateMentoringRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCurricularUnit) {
      toast.error("Por favor seleciona uma Unidade Curricular!", {
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

    const newMentoringRequest: IMentoringRequest = {
      curricularUnit: selectedCurricularUnit
    }
    createMentoringRequest(newMentoringRequest).then(() => {
      toast.success("Pedido de Mentoria criado com sucesso! Fica a aguardar :))", {
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
    }).catch(() => {
      toast.error("Ocorreu um erro ao criar o pedido de mentoria! Por favor tenta novamente!", {
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
    });
  }

  const handleCreateMentoring = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newMentoring: IMentoring = {
      requestId: event.currentTarget.requestId.value
    }
    createMentoring(newMentoring).then(() => {
      toast.success("Mentoria aceite com sucesso! :))", {
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
      //TODO: Remove mentoring request from list
      getMentoringList().then((response) => {
        setMentoringList(response)
      })
    }).catch(() => {
      toast.error("Ocorreu um erro ao aceitar a mentoria! Por favor tenta novamente!", {
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
    });
  }

  const handleSelectCurricularUnit = (event: SelectChangeEvent) => {
    setSelectedCurricularUnit(
      curricularUnitList.filter((c) => c.abbreviation === event.target.value)[0]
    );
  };





  return (
    <ThemeProvider theme={defaultTheme}>
      <Container maxWidth="xl" sx={{ marginBottom: "60px" }}>
        <Typography variant="body1" align="center" gutterBottom sx={{ marginTop: "30px", marginBottom: "30px" }}>
          <InfoIcon sx={{marginRight: '5px', color: "#054496", marginBottom: "-3px"}}/>
          A tua privacidade é uma prioridade. 
          Por isso, não vais saber quem é a outra pessoa até aceitares a mentoria. 
          Depois, terão de combinar como falar, usando Discord, Teams, ou o que preferirem, para realizar a mentoria. 
          É simples e seguro, garantindo que escolhes com quem queres partilhar informações.
        </Typography>

        <Typography variant="h4" 
          sx={{ 
            color: "#1E2022",
            display: "flex",
            fontWeight: 700,
            flexDirection: "column",
            alignItems: "center",
            marginTop: "30px",
            marginBottom: "0px",
          }}
          >
          Criar Pedido de Mentoria
        </Typography>

        <Box
          component="form"
          onSubmit={handleCreateMentoringRequest} sx={{width: '70%', justifyContent: 'center', alignContent: 'center'}}
        >
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="curricular-unit-label">
              Curricular Unit
            </InputLabel>
            <Select
              labelId="curricular-unit-label"
              id="curricularUnit"
              label="Curricular Unit"
              value={selectedCurricularUnit?.abbreviation}
              onChange={handleSelectCurricularUnit}
            >
              {curricularUnitList.map((unit) => (
                <MenuItem
                  key={unit.abbreviation}
                  value={unit.abbreviation}
                >
                  {unit.abbreviation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            type="submit"
          >
            Criar
          </Button>
        </Box>

        <Typography variant="h4" 
          sx={{ 
            color: "#1E2022",
            display: "flex",
            fontWeight: 700,
            flexDirection: "column",
            alignItems: "center",
            marginTop: "30px",
            marginBottom: "15px",
          }}
          >
          Lista de Pedidos de Mentoria
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {mentoringRequestList.map((mentoringRequest) => (
            <Box
              key={mentoringRequest.id} // Adiciona a chave de identificação
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column', // Para colocar os elementos um em cima do outro
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Adiciona uma sombra
                padding: '20px', // Adiciona preenchimento para destacar a sombra
                borderRadius: '8px', // Adiciona bordas arredondadas para um visual mais suave
                width: '20%',
              }}
              component="form"
              onSubmit={handleCreateMentoring} // Passa o evento e o ID do pedido de mentoria
            >
              <TextField name="requestId" value={mentoringRequest.id} sx={{ display: "none" }} />
              <Typography variant="subtitle1" align="center" gutterBottom>
                {mentoringRequest.curricularUnit.name}
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} type="submit" color="success"><CheckIcon/></Button>
            </Box>
          ))}
        </Box>



        <Typography variant="h4" 
          sx={{ 
            color: "#1E2022",
            display: "flex",
            fontWeight: 700,
            flexDirection: "column",
            alignItems: "center",
            marginTop: "60px",
            marginBottom: "15px",
          }}
          >
          Lista de Mentorias
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {mentoringList.map((mentoring) => (
            <Box
             key={mentoring.id} // Adiciona a chave de identificação
             sx={{
               display: 'flex',
               justifyContent: 'center',
               alignContent: 'center',
               flexDirection: 'column',
               width: '20%',
               boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Adiciona uma sombra
               padding: '20px', // Adiciona preenchimento para destacar a sombra
               borderRadius: '8px', // Adiciona bordas arredondadas para um visual mais suave
             }}
           >

          <TextField name="requestId" value={mentoring.id} sx={{ display: "none" }} />
            <Typography variant="subtitle1" align="center" gutterBottom>
              {mentoring.curricularUnit?.name}: {mentoring.mentee?.profilemodel.discord}
            </Typography>
            
              <Button variant="contained" sx={{ mt: 2 }}><DoneAllIcon/></Button>
              <Button variant="outlined" sx={{ mt: 1 }} color="error"><CancelIcon/></Button>
            </Box>
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  )
}