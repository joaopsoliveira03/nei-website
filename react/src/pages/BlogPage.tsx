import { Avatar, Container, Grid, Paper, ThemeProvider, Typography, createTheme, styled, useMediaQuery } from "@mui/material";
import { getBlogList } from "@src/api/BlogRoutes";
import { IBlogPost } from "@src/interfaces/IBlogPost";
import { ICourse } from "@src/interfaces/ICourse";
import routes from "@src/router/Routes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";


export default function BlogPage() {

  const defaultTheme = createTheme();

  const isXs = useMediaQuery(defaultTheme.breakpoints.only('xs'));
  const isSm = useMediaQuery(defaultTheme.breakpoints.only('sm'));
  const isMd = useMediaQuery(defaultTheme.breakpoints.only('md'));
  const isLg = useMediaQuery(defaultTheme.breakpoints.only('lg'));
  const isXl = useMediaQuery(defaultTheme.breakpoints.only('xl'));

  const [blogList, setBlogList] = useState<IBlogPost[]>([]);

  const navigate = useNavigate(); // Hook para navegar

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    document.title = routes.blogpage.name;
    getBlogList().then((response) => {
      setBlogList(response)
    }).catch(() => {
      toast.error("Ocorreu um erro ao aceder ao Blog! Por favor tenta novamente!", {
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
  }, [])

  /** limitar palavras do titulo
   * 
   * @param title titulo
   */
  function limitTitle(title: string): string {
    let wordLimit;

    if (isXl) {
      wordLimit = 6;
    }
    else if (isLg) {
      wordLimit = 4;
    }
    else if (isMd) {
      wordLimit = 3;
    }
    else if (isSm) {
      wordLimit = 3;
    }

    return limitWords(title, wordLimit || 3);
  }

  /** limitar palavras da descrição
   * 
   * @param description descricao
   */
  function limitDescription(description: string): string {
    let wordLimit;

    if (isXl) {
      wordLimit = 9;
    }
    else if (isLg) {
      wordLimit = 7;
    }
    else if (isMd) {
      wordLimit = 5;
    }
    else if (isSm) {
      wordLimit = 5;
    }

    return limitWords(description, wordLimit || 5);
  }


  /** truncar com base no limite de palavras
   * 
   * @param sentence frase
   * @param limit limite de palavras
   * @returns descricao
   */
  function limitWords(sentence: string, limit: number): string {
    const words = sentence.split(' '); // Divide a descrição em palavras

    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...'; // Retorna as primeiras 'limit' palavras
    }


    return sentence; // Retorna a descrição completa se estiver dentro do limite
  }



  return (
    <ThemeProvider theme={defaultTheme}>
    {blogList.length === 0 ? (
      <Container maxWidth="xl" sx={{ marginTop: '30px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Typography variant="h5" color="#1E2022" fontWeight="700" align="center">
        Não há posts disponíveis no momento.
      </Typography>
    </Container>
    ) : (
      <Container maxWidth="xl" sx={{ marginTop: '30px', marginBottom: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={1}>
          {blogList.map((blogItem, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={4} xl={4} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/blog/post/${blogItem.slug}`)}>
              <Grid container direction="column">
                <Item sx={{backgroundColor: "#FFFFFF",}}>
                  {/* Usando um div para o avatar com imagem de fundo */}
                  <div style={{
                    width: '100%',
                    height: '265px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    backgroundPosition: 'top',
                    backgroundSize: 'cover',
                    backgroundImage: `url(${blogItem.images[0].image})`
                  }} />

                  {/*categorias e data*/}
                  <Grid container sx={{ marginBottom: '10px' }}>
                    <Grid item>
                      <Grid container direction="row">
                        {/*categorias*/}
                        {blogItem.topics.map((blogItemTopic) => (
                          <Typography variant="subtitle2" color="#636F80" sx={{ marginRight: '5px' }}>{blogItemTopic.name}</Typography>
                        ))}

                        <Typography variant="subtitle2" color="#969696" sx={{ marginLeft: '5px', marginRight: '10px' }}>•</Typography>
                        <Typography variant="subtitle2" color="#969696">{new Date(blogItem.date).toLocaleDateString('PT')}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Typography variant="h5" color="#002454" sx={{ marginBottom: '10px', textAlign: 'start' }}>{limitTitle(blogItem.title)}</Typography>
                  <Typography variant="subtitle2" color="#969696" sx={{ textAlign: 'start' }}>{limitDescription(blogItem.description)}</Typography>

                  {/*nome autor e curso*/}
                  <Grid container sx={{ marginTop: '20px' }}>
                    <Grid item>
                      <Grid container direction="row">
                        <Avatar src={blogItem.author.profilemodel?.image} sx={{ alignSelf: "center" }} />

                        <div>
                          <Typography variant="subtitle2" color="#636F80" sx={{ marginLeft: '10px', textAlign: 'start' }}>{blogItem.author.first_name} {blogItem.author.last_name}</Typography>
                          <Typography variant="subtitle2" color="#969696" sx={{ marginLeft: '10px', textAlign: 'start' }}>{blogItem.author.profilemodel?.course?.map((course: ICourse) => course.abbreviation).join(", ")}</Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Item>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
    }
  </ThemeProvider>
  )
}