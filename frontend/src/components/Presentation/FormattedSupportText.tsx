import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface FormattedSupportTextProps {
  children: string;
}

const BLUE_HIGHLIGHT_TARGET = '#englishverse-blue-highlight';

function convertBlueHighlights(value: string) {
  return value.replace(/==([^=\n]+)==/g, `[$1](${BLUE_HIGHLIGHT_TARGET})`);
}

export default function FormattedSupportText({ children }: FormattedSupportTextProps) {
  return (
    <Box sx={{
      color: 'inherit',
      lineHeight: 1.7,
      overflowWrap: 'anywhere',
      '& p': { mt: 0, mb: 1.25 },
      '& p:last-child': { mb: 0 },
      '& ul, & ol': { my: 1, pl: 3 },
      '& strong': { color: 'inherit', fontWeight: 900 },
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ href, children: linkChildren }) => (
            href === BLUE_HIGHLIGHT_TARGET
              ? (
                <Box component="span" sx={{ color: '#75c3ff', fontWeight: 900 }}>
                  {linkChildren}
                </Box>
              )
              : <a href={href}>{linkChildren}</a>
          ),
        }}
      >
        {convertBlueHighlights(children)}
      </ReactMarkdown>
    </Box>
  );
}
