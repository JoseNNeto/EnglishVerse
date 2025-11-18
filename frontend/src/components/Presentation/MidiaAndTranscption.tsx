
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useState } from 'react';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number; }) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

export default function MidiaAndTranscption() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

  return (
    <Box>
        <Typography variant="h4" sx={{ color: '#e0e0e0', mb: 1 }}>
            Etapa 1: Apresentação
        </Typography>
        <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 3 }}>
            Assista a cena com atenção. Focaremos em como os personagens usam o 'Simple Present'.
        </Typography>
        <Box sx={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
            borderRadius: '14px',
            overflow: 'hidden',
            mb: 3
        }}>
            <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/Vmb1tqYqyII"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0 }}
            ></iframe>
        </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Transcrição (Inglês)" sx={{color: value === 0 ? '#007aff' : '#b3b3b3', textTransform: 'none', fontSize: '16px'}}/>
          <Tab label="Tradução (Português)" sx={{color: value === 1 ? '#007aff' : '#b3b3b3', textTransform: 'none', fontSize: '16px'}}/>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Paper sx={{p: 3, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px'}}>
            Michael: Okay, so I am thrilled to announce that there <Typography component="span" sx={{color: '#007aff'}}>is</Typography> a new company policy. We <Typography component="span" sx={{color: '#007aff'}}>are</Typography> no longer going to be using the term "diversity." From now on, we <Typography component="span" sx={{color: '#007aff'}}>are</Typography> going to use "inclusion."
            <br/><br/>
            Jim: Aren't those the same thing?
            <br/><br/>
            Michael: You know what? They <Typography component="span" sx={{color: '#007aff'}}>are</Typography> not the same thing, and I think that it's important that we all understand the difference.
            <br/><br/>
            Pam: I don't understand the difference.
            <br/><br/>
            Michael: Well, diversity <Typography component="span" sx={{color: '#007aff'}}>is</Typography> just... it <Typography component="span" sx={{color: '#007aff'}}>is</Typography> having different types of people. But inclusion <Typography component="span" sx={{color: '#007aff'}}>means</Typography> that those people <Typography component="span" sx={{color: '#007aff'}}>are</Typography> included.
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Paper sx={{p: 3, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px'}}>
            Michael: Ok, então estou emocionado em anunciar que existe uma nova política da empresa. Não vamos mais usar o termo "diversidade". De agora em diante, vamos usar "inclusão".
            <br/><br/>
            Jim: Essas coisas não são a mesma coisa?
            <br/><br/>
            Michael: Sabe de uma coisa? Elas não são a mesma coisa, e acho importante que todos entendamos a diferença.
            <br/><br/>
            Pam: Eu não entendo a diferença.
            <br/><br/>
            Michael: Bem, diversidade é apenas... é ter diferentes tipos de pessoas. Mas inclusão significa que essas pessoas estão incluídas.
        </Paper>
      </TabPanel>
    </Box>
  );
}
