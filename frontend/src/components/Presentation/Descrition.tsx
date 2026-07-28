import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useModule } from '../../contexts/ModuleContext';

export default function Descrition() {
  const { activeItem } = useModule();

  if (
    !activeItem
    || activeItem.type !== 'presentation'
    || !activeItem.data.blocos?.length
  ) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {activeItem.data.blocos.map((bloco, index) => {
        const isTitle = bloco.tipo === 'TITULO';
        const isSubtitle = bloco.tipo === 'SUBTITULO';
        const isHighlight = bloco.tipo === 'DESTAQUE';
        return (
          <Box
            key={bloco.id || index}
            sx={{
              backgroundColor: theme => {
                const background = (bloco.fundo || '#282828').toLowerCase();
                if (theme.palette.mode !== 'light') return bloco.fundo || '#282828';
                if (background === '#282828') return '#1B2A4A';
                if (background === '#1b2a4a') return '#404E7C';
                return bloco.fundo;
              },
              borderRadius: '14px',
              p: { xs: 2.5, md: 3 },
              borderLeft: isHighlight ? `5px solid ${bloco.cor || '#75c3ff'}` : undefined,
              color: bloco.cor || '#e0e0e0',
            }}
          >
            <Box sx={{
              color: 'inherit',
              fontSize: isTitle ? { xs: '2rem', md: '3rem' } : isSubtitle ? '1.65rem' : '1rem',
              fontWeight: isTitle || isSubtitle || isHighlight ? 700 : 400,
              fontStyle: isTitle || isSubtitle ? 'italic' : 'normal',
              lineHeight: isTitle ? 1.15 : 1.65,
              '& p': { m: 0, color: 'inherit' },
              '& strong, & em, & a': { color: 'inherit' },
              '& ul, & ol': { my: 1, pl: 4 },
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {bloco.texto || ''}
              </ReactMarkdown>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
