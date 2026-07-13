import { Box } from '@mui/material';
import { useModule } from '../../contexts/ModuleContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const isNumberedInlineExplanationLine = (line: string) => /^\d+\.\s+.+:/.test(line.trim());

const startsNewBlock = (line: string) => {
    const trimmed = line.trim();

    if (!trimmed) {
        return false;
    }

    if (isNumberedInlineExplanationLine(line)) {
        return false;
    }

    return (
        /^#{1,6}\s+/.test(trimmed) ||
        /^\d+\.\s+\S/.test(trimmed) ||
        /^conex[aã]o com/i.test(trimmed)
    );
};

const isGoldenRuleLine = (line: string) => /regra de ouro/i.test(line);
const isTipLine = (line: string) => /\bdica\b/i.test(line);
const normalizeBlockLine = (line: string) => line
    .trim()
    .replace(/^#{1,6}\s*/, '')
    .replace(/\*/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
const isMediaConnectionLine = (line: string) => normalizeBlockLine(line).startsWith('conexao com');
const isMediaConnectionBlock = (lines: string[]) => (
    lines.some(item => isMediaConnectionLine(item))
);
const isStartingPointLine = (line: string) => /^o ponto de partida/i.test(line.trim());
const isRuleActionLine = (line: string) => /^aqui vemos a regra/i.test(line.trim());
const isItIsRuleLine = (line: string) => /^o\s+\**is\**\s+é usado/i.test(line.trim().replace(/\*/g, ''));
const isTableHeaderLine = (line: string) => {
    const normalizedLine = line.trim().replace(/^\|?\s*/, '').toLowerCase();

    return normalizedLine.startsWith('sujeito') || (
        normalizedLine.includes('sujeito') &&
        normalizedLine.includes('verbo') &&
        normalizedLine.includes('exemplo')
    );
};
const isToBeRuleBlock = (lines: string[]) => (
    lines.some(item => /o verbo to be/i.test(item) && /regra de tr[eê]s/i.test(item))
);
const isNumberedSectionBlock = (lines: string[]) => {
    const firstContentLine = lines.find(item => item.trim());

    if (!firstContentLine) {
        return false;
    }

    return /^#{1,6}\s*\d+\.\s+\S/.test(firstContentLine.trim()) || /^\d+\.\s+\S/.test(firstContentLine.trim());
};
const isArticlesIntroBlock = (lines: string[]) => (
    lines.some(item => /definindo identidades/i.test(item)) ||
    lines.some(item => /os\s+\**articles\**\s+s[ãa]o/i.test(item.trim().replace(/\*/g, '').toLowerCase()))
);
const isPresentSimpleIntroBlock = (lines: string[]) => (
    lines.some(item => normalizeBlockLine(item).startsWith('o present simple')) ||
    lines.some(item => normalizeBlockLine(item).includes('stative verbs'))
);
const isHeSheItRuleBlock = (lines: string[]) => (
    lines.some(item => normalizeBlockLine(item).startsWith('a regra para he, she, it'))
);
const isMediaTriviaLine = (line: string) => {
    const trimmed = line.trim();
    const normalizedLine = trimmed
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\*/g, '')
        .toLowerCase();

    return (
        /^[🎸🎹]/.test(trimmed) ||
        /é uma canção dos beatles/i.test(trimmed) ||
        /é a canção mais famosa da carreira solo de john lennon/i.test(trimmed) ||
        (
            normalizedLine.includes('imagine') &&
            normalizedLine.includes('john lennon') &&
            normalizedLine.includes('cancao')
        )
    );
};
const cleanGoldenRuleLine = (line: string) => {
    let cleanedLine = line
        .replace(/^\s*[*\-]\s*/, '')
        .trim();

    const lowerLine = cleanedLine.toLowerCase();
    const titleIndex = lowerLine.includes('regra de ouro')
        ? lowerLine.indexOf('regra de ouro')
        : lowerLine.indexOf('dica');

    if (titleIndex >= 0) {
        cleanedLine = cleanedLine.slice(titleIndex);
    }

    const [title, ...bodyParts] = cleanedLine.split(':');
    const cleanTitle = title.replace(/\*/g, '').trim();
    const body = bodyParts.join(':').replace(/\*/g, '').trim();

    return `💡 **${cleanTitle}:**${body ? `\n\n${body}` : ''}`;
};

const splitIntoBlocks = (markdown: string) => {
    const lines = markdown.split(/\r?\n/);
    const blocks: string[] = [];
    const pendingGoldenRules: string[] = [];
    const pendingTips: string[] = [];
    let goldenBlock: string[] = [];
    let current: string[] = [];

    const flushCurrent = () => {
        if (current.some(item => item.trim())) {
            blocks.push(current.join('\n').trim());
        }

        current = [];
    };

    const flushGoldenRules = () => {
        if (pendingGoldenRules.length > 0) {
            blocks.push(pendingGoldenRules.join('\n\n').trim());
            pendingGoldenRules.length = 0;
        }
    };

    const flushGoldenBlock = () => {
        if (goldenBlock.some(item => item.trim())) {
            blocks.push(goldenBlock.join('\n').trim());
        }

        goldenBlock = [];
    };

    const flushTips = () => {
        if (pendingTips.length > 0) {
            blocks.push(pendingTips.join('\n\n').trim());
            pendingTips.length = 0;
        }
    };

    lines.forEach((line) => {
        if (goldenBlock.length > 0) {
            const startsNextBlock = (
                isGoldenRuleLine(line) ||
                isTipLine(line) ||
                isMediaConnectionLine(line) ||
                isStartingPointLine(line) ||
                startsNewBlock(line)
            );

            if (!line.trim() || !startsNextBlock) {
                goldenBlock.push(line);
                return;
            }

            flushGoldenBlock();
        }

        if (isGoldenRuleLine(line)) {
            if (current.some(item => isNumberedInlineExplanationLine(item))) {
                pendingGoldenRules.push(cleanGoldenRuleLine(line));
                return;
            }

            flushCurrent();
            flushTips();
            goldenBlock = [cleanGoldenRuleLine(line)];
            return;
        }

        const currentStartsWithHeading = current.some(item => /^#{1,6}\s+/.test(item.trim()));
        const currentHasBody = current.some(item => item.trim() && !/^#{1,6}\s+/.test(item.trim()));
        const previousLineIsBlank = current.length > 0 && !current[current.length - 1].trim();
        const keepCurrentBlockTogether = (
            isToBeRuleBlock(current) ||
            isNumberedSectionBlock(current) ||
            isArticlesIntroBlock(current) ||
            isPresentSimpleIntroBlock(current) ||
            isHeSheItRuleBlock(current)
        );

        if (currentStartsWithHeading && currentHasBody && previousLineIsBlank && line.trim() && !isTableHeaderLine(line) && !isMediaConnectionLine(line) && !keepCurrentBlockTogether) {
            flushCurrent();
            current = [line];
            return;
        }

        if (isTipLine(line)) {
            pendingTips.push(cleanGoldenRuleLine(line));
            return;
        }

        if (isMediaTriviaLine(line)) {
            if (isMediaConnectionBlock(current)) {
                current.push(line);
                return;
            }

            flushCurrent();
            flushGoldenBlock();
            flushGoldenRules();
            flushTips();
            current = [`Conexão com a Mídia`, line];
            return;
        }

        if (isRuleActionLine(line) && current.some(item => /^#{1,6}\s+/.test(item.trim()))) {
            flushCurrent();
            current = [line];
            return;
        }

        if (isItIsRuleLine(line) && current.some(item => item.trim())) {
            flushCurrent();
            current = [line];
            return;
        }

        if (isStartingPointLine(line) && current.some(item => item.trim())) {
            flushCurrent();
            current = [line];
            return;
        }

        if (isNumberedInlineExplanationLine(line) && current.some(item => /^#{1,6}\s+/.test(item.trim()))) {
            flushCurrent();
            current = [line];
            return;
        }

        if (isMediaConnectionLine(line) && current.some(item => item.trim())) {
            flushGoldenRules();
            flushTips();
            if (current[current.length - 1]?.trim()) {
                current.push('');
            }
            return;
        }

        if (startsNewBlock(line) && current.some(item => item.trim())) {
            flushCurrent();
            flushGoldenRules();
            flushTips();
            current = [line];
            return;
        }

        current.push(line);
    });

    flushCurrent();
    flushGoldenBlock();
    flushGoldenRules();
    flushTips();

    return blocks.length > 0 ? blocks : [markdown];
};

const getBlockParts = (block: string) => {
    const lines = block.split(/\r?\n/);
    const firstContentIndex = lines.findIndex(line => line.trim());

    if (firstContentIndex < 0) {
        return { title: '', body: block };
    }

    const firstLine = lines[firstContentIndex];

    if (isMediaTriviaLine(firstLine)) {
        return { title: 'Conexão com a Mídia', body: block };
    }

    if (!startsNewBlock(firstLine)) {
        return { title: '', body: block };
    }

    const bodyLines = [
        ...lines.slice(0, firstContentIndex),
        ...lines.slice(firstContentIndex + 1),
    ];

    return {
        title: firstLine,
        body: bodyLines.join('\n').trim(),
    };
};

export default function Descrition() {
    const { activeItem } = useModule();

    if (!activeItem) {
        return null;
    }

    let description = '';

    switch(activeItem.type) {
        case 'presentation':
            // For presentations, show the transcription as requested
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            description = (activeItem.data as any).transcricao || 'Nenhuma transcrição disponível.';
            break;
        default:
            return null; // Don't render for unknown types
    }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {splitIntoBlocks(description).map((block, index) => {
        const { title, body } = getBlockParts(block);
        const titleColor = index === 0 ? '#75c3ff' : '#e0e0e0';
        const isMediaTitle = title.trim().toLowerCase() === 'conexão com a mídia';

        return (
          <Box
            key={`${index}-${block.slice(0, 24)}`}
            sx={{
              backgroundColor: '#282828',
              borderRadius: '14px',
              p: 3,
              color: '#e0e0e0',
              '& h1, & h2, & h3': {
                fontStyle: 'italic',
                mt: 0,
              },
              '& h1': { fontSize: '3rem', color: index === 0 ? '#75c3ff' : '#e0e0e0' },
              '& h2': { fontSize: '1.55rem', color: '#e0e0e0' },
              '& h3': { fontSize: '1.25rem', color: '#e0e0e0' },
              '& p, & li': {
                color: '#e0e0e0',
                fontSize: '1rem',
                lineHeight: 1.65,
              },
              '& p': {
                my: 1.25,
              },
              '& p:has(strong:first-child)': {
                mt: 2.5,
              },
              '& strong': {
                color: '#e0e0e0',
                fontWeight: 700,
              },
              '& em': {
                color: 'inherit',
                fontStyle: 'italic',
              },
              '& a, & mark': {
                color: 'inherit',
              },
              '& ul, & ol': {
                pl: 4,
                my: 1,
              },
              '& table': {
                borderCollapse: 'separate',
                borderSpacing: '0 10px',
                my: 2,
              },
              '& th, & td': {
                pr: 6,
                textAlign: 'left',
                verticalAlign: 'top',
                color: '#e0e0e0',
                fontSize: '1rem',
                lineHeight: 1.6,
              },
              '& th': {
                fontWeight: 700,
              },
            }}
          >
            {title && (
              <Box
                sx={{
                  color: titleColor,
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: isMediaTitle ? '1.65rem' : '1.25rem',
                  mb: body ? 2 : 0,
                  '& p': {
                    color: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 1.35,
                    m: 0,
                  },
                  '& h1, & h2, & h3': {
                    color: 'inherit',
                    fontSize: index === 0 ? '3rem' : isMediaTitle ? '1.65rem' : '1.25rem',
                    lineHeight: 1.2,
                    m: 0,
                  },
                  '& strong, & em': {
                    color: 'inherit',
                  },
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{title}</ReactMarkdown>
              </Box>
            )}
            {body && <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{body}</ReactMarkdown>}
          </Box>
        );
      })}
    </Box>
  );
}
