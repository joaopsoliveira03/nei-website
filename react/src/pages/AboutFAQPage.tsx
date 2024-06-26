import { GitHub, LinkedIn } from "@mui/icons-material";
import { Avatar, Box, Grid, Paper, Tab, Tabs, Typography, styled } from "@mui/material";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getFAQ } from "@src/api/AboutRoutes";
import AccordionUsage from "@src/components/aboutFAQ/Accordion";
import { IFAQ } from "@src/interfaces/IFAQ";
import routes from "@src/router/Routes";
import { SyntheticEvent, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";


interface TeamItem {
  photo: string;
  role: string;
  fullname: string;
  github: string;
  linkedin: string;
}
interface DirecaoItem {
  year: string;
  team: TeamItem[];
}
const direcao: DirecaoItem[] =
  [
    /* {
      year: "2024/2025",
      team: [
        { photo: "logo.png", role: "Presidente", fullname: "Hélder Branco", github: "", linkedin: "" },
      ],
    }, */
    {
      year: "2023/2024",
      team: [
        { photo: "2023-24/helder-branco.png", role: "Presidente", fullname: "Hélder Branco", github: "", linkedin: "https://www.linkedin.com/in/h%C3%A9lder-branco/" },
        { photo: "2023-24/daniel-teixeira.png", role: "Vice-Presidente", fullname: "Daniel Teixeira", github: "https://github.com/8200378", linkedin: "https://www.linkedin.com/in/daniel-fr-teixeira/" },
        { photo: "2023-24/emanuel-rego.png", role: "Vice-Presidente", fullname: "Emanuel Rego", github: "https://github.com/RegoJunior09", linkedin: "https://www.google.com/" },
        { photo: "2023-24/joao-oliveira.png", role: "Tesoureiro", fullname: "João Oliveira", github: "https://github.com/joaopsoliveira03", linkedin: "https://www.linkedin.com/in/joaopsoliveira03/" },
        { photo: "2023-24/helder-carneiro.png", role: "Secretário", fullname: "Hélder Carneiro", github: "https://github.com/zyeinn", linkedin: "https://www.linkedin.com/in/heldercarneir0/" },
        { photo: "2023-24/mariana-martins.png", role: "Vogal", fullname: "Mariana Martins", github: "", linkedin: "https://www.linkedin.com/in/mariana-silva-a757a3221/" },
        { photo: "2023-24/orlando-pires.png", role: "Vogal", fullname: "Orlando Pires", github: "https://github.com/duarte-pires", linkedin: "https://www.linkedin.com/in/duartespires/" },
        { photo: "2023-24/eduardo-dias.png", role: "Vogal", fullname: "Eduardo Dias", github: "", linkedin: "https://www.linkedin.com/in/eduardo-dias-287b1a260/" },
        { photo: "2023-24/guilherme-castro.png", role: "Vogal", fullname: "Guilherme Castro", github: "", linkedin: "https://www.linkedin.com/in/guilherme-castro-957002273/" },
      ]
    }
  ];


interface CourseItem {
  name: string;
  sigla: string;
  photo: string;
  URL: string;
}
interface CoursesItem {
  type: string;
  course: CourseItem[];
}
const courses: CoursesItem[] =
  [
    {
      type: "CTeSP",
      course: [
        { name: "CTeSP Desenvolvimento para a Web e Dispositivos Móveis", sigla: "DWDM", photo: "/logos/DWDM.png", URL: "https://www.estg.ipp.pt/cursos/ctesp/809" },
        { name: "CTeSP Cibersegurança, Redes e Sistemas Informáticos", sigla: "CRSI", photo: "/logos/CRSI.png", URL: "https://www.estg.ipp.pt/cursos/ctesp/810" },
        { name: "CTeSP Tecnologias de Dados e Visualização de Informação", sigla: "TDVI", photo: "/logos/TDVI.png", URL: "https://www.estg.ipp.pt/cursos/ctesp/840" },

      ]
    },

    {
      type: "Licenciatura",
      course: [
        { name: "Segurança Informática em Redes de Computadores", sigla: "LSIRC", photo: "/logos/LSIRC.png", URL: "https://www.estg.ipp.pt/cursos/licenciatura/557" },
        { name: "Engenharia Informática", sigla: "LEI", photo: "/logos/LEI.png", URL: "https://www.estg.ipp.pt/cursos/licenciatura/551" },
        { name: "Sistemas de Informação para a Gestão", sigla: "LSIG", photo: "/logos/LSIG.png", URL: "https://www.estg.ipp.pt/cursos/licenciatura/630" },
      ]
    },

    {
      type: "Mestrado",
      course: [
        { name: "Mestrado Engenharia Informática", sigla: "MEI", photo: "/logos/MEI.png", URL: "https://www.estg.ipp.pt/cursos/mestrado/807" },
      ]
    },
  ];


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface QaItem {
  question: string;
  answer: string;
}
interface FaqSection {
  section: string;
  qa: QaItem[];
}


const transformData = (originalData: IFAQ[]): FaqSection[] => {
  const transformedData: FaqSection[] = [];

  originalData.forEach((qa) => {
    const sectionName = qa.category.name;
    const existingSection = transformedData.find((section) => section.section === sectionName);

    const transformedQA: QaItem = {
      question: qa.question,
      answer: qa.answer
    };

    if (existingSection) {
      existingSection.qa.push(transformedQA);
    } else {
      transformedData.push({
        section: sectionName,
        qa: [transformedQA]
      });
    }
  });

  return transformedData;
};

export default function AboutFAQPage() {

  const [valueDirecao, setValueDirecao] = useState(0);

  const handleChangeDirecao = (event: SyntheticEvent, newValue: number) => {
    setValueDirecao(newValue);
  };

  const [valueCourse, setValueCourse] = useState(0);

  const handleChangeCourse = (event: SyntheticEvent, newValue: number) => {
    setValueCourse(newValue);
  };

  const [hoveredIcons, setHoveredIcons] = useState({});

  const [faq, setFaq] = useState<FaqSection[]>([]);

  useEffect(() => {
    document.title = routes.aboutFAQpage.name;
    getFAQ().then((result) => {
      const faq: FaqSection[] = transformData(result);
      setFaq(faq);
    }).catch(() => {
      toast.error("Ocorreu um erro ao aceder às FAQs! Por favor tenta novamente!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme:"light",
        transition: Bounce,
      });
    });
  }, [])

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container maxWidth="xl" sx={{ marginBottom: '60px' }}>

        {/*About Us*/}
        <Typography variant="h4"
          sx={{
            color: '#1E2022',
            display: 'flex',
            fontWeight: 700,
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '30px',
            marginBottom: '15px',
          }}
        >Sobre Nós</Typography>

        {/*Quem somos*/}
        <Typography variant="subtitle1"
          sx={{
            color: "#969696",
            display: 'flex',
            fontWeight: 600,
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >Quem somos</Typography>

        {/*Texto de apresentacao*/}
        <Container maxWidth="lg">
          <Typography variant="h6"
            sx={{
              color: "#1E2022" ,
              display: 'flex',
              fontWeight: 500,
              flexDirection: 'column',
              alignItems: 'left',
              marginBottom: '15px',

              '@media (max-width: 600px)': {
                fontSize: '1rem',  // Tamanho menor para xs
              },
              '@media (min-width: 600px) and (max-width: 960px)': {
                fontSize: '1.2rem',  // Tamanho maior que xs, menor que md (sm)
              },
              '@media (min-width: 960px)': {
                fontSize: '1.4rem',  // Tamanho md (h6)
              },
            }}
          >Somos o Núcleo de Estudantes de Informática da ESTG - IPP, e a nossa história é daquelas que começam com um grupo de amigos cheios de vontade de fazer acontecer. Juntámos as nossas paixões pela tecnologia e decidimos criar algo à maneira.
          </Typography>


          <Typography variant="h6"
            sx={{
              color: "#1E2022" ,
              display: 'flex',
              fontWeight: 500,
              flexDirection: 'column',
              alignItems: 'left',
              marginBottom: '15px',

              '@media (max-width: 600px)': {
                fontSize: '1rem',  // Tamanho menor para xs
              },
              '@media (min-width: 600px) and (max-width: 960px)': {
                fontSize: '1.2rem',  // Tamanho maior que xs, menor que md (sm)
              },
              '@media (min-width: 960px)': {
                fontSize: '1.4rem',  // Tamanho md (h6)
              },
            }}
          >No nosso Discord, estamos a bombar nos cursos de Informática da nossa universidade. É como um ponto de encontro para quem quer elevar os conhecimentos e fazer parte de uma comunidade que se apoia. Seja para trocar ideias, pedir dicas de programação ou só para descontrair, estamos sempre na boa.</Typography>


          <Typography variant="h6"
            sx={{
              color: "#1E2022" ,
              display: 'flex',
              fontWeight: 500,
              flexDirection: 'column',
              alignItems: 'left',
              marginBottom: '60px',

              '@media (max-width: 600px)': {
                fontSize: '1rem',  // Tamanho menor para xs
              },
              '@media (min-width: 600px) and (max-width: 960px)': {
                fontSize: '1.2rem',  // Tamanho maior que xs, menor que md (sm)
              },
              '@media (min-width: 960px)': {
                fontSize: '1.4rem',  // Tamanho md (h6)
              },
            }}
          >Por isso, se estiveres interessado em explorar o universo da Informática na ESTG - IPP, junta-te a nós nesta aventura!! 🚀💻</Typography>
        </Container>

        {/*Direcao*/}
        <Typography variant="subtitle1"
          sx={{
            color: "#969696" ,
            display: 'flex',
            fontWeight: 600,
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >Direção</Typography>

        {/*Tabs Direcao*/}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Tabs
            value={valueDirecao}
            onChange={handleChangeDirecao}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example">

            {direcao.map((member, index) => (
              <Tab label={member.year} key={index} sx={{color: "#969696"}}/>
            ))}
          </Tabs>
        </Box>

        {/* Conteudo de cada tab (cada ano) */}
        {direcao.map((member, index) => (
          <div key={index} style={{ display: valueDirecao === index ? 'block' : 'none' }}>
            <Grid container spacing={1}>

              {member.team.map((teamMember, teamIndex) => (
                <Grid item xs={12} sm={4} md={3} lg={2} xl={1} key={teamIndex} display="flex" alignItems="center" sx={{marginBottom: '1px', [defaultTheme.breakpoints.up('xl')]: { marginRight: '41px', }, }}>
                  <Grid container direction="column" display="flex" alignItems="center" >
                    <Item sx={{backgroundColor: "#FFFFFF",}}>
                      <Avatar src={teamMember.photo} sx={{ width: '115px', height: '128px', marginBottom: '10px' }} variant="rounded" />

                      <Typography variant="subtitle1" color="primary">{teamMember.role}</Typography>
                      <Typography variant="subtitle2" sx={{color: "#969696"}}>{teamMember.fullname}</Typography>

                      {teamMember.github && (
                        <GitHub
                          sx={{ color: hoveredIcons[`github-${teamIndex}`] ? '#054496' : '#969696', fontSize: 30, cursor: 'pointer', marginTop: '5px' }}
                          onClick={() => window.open(teamMember.github, '_blank')}
                          onMouseEnter={() => setHoveredIcons(prevState => ({ ...prevState, [`github-${teamIndex}`]: true }))}
                          onMouseLeave={() => setHoveredIcons(prevState => ({ ...prevState, [`github-${teamIndex}`]: false }))}
                        />
                      )}

                      {teamMember.linkedin && (
                        <LinkedIn
                          sx={{ color: hoveredIcons[`linkedin-${teamIndex}`] ? '#054496' : '#969696', fontSize: 30, cursor: 'pointer', marginTop: '5px' }}
                          onClick={() => window.open(teamMember.linkedin, '_blank')}
                          onMouseEnter={() => setHoveredIcons(prevState => ({ ...prevState, [`linkedin-${teamIndex}`]: true }))}
                          onMouseLeave={() => setHoveredIcons(prevState => ({ ...prevState, [`linkedin-${teamIndex}`]: false }))}
                        />
                      )}

                    </Item>
                  </Grid>
                </Grid>
              ))}

            </Grid>
          </div>
        ))}



        {/*Cursos*/}
        <Typography variant="subtitle1"
          sx={{
            color: '#969696',
            display: 'flex',
            fontWeight: 600,
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '60px',
          }}
        >Cursos representados pelo NEI</Typography>

        {/*Tabs Cursos*/}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Tabs
            value={valueCourse}
            onChange={handleChangeCourse}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example">

            {courses.map((course, index) => (
              <Tab label={course.type} key={index} sx={{color: "#969696"}}/>
            ))}
          </Tabs>
        </Box>

        {/* Conteudo de cada curso */}
        {courses.map((courses, index) => (
          <div key={index} style={{ display: valueCourse === index ? 'block' : 'none' }}>
            <Grid container spacing={1} justifyContent="center">

              {courses.course.map((course, courseIndex) => (
                <Grid item xs={12} sm={4} md={3} lg={2} xl={1} key={courseIndex} display="flex" sx={{ marginBottom: '1px', [defaultTheme.breakpoints.up('xl')]: { marginRight: '41px', }, }}>
                  <Grid container direction="column" display="flex">
                    <Item onClick={() => window.open(course.URL, '_blank')} style={{ cursor: 'pointer', textAlign: 'center' }} sx={{backgroundColor: "#FFFFFF",}}>
                      <Avatar src={course.photo} sx={{ width: '115px', height: 'auto', objectFit: 'cover', marginBottom: '10px', display: 'block', margin: '0 auto' }} variant="rounded" />
                      <Typography variant="subtitle1" color="primary">{course.sigla}</Typography>
                      <Typography variant="subtitle2" sx={{color: "#969696"}}>{course.name}</Typography>
                    </Item>
                  </Grid>
                </Grid>
              ))}

            </Grid>
          </div>
        ))}


        {/*F.A.Q.*/}
        {faq.length > 0 && (
          <div>
            <Typography variant="h4"
              sx={{
                color: "#1E2022" ,
                display: 'flex',
                fontWeight: 700,
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '60px',
                marginBottom: '15px',
              }}
            >Tens alguma questão?</Typography>

            <Typography variant="h6"
              sx={{
                color: "#969696" ,
                display: 'flex',
                fontWeight: 600,
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >Pesquisa no nosso F.A.Q. para obteres as respostas para qualquer coisa que possas perguntar.</Typography>

            {/* QA */}
            {faq.map((faq, index) => (
              <div key={index}>
                <Typography variant="h5"
                  sx={{
                    color: "#1E2022" ,
                    display: 'flex',
                    fontWeight: 700,
                    flexDirection: 'column',
                    alignItems: 'left',
                    marginTop: '55px',
                    marginBottom: '10px',
                  }}>{faq.section}</Typography>

                {faq.qa.map((qa, qaIndex) => (
                  <AccordionUsage key={qaIndex} question={qa.question} answer={qa.answer} />
                ))}
              </div>
            ))}
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}