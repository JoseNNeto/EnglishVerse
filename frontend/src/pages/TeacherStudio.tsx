import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, Dispatch, ReactElement, ReactNode, SetStateAction } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatColorTextRoundedIcon from '@mui/icons-material/FormatColorTextRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { appPalette } from '../theme/palette';
import FormattedSupportText from '../components/Presentation/FormattedSupportText';

type Section = 'overview' | 'modules' | 'reviews';
type ContentStep = 'APRESENTACAO' | 'PRATICA' | 'PRODUCTION';

interface DashboardData {
  resumo: { turmas: number; alunos: number; modulos: number; pendentes: number };
  turmas: ClassSummary[];
  modulos: ModuleSummary[];
  conteudos: ActivitySummary[];
  submissoes: SubmissionSummary[];
}

interface ClassSummary {
  id: number;
  nome: string;
  periodo: string;
  idioma: 'PORTUGUES' | 'INGLES';
  alunos: number;
  modulos: number;
}

interface ModuleSummary {
  id: number;
  turmaId: number | null;
  turma: string;
  titulo: string;
  descricao: string;
  imagemCapaUrl?: string;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  publicado: boolean;
  apresentacoes: number;
  praticas: number;
  productions: number;
  editavel: boolean;
  biblioteca: boolean;
}

interface SubmissionSummary {
  id: number;
  alunoId: number;
  aluno: string;
  turma: string;
  modulo: string;
  atividade: string;
  tipo: string;
  status: 'PENDENTE' | 'APROVADA' | 'AJUSTES_SOLICITADOS';
  resposta: Record<string, unknown>;
  feedback?: string;
  nota?: number;
  enviadaEm: string;
}

interface ActivitySummary {
  id: number;
  moduloId: number;
  etapa: ContentStep;
  tipo: string;
  classificacao?: string;
  instrucao?: string;
  midiaUrl?: string;
  transcricao?: string;
  ordem?: number;
  dados: Record<string, unknown>;
}

interface ContentFormState {
  moduloId: string;
  etapa: ContentStep;
  tipo: string;
  classificacao: string;
  instrucao: string;
  midiaUrl: string;
  transcricao: string;
  enunciado: string;
  itens: string;
  resposta: string;
  blocos: PresentationBlock[];
}

type PresentationBlockType = 'TITULO' | 'SUBTITULO' | 'TEXTO' | 'DESTAQUE';

interface PresentationBlock {
  id: string;
  tipo: PresentationBlockType;
  texto: string;
  cor: string;
  fundo: string;
}

interface UploadedFileInfo {
  fileName: string;
  fileDownloadUri: string;
  size?: string;
}

const emptyDashboard: DashboardData = {
  resumo: { turmas: 0, alunos: 0, modulos: 0, pendentes: 0 },
  turmas: [],
  modulos: [],
  conteudos: [],
  submissoes: [],
};

const contentTypes: Record<ContentStep, { value: string; label: string }[]> = {
  APRESENTACAO: [
    { value: 'VIDEO', label: 'Vídeo / YouTube' },
    { value: 'AUDIO', label: 'Áudio ou música' },
    { value: 'IMAGEM', label: 'Imagem, quadrinho ou tirinha' },
    { value: 'TEXTO', label: 'Texto de apoio' },
  ],
  PRATICA: [
    { value: 'MULTIPLA_ESCOLHA', label: 'Marcar uma opção' },
    { value: 'PREENCHER_LACUNA', label: 'Completar lacuna' },
    { value: 'LISTA_PALAVRAS', label: 'Escrever uma lista' },
    { value: 'SELECIONAR_PALAVRAS', label: 'Selecionar palavras' },
    { value: 'RELACIONAR_COLUNAS', label: 'Interligar frases' },
    { value: 'SUBSTITUIR_PALAVRAS', label: 'Substituir palavras' },
  ],
  PRODUCTION: [
    { value: 'TEXTO_LONGO', label: 'Produção escrita' },
    { value: 'AUDIO', label: 'Ouvir e escrever' },
    { value: 'FOTO_E_TEXTO', label: 'Imagem + texto' },
    { value: 'UPLOAD_ARQUIVO', label: 'Enviar arquivo' },
    { value: 'COMPLETAR_IMAGEM', label: 'Completar imagem' },
  ],
};

const categoryOptions = [
  { value: '', label: 'Inglês geral' },
  { value: 'MUSIC', label: 'Música' },
  { value: 'COMICS', label: 'Quadrinho / tirinha' },
  { value: 'FILM', label: 'Filme' },
  { value: 'SERIES', label: 'Série' },
  { value: 'POETRY', label: 'Poesia' },
];

const levelLabels: Record<string, string> = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
};

const presentationBlockLabels: Record<PresentationBlockType, string> = {
  TITULO: 'Título',
  SUBTITULO: 'Subtítulo',
  TEXTO: 'Texto',
  DESTAQUE: 'Destaque',
};

function presentationBlockBackground(background: string, themeMode: 'light' | 'dark') {
  if (themeMode !== 'light') return background;
  const normalized = background.toLowerCase();
  if (normalized === '#282828') return '#1B2A4A';
  if (normalized === '#1b2a4a') return '#404E7C';
  return background;
}

function newPresentationBlock(tipo: PresentationBlockType = 'TEXTO'): PresentationBlock {
  const defaultText = tipo === 'TITULO'
    ? 'Título do conteúdo'
    : tipo === 'SUBTITULO'
      ? 'Subtítulo da seção'
      : tipo === 'DESTAQUE' ? 'Informação importante' : 'Escreva seu texto aqui.';
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tipo,
    texto: defaultText,
    cor: tipo === 'TITULO' ? '#75c3ff' : '#e0e0e0',
    fundo: tipo === 'DESTAQUE' ? '#1b2a4a' : '#282828',
  };
}

function readPresentationBlocks(value: unknown): PresentationBlock[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object') return [];
    const block = item as Record<string, unknown>;
    const tipo = String(block.tipo || 'TEXTO') as PresentationBlockType;
    if (!presentationBlockLabels[tipo]) return [];
    return [{
      id: String(block.id || `bloco-${index}`),
      tipo,
      texto: String(block.texto || ''),
      cor: String(block.cor || (tipo === 'TITULO' ? '#75c3ff' : '#e0e0e0')),
      fundo: String(block.fundo || '#282828'),
    }];
  });
}

const statusMeta = {
  PENDENTE: { label: 'Aguardando correção', color: '#f0d726' },
  APROVADA: { label: 'Aprovada', color: '#a8c97f' },
  AJUSTES_SOLICITADOS: { label: 'Ajustes solicitados', color: '#bd527d' },
};

function isUploadedFile(value: unknown): value is UploadedFileInfo {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.fileName === 'string'
    && typeof candidate.fileDownloadUri === 'string';
}

function fileRequestPath(downloadUri: string) {
  try {
    const url = new URL(downloadUri, window.location.origin);
    if (!url.pathname.startsWith('/api/files/')) return null;
    return `${url.pathname.replace(/^\/api/, '')}${url.search}`;
  } catch {
    return null;
  }
}

function isImageFile(fileName: string) {
  return /\.(avif|bmp|gif|jpe?g|png|webp)$/i.test(fileName);
}

function youtubeVideoId(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    let id = '';
    if (hostname === 'youtu.be') {
      id = parsed.pathname.split('/').filter(Boolean)[0] || '';
    } else if (
      hostname === 'youtube.com'
      || hostname.endsWith('.youtube.com')
      || hostname === 'youtube-nocookie.com'
      || hostname.endsWith('.youtube-nocookie.com')
    ) {
      if (parsed.pathname === '/watch') {
        id = parsed.searchParams.get('v') || '';
      } else {
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (['embed', 'shorts', 'live'].includes(parts[0])) id = parts[1] || '';
      }
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function youtubeEmbedUrl(url: string) {
  const id = youtubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

interface SupportTextEditorProps {
  label: string;
  value: string;
  helperText: string;
  onChange: (value: string) => void;
}

function SupportTextEditor({ label, value, helperText, onChange }: SupportTextEditorProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const wrapSelection = (marker: '**' | '==', placeholder: string) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? value.length;
    const selectedText = value.slice(start, end) || placeholder;
    const nextValue = `${value.slice(0, start)}${marker}${selectedText}${marker}${value.slice(end)}`;
    onChange(nextValue);

    window.requestAnimationFrame(() => {
      const selectionStart = start + marker.length;
      input?.focus();
      input?.setSelectionRange(selectionStart, selectionStart + selectedText.length);
    });
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FormatBoldRoundedIcon />}
          onMouseDown={event => event.preventDefault()}
          onClick={() => wrapSelection('**', 'texto em negrito')}
          sx={{ textTransform: 'none' }}
        >
          Negrito
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FormatColorTextRoundedIcon />}
          onMouseDown={event => event.preventDefault()}
          onClick={() => wrapSelection('==', 'trecho importante')}
          sx={{ textTransform: 'none', color: '#75c3ff', borderColor: '#75c3ff' }}
        >
          Destaque azul
        </Button>
      </Stack>
      <TextField
        fullWidth
        multiline
        minRows={4}
        label={label}
        value={value}
        inputRef={inputRef}
        onChange={event => onChange(event.target.value)}
        helperText={`${helperText} Selecione um trecho e use os botões de formatação.`}
      />
    </Stack>
  );
}

function StudioMediaCanvas({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  const embedUrl = youtubeEmbedUrl(form.midiaUrl);
  return (
    <Paper variant="outlined" sx={{
      p: 1.5,
      minWidth: 0,
      bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#161616',
      borderColor: '#3e5874',
      borderRadius: 3,
    }}>
      <TextField
        fullWidth
        size="small"
        label={form.tipo === 'IMAGEM' ? 'Link da imagem' : form.tipo === 'AUDIO' ? 'Link do áudio' : 'Link do YouTube'}
        value={form.midiaUrl}
        onChange={event => setForm(current => ({ ...current, midiaUrl: event.target.value }))}
        placeholder="Cole o link da mídia aqui"
        sx={{ mb: 1.5 }}
      />
      {form.tipo === 'VIDEO' && embedUrl && (
        <Box sx={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 2.5, overflow: 'hidden' }}>
          <Box component="iframe" src={embedUrl} title="Prévia do vídeo" allowFullScreen
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
        </Box>
      )}
      {form.tipo === 'IMAGEM' && form.midiaUrl && (
        <Box component="img" src={form.midiaUrl} alt="Prévia"
          sx={{ display: 'block', width: '100%', maxHeight: 460, objectFit: 'contain', borderRadius: 2.5 }} />
      )}
      {form.tipo === 'AUDIO' && form.midiaUrl && (
        <Box sx={{ p: 2 }}>
          <Box component="audio" src={form.midiaUrl} controls sx={{ display: 'block', width: '100%' }} />
        </Box>
      )}
      {!form.midiaUrl && (
        <Box sx={{
          minHeight: 230,
          display: 'grid',
          placeItems: 'center',
          border: '1px dashed #3e5874',
          borderRadius: 2.5,
          color: '#8da4b8',
          textAlign: 'center',
          p: 3,
        }}>
          <Box>
            <PlayCircleOutlineRoundedIcon sx={{ fontSize: 46, mb: 1 }} />
            <Typography fontWeight={800}>Adicione a mídia desta página</Typography>
            <Typography variant="body2">O resultado aparecerá aqui imediatamente.</Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

interface StudioSupportEditorProps {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
  tab: 'LETRA' | 'DESCRICAO';
  onTabChange: (tab: 'LETRA' | 'DESCRICAO') => void;
}

function StudioSupportEditor({ form, setForm, tab, onTabChange }: StudioSupportEditorProps) {
  const [showFormatted, setShowFormatted] = useState(false);
  const content = tab === 'LETRA' ? form.itens : form.transcricao;
  const updateContent = (value: string) => {
    setForm(current => tab === 'LETRA'
      ? { ...current, itens: value }
      : { ...current, transcricao: value });
  };

  return (
    <Paper sx={{
      bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
      color: '#e0e0e0',
      borderRadius: 3,
      overflow: 'hidden',
      minHeight: { xs: 240, md: 320 },
      maxHeight: { md: 520 },
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #3e5874',
    }}>
      <Tabs
        value={tab}
        onChange={(_event, value: 'LETRA' | 'DESCRICAO') => onTabChange(value)}
        sx={{ borderBottom: '1px solid #444', flexShrink: 0 }}
      >
        <Tab value="LETRA" label="Letra" sx={{ color: '#e0e0e0' }} />
        <Tab value="DESCRICAO" label="Transcrição" sx={{ color: '#e0e0e0' }} />
      </Tabs>
      <Box sx={{ p: 2, overflowY: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="caption" color="#b3b3b3">
            {tab === 'LETRA' ? 'Edite a letra como ela aparecerá ao aluno.' : 'Edite as falas ou a transcrição da cena.'}
          </Typography>
          <Button size="small" onClick={() => setShowFormatted(value => !value)}
            sx={{ textTransform: 'none' }}>
            {showFormatted ? 'Continuar editando' : 'Ver formatação'}
          </Button>
        </Stack>
        {showFormatted ? (
          <Box sx={{ p: 2, minHeight: 180, border: '1px dashed #4a4a4a', borderRadius: 2 }}>
            {content
              ? <FormattedSupportText>{content}</FormattedSupportText>
              : <Typography color="#8d8d8d">Ainda não há conteúdo nesta aba.</Typography>}
          </Box>
        ) : (
          <SupportTextEditor
            label={tab === 'LETRA' ? 'Escreva a letra aqui' : 'Escreva a transcrição aqui'}
            value={content}
            onChange={updateContent}
            helperText={tab === 'LETRA'
              ? 'Use para músicas, videoclipes ou trechos com letra.'
              : 'Digite manualmente as falas, diálogos ou o conteúdo do áudio.'}
          />
        )}
      </Box>
    </Paper>
  );
}

interface InlinePresentationBlockProps {
  block: PresentationBlock;
  index: number;
  total: number;
  onChange: (changes: Partial<PresentationBlock>) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}

function InlinePresentationBlock({
  block,
  index,
  total,
  onChange,
  onMove,
  onDelete,
}: InlinePresentationBlockProps) {
  const isTitle = block.tipo === 'TITULO';
  const isSubtitle = block.tipo === 'SUBTITULO';
  const isHighlight = block.tipo === 'DESTAQUE';
  return (
    <Box sx={{
      p: { xs: 2, md: 2.5 },
      borderRadius: '14px',
      bgcolor: theme => presentationBlockBackground(block.fundo, theme.palette.mode),
      color: block.cor,
      borderLeft: isHighlight ? `5px solid ${block.cor}` : undefined,
      outline: '1px dashed rgba(117, 195, 255, 0.42)',
    }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} sx={{
        mb: 1.5,
        p: 1,
        borderRadius: 2,
        bgcolor: 'rgba(0, 0, 0, 0.28)',
      }}>
        <Chip size="small" label={`Bloco ${index + 1}`} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Formato</InputLabel>
          <Select
            label="Formato"
            value={block.tipo}
            onChange={event => onChange({ tipo: event.target.value as PresentationBlockType })}
          >
            {(Object.entries(presentationBlockLabels) as [PresentationBlockType, string][]).map(([tipo, label]) => (
              <MenuItem key={tipo} value={tipo}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={0.5} alignItems="center" flex={1}>
          <TextField
            size="small"
            type="color"
            value={block.cor}
            onChange={event => onChange({ cor: event.target.value })}
            aria-label="Cor do texto"
            sx={{ width: 48 }}
          />
          <TextField
            size="small"
            type="color"
            value={block.fundo}
            onChange={event => onChange({ fundo: event.target.value })}
            aria-label="Cor do bloco"
            sx={{ width: 48 }}
          />
          <Box flex={1} />
          <Button size="small" onClick={() => onMove(-1)} disabled={index === 0}>↑</Button>
          <Button size="small" onClick={() => onMove(1)} disabled={index === total - 1}>↓</Button>
          <IconButton size="small" color="error" aria-label="Excluir bloco" onClick={onDelete}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <TextField
        fullWidth
        multiline
        minRows={isTitle ? 1 : 2}
        variant="standard"
        value={block.texto}
        onChange={event => onChange({ texto: event.target.value })}
        placeholder="Digite diretamente neste bloco..."
        slotProps={{ input: { disableUnderline: true } }}
        sx={{
          '& .MuiInputBase-root': {
            color: 'inherit',
            fontSize: isTitle ? { xs: '2rem', md: '3rem' } : isSubtitle ? '1.65rem' : '1rem',
            lineHeight: isTitle ? 1.15 : 1.65,
            fontWeight: isTitle || isSubtitle || isHighlight ? 750 : 400,
            fontStyle: isTitle || isSubtitle ? 'italic' : 'normal',
          },
          '& textarea::placeholder': { color: 'inherit', opacity: 0.6 },
        }}
      />
    </Box>
  );
}

interface StudioStudentSidebarProps {
  moduleTitle: string;
  activities: ActivitySummary[];
  form: ContentFormState;
  editingContent: ActivitySummary | null;
}

function studentItemTypeLabel(step: ContentStep, type: string) {
  if (step === 'APRESENTACAO') {
    return ({
      VIDEO: 'Video',
      AUDIO: 'Audio',
      IMAGEM: 'Image',
      TEXTO: 'Text',
    } as Record<string, string>)[type] || type;
  }
  if (step === 'PRATICA') {
    return ({
      MULTIPLA_ESCOLHA: 'Multiple Choice',
      PREENCHER_LACUNA: 'Fill in the Blanks',
      LISTA_PALAVRAS: 'List Words',
      SELECIONAR_PALAVRAS: 'Select Words',
      RELACIONAR_COLUNAS: 'Match Columns',
      SUBSTITUIR_PALAVRAS: 'Replace Words',
    } as Record<string, string>)[type] || type;
  }
  return ({
    AUDIO: 'Audio',
    TEXTO_LONGO: 'Long Text',
    FOTO_E_TEXTO: 'Photo and Text',
    UPLOAD_ARQUIVO: 'File Upload',
    COMPLETAR_IMAGEM: 'Complete Image',
  } as Record<string, string>)[type] || type;
}

function StudioStudentSidebar({
  moduleTitle,
  activities,
  form,
  editingContent,
}: StudioStudentSidebarProps) {
  const activeSavedKey = editingContent
    ? `${editingContent.etapa}-${editingContent.id}`
    : null;
  const items = activities.map(activity => {
    const key = `${activity.etapa}-${activity.id}`;
    const isActive = key === activeSavedKey;
    return {
      key,
      etapa: activity.etapa,
      tipo: isActive ? form.tipo : activity.tipo,
      classificacao: isActive ? form.classificacao : activity.classificacao || '',
      active: isActive,
      ordem: activity.ordem || 0,
    };
  });

  if (!editingContent) {
    items.push({
      key: 'draft',
      etapa: form.etapa,
      tipo: form.tipo,
      classificacao: form.classificacao,
      active: true,
      ordem: Number.MAX_SAFE_INTEGER,
    });
  }

  const stepOrder: Record<ContentStep, number> = {
    APRESENTACAO: 0,
    PRATICA: 1,
    PRODUCTION: 2,
  };
  items.sort((left, right) =>
    stepOrder[left.etapa] - stepOrder[right.etapa] || left.ordem - right.ordem);

  const stepMeta: Record<ContentStep, { name: string; icon: ReactNode }> = {
    APRESENTACAO: { name: 'Presentation', icon: <PlayCircleOutlineRoundedIcon /> },
    PRATICA: { name: 'Practice', icon: <EditRoundedIcon /> },
    PRODUCTION: { name: 'Production', icon: <EmojiObjectsRoundedIcon /> },
  };

  return (
    <Box sx={{
      width: { xs: '100%', md: 300 },
      flexShrink: 0,
      p: 2.5,
      bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#1b2a4a',
      color: '#e0e0e0',
      borderRight: { md: '1px solid #000' },
      borderBottom: { xs: '1px solid #000', md: 0 },
    }}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        disableRipple
        sx={{ color: '#e0e0e0', textTransform: 'none', pointerEvents: 'none', mb: 2 }}
      >
        Voltar
      </Button>
      <Typography variant="h6" fontWeight={850} sx={{ mb: 2.5 }}>
        {moduleTitle || 'Título do módulo'}
      </Typography>
      <Stack spacing={0.75}>
        {items.map(item => {
          const sameStepItems = items.filter(candidate => candidate.etapa === item.etapa);
          const typeIndex = sameStepItems.findIndex(candidate => candidate.key === item.key) + 1;
          const prefix = sameStepItems.length > 1
            ? `${stepMeta[item.etapa].name} ${typeIndex}`
            : stepMeta[item.etapa].name;
          const category = categoryOptions.find(option => option.value === item.classificacao)?.label;
          return (
            <Box
              key={item.key}
              sx={{
                display: 'flex',
                gap: 1.25,
                alignItems: 'flex-start',
                p: 1.25,
                borderRadius: 2,
                color: item.active ? '#75c3ff' : '#b3b3b3',
                bgcolor: item.active ? 'rgba(255,255,255,.08)' : 'transparent',
                border: item.active ? '1px solid rgba(117,195,255,.34)' : '1px solid transparent',
              }}
            >
              <Box sx={{ display: 'flex', pt: 0.25 }}>{stepMeta[item.etapa].icon}</Box>
              <Box minWidth={0}>
                <Typography sx={{
                  fontStyle: 'italic',
                  fontWeight: item.active ? 850 : 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {prefix}: {studentItemTypeLabel(item.etapa, item.tipo)}
                </Typography>
                {category && (
                  <Chip
                    size="small"
                    label={category}
                    sx={{ mt: 0.75, height: 22, color: 'inherit', borderColor: 'currentColor' }}
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

function formatFileSize(size?: string) {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadedFilePreview({ file }: { file: UploadedFileInfo }) {
  const requestPath = fileRequestPath(file.fileDownloadUri);
  const [blobUrl, setBlobUrl] = useState('');
  const [fileLoading, setFileLoading] = useState(Boolean(requestPath));
  const [fileError, setFileError] = useState(!requestPath);

  useEffect(() => {
    let disposed = false;
    let objectUrl = '';

    if (!requestPath) {
      return undefined;
    }

    api.get<Blob>(requestPath, { responseType: 'blob' })
      .then(response => {
        if (disposed) return;
        objectUrl = URL.createObjectURL(response.data);
        setBlobUrl(objectUrl);
      })
      .catch(() => {
        if (!disposed) setFileError(true);
      })
      .finally(() => {
        if (!disposed) setFileLoading(false);
      });

    return () => {
      disposed = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [requestPath]);

  const size = formatFileSize(file.size);

  return (
    <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 3, overflow: 'hidden' }}>
      <Typography fontWeight={800} sx={{ wordBreak: 'break-word' }}>{file.fileName}</Typography>
      {size && <Typography variant="caption" color="text.secondary">{size}</Typography>}

      {fileLoading && (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
          <CircularProgress size={22} />
          <Typography variant="body2">Carregando arquivo...</Typography>
        </Stack>
      )}

      {fileError && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Este arquivo não está mais disponível no servidor. Peça ao aluno para reenviá-lo.
        </Alert>
      )}

      {blobUrl && isImageFile(file.fileName) && (
        <Box
          component="img"
          src={blobUrl}
          alt={`Imagem enviada: ${file.fileName}`}
          sx={{
            display: 'block',
            width: '100%',
            maxHeight: 520,
            mt: 2,
            borderRadius: 2,
            objectFit: 'contain',
            bgcolor: 'rgba(0, 0, 0, 0.18)',
          }}
        />
      )}

      {blobUrl && (
        <Button
          component="a"
          href={blobUrl}
          download={file.fileName}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          size="small"
          sx={{ mt: 2, textTransform: 'none' }}
        >
          {isImageFile(file.fileName) ? 'Abrir ou baixar imagem' : 'Abrir ou baixar arquivo'}
        </Button>
      )}
    </Paper>
  );
}

function SubmissionResponse({ response }: { response: Record<string, unknown> }) {
  const uploadedFile = isUploadedFile(response.arquivo) ? response.arquivo : null;
  const entries = Object.entries(response).filter(([key]) =>
    key !== 'arquivo' && !(uploadedFile && key === 'nomeArquivoOriginal'));

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {entries.map(([key, value]) => (
        <Box key={key}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
            {key.replaceAll('_', ' ')}
          </Typography>
          <Typography component="div" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {value !== null && typeof value === 'object'
              ? JSON.stringify(value, null, 2)
              : String(value ?? '')}
          </Typography>
        </Box>
      ))}
      {uploadedFile && <UploadedFilePreview key={uploadedFile.fileDownloadUri} file={uploadedFile} />}
      {!entries.length && !uploadedFile && (
        <Typography color="text.secondary">Nenhuma resposta foi registrada.</Typography>
      )}
    </Stack>
  );
}

function lines(value: string) {
  return value.split('\n').map(item => item.trim()).filter(Boolean);
}

function buildActivityData(
  step: ContentStep,
  type: string,
  prompt: string,
  items: string,
  answer: string,
  mediaUrl: string,
) {
  const normalizedMediaUrl = mediaUrl.trim();
  const activityMedia = normalizedMediaUrl ? { media_url: normalizedMediaUrl } : {};
  const isUploadedMedia = normalizedMediaUrl.startsWith('/api/files/content/');
  const legacyVideoMedia = normalizedMediaUrl && !isUploadedMedia
    ? { video_url: normalizedMediaUrl }
    : {};

  if (step === 'APRESENTACAO') return items ? { letra: items } : {};
  if (step === 'PRODUCTION') {
    if (type === 'AUDIO') {
      const parts = prompt.split('___').flatMap((part, index, array) =>
        index < array.length - 1
          ? [part, { label: `Trecho ${index + 1}`, placeholder: 'Escreva o que ouviu' }]
          : [part]);
      return { title: 'Ouça e complete', subtitle: answer, textParts: parts };
    }
    if (type === 'FOTO_E_TEXTO') {
      return { link_externo: mediaUrl, formatos_aceitos: ['image/png', 'image/jpeg'], minWords: Number(answer) || 20 };
    }
    if (type === 'UPLOAD_ARQUIVO') return { formatos_aceitos: lines(items) };
    if (type === 'COMPLETAR_IMAGEM') {
      const count = Math.max(1, Number(answer) || 1);
      return {
        imageUrl: mediaUrl,
        blankPositions: Array.from({ length: count }, (_, index) => ({
          top: 20 + index * 12, left: 20 + index * 10, width: 25,
        })),
      };
    }
    return { minWords: Number(answer) || 50 };
  }

  switch (type) {
    case 'MULTIPLA_ESCOLHA':
      return {
        ...activityMedia,
        pergunta: prompt,
        opcoes: lines(items),
        resposta_correta: answer.trim(),
      };
    case 'PREENCHER_LACUNA':
      return {
        ...activityMedia,
        frase_com_lacuna: prompt,
        resposta_correta: answer.trim(),
        ...(!isUploadedMedia && normalizedMediaUrl.match(/youtu/)
          ? { video_url: normalizedMediaUrl }
          : !isUploadedMedia && normalizedMediaUrl
            ? { imagem_url: normalizedMediaUrl }
            : {}),
      };
    case 'LISTA_PALAVRAS':
      return {
        ...activityMedia,
        ...legacyVideoMedia,
        numberOfInputs: Number(answer) || lines(items).length,
        respostas_possiveis: lines(items),
      };
    case 'SELECIONAR_PALAVRAS':
      return {
        ...activityMedia,
        ...legacyVideoMedia,
        texto_base: prompt,
        palavras_corretas: lines(items),
      };
    case 'RELACIONAR_COLUNAS': {
      const pairs = lines(items).map((line, index) => {
        const [character, quote] = line.split('|').map(part => part.trim());
        return { character, quote, index };
      }).filter(pair => pair.character && pair.quote);
      return {
        ...activityMedia,
        ...legacyVideoMedia,
        characters: pairs.map(pair => ({ id: `c${pair.index + 1}`, name: pair.character })),
        quotes: pairs.map(pair => ({ id: `q${pair.index + 1}`, text: pair.quote })),
        resposta_correta: Object.fromEntries(pairs.map(pair => [`q${pair.index + 1}`, `c${pair.index + 1}`])),
      };
    }
    case 'SUBSTITUIR_PALAVRAS': {
      const replacements = lines(items).map(line => line.split('|').map(part => part.trim()));
      const initialText = prompt.split(/(\[[^\]]+\])/g).filter(Boolean).map(part => {
        const match = part.match(/^\[([^\]]+)\]$/);
        return match ? { type: 'word', content: match[1], id: match[1] } : { type: 'text', content: part };
      });
      return {
        ...activityMedia,
        ...legacyVideoMedia,
        initialText,
        substitutions: Object.fromEntries(replacements.map(([key, options]) => [key, (options || '').split(',').map(v => v.trim())])),
        respostas_corretas: Object.fromEntries(replacements.map(([key, , correct]) => [key, correct])),
      };
    }
    default:
      return {};
  }
}

function activityTypeLabel(activity: ActivitySummary) {
  return contentTypes[activity.etapa].find(item => item.value === activity.tipo)?.label
    || activity.tipo.replaceAll('_', ' ');
}

function activityToForm(activity: ActivitySummary): ContentFormState {
  const data = activity.dados || {};
  const readString = (key: string) =>
    typeof data[key] === 'string' ? String(data[key]) : '';
  const readLines = (key: string) =>
    Array.isArray(data[key]) ? (data[key] as unknown[]).map(String).join('\n') : '';

  let enunciado = '';
  let itens = '';
  let resposta = '';
  let midiaUrl = activity.midiaUrl || '';

  if (activity.etapa === 'APRESENTACAO') {
    itens = readString('letra');
  } else if (activity.etapa === 'PRODUCTION') {
    if (activity.tipo === 'AUDIO') {
      const parts = Array.isArray(data.textParts) ? data.textParts : [];
      enunciado = parts.map(part => typeof part === 'string' ? part : '___').join('');
      resposta = readString('subtitle');
    } else if (activity.tipo === 'FOTO_E_TEXTO') {
      midiaUrl = readString('link_externo') || midiaUrl;
      resposta = String(data.minWords ?? '');
    } else if (activity.tipo === 'UPLOAD_ARQUIVO') {
      itens = readLines('formatos_aceitos');
    } else if (activity.tipo === 'COMPLETAR_IMAGEM') {
      midiaUrl = readString('imageUrl') || midiaUrl;
      resposta = Array.isArray(data.blankPositions)
        ? String(data.blankPositions.length) : '';
    } else {
      resposta = String(data.minWords ?? '');
    }
  } else {
    midiaUrl = readString('media_url')
      || readString('video_url')
      || readString('imagem_url')
      || midiaUrl;
    switch (activity.tipo) {
      case 'MULTIPLA_ESCOLHA':
        enunciado = readString('pergunta');
        itens = readLines('opcoes');
        resposta = readString('resposta_correta');
        break;
      case 'PREENCHER_LACUNA':
        enunciado = readString('frase_com_lacuna');
        resposta = readString('resposta_correta');
        break;
      case 'LISTA_PALAVRAS':
        itens = readLines('respostas_possiveis');
        resposta = String(data.numberOfInputs ?? '');
        break;
      case 'SELECIONAR_PALAVRAS':
        enunciado = readString('texto_base');
        itens = readLines('palavras_corretas');
        break;
      case 'RELACIONAR_COLUNAS': {
        const characters = Array.isArray(data.characters)
          ? data.characters as Record<string, unknown>[] : [];
        const quotes = Array.isArray(data.quotes)
          ? data.quotes as Record<string, unknown>[] : [];
        const correct = data.resposta_correta && typeof data.resposta_correta === 'object'
          ? data.resposta_correta as Record<string, unknown> : {};
        itens = quotes.map(quote => {
          const characterId = String(correct[String(quote.id)] ?? '');
          const character = characters.find(item => String(item.id) === characterId);
          return `${String(character?.name ?? '')} | ${String(quote.text ?? '')}`;
        }).join('\n');
        break;
      }
      case 'SUBSTITUIR_PALAVRAS': {
        const initialText = Array.isArray(data.initialText)
          ? data.initialText as Record<string, unknown>[] : [];
        enunciado = initialText.map(part =>
          part.type === 'word' ? `[${String(part.content ?? '')}]` : String(part.content ?? '')
        ).join('');
        const substitutions = data.substitutions && typeof data.substitutions === 'object'
          ? data.substitutions as Record<string, unknown> : {};
        const correct = data.respostas_corretas && typeof data.respostas_corretas === 'object'
          ? data.respostas_corretas as Record<string, unknown> : {};
        itens = Object.entries(substitutions).map(([key, options]) =>
          `${key} | ${Array.isArray(options) ? options.map(String).join(', ') : ''} | ${String(correct[key] ?? '')}`
        ).join('\n');
        break;
      }
      default:
        break;
    }
  }

  return {
    moduloId: String(activity.moduloId),
    etapa: activity.etapa,
    tipo: activity.tipo,
    classificacao: activity.classificacao || '',
    instrucao: activity.instrucao || '',
    midiaUrl,
    transcricao: activity.transcricao || '',
    enunciado,
    itens,
    resposta,
    blocos: readPresentationBlocks(data.blocos),
  };
}

export default function TeacherStudio() {
  const { mode } = useThemeMode();
  const colors = appPalette[mode];
  const { user } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('overview');
  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [moduleOpen, setModuleOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleSummary | null>(null);
  const [builderModuleId, setBuilderModuleId] = useState<number | null>(null);
  const [moduleForm, setModuleForm] = useState({
    turmaId: '', titulo: '', descricao: '', imagemCapaUrl: '', nivel: 'INICIANTE', publicado: false,
  });
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState('');
  const [contentOpen, setContentOpen] = useState(false);
  const [presentationSupportTab, setPresentationSupportTab] = useState<'LETRA' | 'DESCRICAO'>('LETRA');
  const [editingContent, setEditingContent] = useState<ActivitySummary | null>(null);
  const [contentForm, setContentForm] = useState<ContentFormState>({
    moduloId: '', etapa: 'PRATICA' as ContentStep, tipo: 'MULTIPLA_ESCOLHA',
    classificacao: '', instrucao: '', midiaUrl: '', transcricao: '',
    enunciado: '', itens: '', resposta: '', blocos: [],
  });
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: 'module' | 'content';
    id: number;
    title: string;
    etapa?: ContentStep;
  } | null>(null);
  const [moduleMenu, setModuleMenu] = useState<{
    anchor: HTMLElement;
    module: ModuleSummary;
  } | null>(null);
  const [reviewing, setReviewing] = useState<SubmissionSummary | null>(null);
  const [reviewForm, setReviewForm] = useState({ feedback: '', nota: '100' });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<DashboardData>('/teacher-studio');
      setDashboard(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError('Não foi possível carregar o Teacher Studio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchDashboard(); }, [fetchDashboard]);

  const pending = useMemo(
    () => dashboard.submissoes.filter(submission => submission.status === 'PENDENTE'),
    [dashboard.submissoes],
  );

  const notifySuccess = (message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(''), 3500);
  };

  const uploadModuleCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCoverError('Selecione um arquivo de imagem.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setCoverError('A imagem deve ter no máximo 8 MB.');
      return;
    }

    setCoverUploading(true);
    setCoverError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<{ fileDownloadUri: string }>(
        '/files/covers/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setModuleForm(form => ({ ...form, imagemCapaUrl: response.data.fileDownloadUri }));
    } catch (requestError) {
      console.error(requestError);
      setCoverError('Não foi possível enviar a imagem. Tente novamente.');
    } finally {
      setCoverUploading(false);
    }
  };

  const closeModuleBuilder = () => {
    setModuleOpen(false);
    setEditingModule(null);
    setBuilderModuleId(null);
  };

  const saveModule = async (closeEditor: boolean) => {
    if (!moduleForm.titulo.trim()) {
      setError('Dê um título ao módulo antes de salvar.');
      return null;
    }
    setSaving(true);
    try {
      const payload = {
        ...moduleForm,
        turmaId: null,
      };
      const existingId = builderModuleId || editingModule?.id;
      let savedId = existingId || null;
      if (existingId) {
        await api.put(`/teacher-studio/modulos/${existingId}`, payload);
      } else {
        const response = await api.post<{ id: number }>('/teacher-studio/modulos', payload);
        savedId = response.data.id;
        setBuilderModuleId(savedId);
      }
      await fetchDashboard();
      notifySuccess(existingId ? 'Módulo atualizado com sucesso.' : 'Rascunho criado. Agora adicione as atividades.');
      if (closeEditor) {
        closeModuleBuilder();
        setModuleForm({ turmaId: '', titulo: '', descricao: '', imagemCapaUrl: '', nivel: 'INICIANTE', publicado: false });
      }
      return savedId;
    } catch (requestError) {
      console.error(requestError);
      setError('Não foi possível salvar o módulo.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const payload = {
        moduloId: Number(contentForm.moduloId),
        etapa: contentForm.etapa,
        tipo: contentForm.tipo,
        classificacao: contentForm.classificacao || null,
        instrucao: contentForm.instrucao,
        midiaUrl: contentForm.midiaUrl,
        transcricao: contentForm.transcricao,
        ordem: 1,
        dados: {
          ...buildActivityData(
            contentForm.etapa,
            contentForm.tipo,
            contentForm.enunciado,
            contentForm.itens,
            contentForm.resposta,
            contentForm.midiaUrl,
          ),
          ...(contentForm.etapa === 'APRESENTACAO' ? { blocos: contentForm.blocos } : {}),
        },
      };
      if (editingContent) {
        await api.put(
          `/teacher-studio/conteudos/${editingContent.etapa}/${editingContent.id}`,
          payload,
        );
      } else {
        await api.post('/teacher-studio/conteudos', payload);
      }
      setContentOpen(false);
      setEditingContent(null);
      setContentForm({
        moduloId: '', etapa: 'PRATICA', tipo: 'MULTIPLA_ESCOLHA', classificacao: '',
        instrucao: '', midiaUrl: '', transcricao: '', enunciado: '', itens: '', resposta: '', blocos: [],
      });
      await fetchDashboard();
      notifySuccess(editingContent
        ? 'Atividade atualizada com sucesso.'
        : 'Atividade adicionada ao módulo.');
    } catch (requestError) {
      console.error(requestError);
      setError('Confira os campos da atividade. Alguns tipos exigem pergunta e respostas.');
    } finally {
      setSaving(false);
    }
  };

  const review = async (status: 'APROVADA' | 'AJUSTES_SOLICITADOS') => {
    if (!reviewing) return;
    setSaving(true);
    try {
      await api.put(
        `/teacher-studio/submissoes/${reviewing.id}/correcao`,
        { status, feedback: reviewForm.feedback, nota: Number(reviewForm.nota) || null },
      );
      setReviewing(null);
      await fetchDashboard();
      notifySuccess(status === 'APROVADA'
        ? 'Production aprovada. A recompensa da atividade foi liberada para o aluno.'
        : 'Ajustes solicitados ao aluno.');
    } catch (requestError) {
      console.error(requestError);
      setError('Não foi possível registrar esta correção.');
    } finally {
      setSaving(false);
    }
  };

  const openContent = (moduleId?: number, etapa: ContentStep = 'PRATICA') => {
    setPresentationSupportTab('LETRA');
    setEditingContent(null);
    setContentForm({
      moduloId: moduleId ? String(moduleId) : '',
      etapa,
      tipo: contentTypes[etapa][0].value,
      classificacao: '',
      instrucao: '',
      midiaUrl: '',
      transcricao: '',
      enunciado: '',
      itens: '',
      resposta: '',
      blocos: etapa === 'APRESENTACAO'
        ? [newPresentationBlock('TITULO'), newPresentationBlock('TEXTO')]
        : [],
    });
    setContentOpen(true);
  };

  const addBuilderContent = async (etapa: ContentStep) => {
    const moduleId = builderModuleId || editingModule?.id || await saveModule(false);
    if (moduleId) openContent(moduleId, etapa);
  };

  const updatePresentationBlock = (
    blockId: string,
    changes: Partial<PresentationBlock>,
  ) => {
    setContentForm(form => ({
      ...form,
      blocos: form.blocos.map(block =>
        block.id === blockId ? { ...block, ...changes } : block),
    }));
  };

  const changeContentType = (tipo: string) => {
    setContentForm(form => form.etapa === 'APRESENTACAO'
      ? { ...form, tipo }
      : {
          ...form,
          tipo,
          enunciado: '',
          itens: '',
          resposta: '',
          transcricao: '',
        });
  };

  const movePresentationBlock = (index: number, direction: -1 | 1) => {
    setContentForm(form => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= form.blocos.length) return form;
      const blocos = [...form.blocos];
      [blocos[index], blocos[nextIndex]] = [blocos[nextIndex], blocos[index]];
      return { ...form, blocos };
    });
  };

  const openEditContent = (activity: ActivitySummary) => {
    setPresentationSupportTab(
      typeof activity.dados?.letra === 'string' && activity.dados.letra
        ? 'LETRA'
        : 'DESCRICAO',
    );
    setEditingContent(activity);
    setContentForm(activityToForm(activity));
    setContentOpen(true);
  };

  const openNewModule = () => {
    setEditingModule(null);
    setBuilderModuleId(null);
    setCoverError('');
    setModuleForm({
      turmaId: '', titulo: '', descricao: '', imagemCapaUrl: '',
      nivel: 'INICIANTE', publicado: false,
    });
    setModuleOpen(true);
  };

  const openEditModule = (module: ModuleSummary) => {
    setEditingModule(module);
    setBuilderModuleId(module.id);
    setCoverError('');
    setModuleForm({
      turmaId: module.turmaId ? String(module.turmaId) : '',
      titulo: module.titulo,
      descricao: module.descricao || '',
      imagemCapaUrl: module.imagemCapaUrl || '',
      nivel: module.nivel,
      publicado: module.publicado,
    });
    setModuleOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      if (deleteTarget.kind === 'module') {
        await api.delete(`/teacher-studio/modulos/${deleteTarget.id}`);
      } else {
        await api.delete(
          `/teacher-studio/conteudos/${deleteTarget.etapa}/${deleteTarget.id}`,
        );
      }
      const deletedKind = deleteTarget.kind;
      setDeleteTarget(null);
      await fetchDashboard();
      notifySuccess(deletedKind === 'module'
        ? 'Módulo excluído com sucesso.'
        : 'Atividade excluída com sucesso.');
    } catch (requestError) {
      console.error(requestError);
      setError('Não foi possível excluir este item.');
    } finally {
      setSaving(false);
    }
  };

  const navItems: { value: Section; label: string; icon: ReactNode; badge?: number }[] = [
    { value: 'overview', label: 'Visão geral', icon: <DashboardRoundedIcon /> },
    { value: 'modules', label: 'Editor de módulos', icon: <AutoStoriesRoundedIcon /> },
    { value: 'reviews', label: 'Correções', icon: <RateReviewRoundedIcon />, badge: pending.length },
  ];

  if (loading && dashboard === emptyDashboard) {
    return <Box sx={{ flex: 1, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 69px)', bgcolor: colors.background }}>
      <Box component="aside" sx={{
        width: 255,
        p: 2.5,
        bgcolor: colors.nav,
        borderRight: `1px solid ${colors.navAccent}`,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.25, mb: 3 }}>
          <Avatar sx={{ bgcolor: colors.primary, color: '#10213d' }}><SchoolOutlinedIcon /></Avatar>
          <Box>
            <Typography fontWeight={900}>Teacher Studio</Typography>
            <Typography variant="caption" color="text.secondary">Espaço docente</Typography>
          </Box>
        </Stack>
        <Stack spacing={0.75}>
          {navItems.map(item => (
            <Button
              key={item.value}
              startIcon={item.icon}
              onClick={() => setSection(item.value)}
              sx={{
                justifyContent: 'flex-start',
                px: 1.5,
                py: 1.25,
                borderRadius: 3,
                textTransform: 'none',
                color: section === item.value ? colors.primary : colors.textMuted,
                bgcolor: section === item.value ? `${colors.primary}1c` : 'transparent',
                fontWeight: section === item.value ? 900 : 600,
              }}
            >
              {item.label}
              {!!item.badge && <Chip label={item.badge} size="small" sx={{ ml: 'auto', height: 22, bgcolor: colors.accent, color: '#fff' }} />}
            </Button>
          ))}
        </Stack>
        <Paper sx={{ mt: 'auto', p: 2, borderRadius: 3, bgcolor: `${colors.secondary}14`, border: `1px solid ${colors.secondary}55` }}>
          <Typography variant="caption" color="text.secondary">Logado como</Typography>
          <Typography fontWeight={800} noWrap>{user?.nome}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>{user?.sub}</Typography>
        </Paper>
      </Box>

      <Box component="main" sx={{ minWidth: 0, flex: 1, p: { xs: 2, sm: 3, lg: 4 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="overline" sx={{ color: colors.primary, fontWeight: 900, letterSpacing: 1.5 }}>
              EnglishVerse para educadores
            </Typography>
            <Typography variant="h4" fontWeight={950}>
              {section === 'overview' && `Olá, ${user?.nome?.split(' ')[0] || 'professor'}!`}
              {section === 'modules' && 'Editor de módulos'}
              {section === 'reviews' && 'Correções de Productions'}
            </Typography>
            <Typography color="text.secondary">
              {section === 'overview' && 'Crie aulas e corrija as respostas enviadas por todos os alunos.'}
              {section === 'modules' && 'Monte a aula visualmente e veja como ela ficará enquanto edita.'}
              {section === 'reviews' && 'Avalie Productions de todos os alunos e libere o XP após a correção.'}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openNewModule}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, whiteSpace: 'nowrap' }}>
              Novo módulo
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ display: { xs: 'flex', md: 'none' }, overflowX: 'auto', pb: 2, mb: 1 }}>
          {navItems.map(item => (
            <Chip key={item.value} icon={item.icon as ReactElement} label={`${item.label}${item.badge ? ` · ${item.badge}` : ''}`}
              onClick={() => setSection(item.value)}
              color={section === item.value ? 'primary' : 'default'} />
          ))}
        </Stack>

        {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

        {section === 'overview' && (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              {[
                ['Módulos próprios', dashboard.modulos.filter(module => module.editavel).length, <AutoStoriesRoundedIcon />, colors.primary],
                ['Módulos da biblioteca', dashboard.modulos.filter(module => module.biblioteca).length, <PeopleAltOutlinedIcon />, colors.secondary],
                ['Productions recebidas', dashboard.submissoes.length, <EditNoteRoundedIcon />, colors.accent],
                ['Aguardando correção', dashboard.resumo.pendentes, <RateReviewRoundedIcon />, colors.xp],
              ].map(([label, value, icon, color]) => (
                <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={String(label)}>
                  <Paper sx={{ p: 2.5, borderRadius: 4, border: `1px solid ${colors.border}`, bgcolor: colors.surface }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography color="text.secondary" variant="body2">{label as string}</Typography>
                        <Typography variant="h3" fontWeight={950} sx={{ mt: 0.5 }}>{value as number}</Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: `${color}22`, color: color as string }}>{icon}</Avatar>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 7 }}>
                <Paper sx={{ p: 3, borderRadius: 4, bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="h6">Productions para corrigir</Typography>
                      <Typography variant="body2" color="text.secondary">Priorize os envios mais recentes.</Typography>
                    </Box>
                    <Button onClick={() => setSection('reviews')} sx={{ textTransform: 'none' }}>Ver todas</Button>
                  </Stack>
                  {pending.length === 0 ? (
                    <EmptyState icon={<CheckCircleRoundedIcon />} title="Tudo corrigido!"
                      description="Quando um aluno enviar uma Production, ela aparecerá aqui." />
                  ) : pending.slice(0, 4).map((submission, index) => (
                    <Box key={submission.id}>
                      {index > 0 && <Divider />}
                      <Stack direction="row" alignItems="center" gap={2} sx={{ py: 1.5 }}>
                        <Avatar sx={{ bgcolor: `${colors.primary}22`, color: colors.primary }}>{submission.aluno[0]}</Avatar>
                        <Box flex={1} minWidth={0}>
                          <Typography fontWeight={800} noWrap>{submission.aluno}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {submission.turma} · {submission.modulo}
                          </Typography>
                        </Box>
                        <Button variant="outlined" onClick={() => {
                          setReviewing(submission);
                          setReviewForm({ feedback: submission.feedback || '', nota: String(submission.nota || 100) });
                        }} sx={{ borderRadius: 3, textTransform: 'none' }}>
                          Corrigir
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper sx={{
                  p: 3, height: '100%', borderRadius: 4,
                  background: `linear-gradient(145deg, ${colors.surfaceRaised}, ${colors.nav})`,
                  border: `1px solid ${colors.primary}66`,
                }}>
                  <RocketLaunchOutlinedIcon sx={{ color: colors.primary, fontSize: 38 }} />
                  <Typography variant="h5" sx={{ mt: 2 }}>Crie sua próxima experiência</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Combine um vídeo de apresentação, atividades de prática e uma Production para avaliação.
                  </Typography>
                  <Button fullWidth variant="contained" startIcon={<AddRoundedIcon />}
                    onClick={openNewModule}
                    sx={{ borderRadius: 3, py: 1.25, textTransform: 'none', fontWeight: 900 }}>
                    Criar módulo
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        )}

        {section === 'modules' && (
          dashboard.modulos.length === 0
            ? <EmptyState icon={<AutoStoriesRoundedIcon />} title="Nenhum módulo criado"
                description="Comece a montar sua primeira aula no editor visual."
                action={<Button variant="contained" onClick={openNewModule}>Novo módulo</Button>} />
            : <Grid container spacing={2}>
                {dashboard.modulos.map(module => (
                  <Grid size={{ xs: 12, lg: 6, xl: 4 }} key={module.id}>
                    <Card sx={{
                      height: '100%',
                      minHeight: 390,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      bgcolor: colors.surface,
                      border: `1px solid ${colors.border}`,
                    }}>
                      <Box sx={{
                        height: 118,
                        flexShrink: 0,
                        background: module.imagemCapaUrl
                          ? `linear-gradient(0deg, rgba(10,20,40,.68), rgba(10,20,40,.2)), url("${module.imagemCapaUrl}") center/cover`
                          : `linear-gradient(135deg, ${colors.primary}55, ${colors.accent}55)`,
                        p: 2,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                      }}>
                        <Stack direction="row" spacing={1}>
                          <Chip size="small" label={levelLabels[module.nivel]} sx={{ bgcolor: '#0d193bcc', color: '#fff' }} />
                          <Chip size="small" label={module.biblioteca ? 'Biblioteca' : module.publicado ? 'Publicado' : 'Rascunho'}
                            sx={{ bgcolor: module.publicado ? '#527537dd' : '#5a6070dd', color: '#fff' }} />
                        </Stack>
                        {module.editavel && (
                          <IconButton
                            aria-label={`Opções de ${module.titulo}`}
                            onClick={event => setModuleMenu({ anchor: event.currentTarget, module })}
                            sx={{
                              bgcolor: '#0d193bcc',
                              color: '#fff',
                              '&:hover': { bgcolor: '#0d193bee' },
                            }}
                          >
                            <MoreVertRoundedIcon />
                          </IconButton>
                        )}
                      </Box>
                      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" color="primary">{module.turma}</Typography>
                        <Typography variant="h6" sx={{ mt: 0.5 }} noWrap>{module.titulo}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          minHeight: 42, mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {module.descricao || 'Sem descrição.'}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                          <Chip size="small" label={`${module.apresentacoes} ${module.apresentacoes === 1 ? 'Presentation' : 'Presentations'}`} />
                          <Chip size="small" label={`${module.praticas} ${module.praticas === 1 ? 'Practice' : 'Practices'}`} />
                          <Chip size="small" label={`${module.productions} ${module.productions === 1 ? 'Production' : 'Productions'}`} />
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 'auto', pt: 3 }}>
                          {module.editavel && (
                            <Button fullWidth variant="contained" startIcon={<EditRoundedIcon />}
                              onClick={() => openEditModule(module)}
                              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800 }}>
                              Abrir editor
                            </Button>
                          )}
                          <Button
                            fullWidth
                            variant={module.editavel ? 'outlined' : 'contained'}
                            startIcon={<PlayCircleOutlineRoundedIcon />}
                            onClick={() => navigate(`/presentation/${module.id}`)}
                            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800 }}
                          >
                            Visualizar
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
        )}

        {section === 'reviews' && (
          dashboard.submissoes.length === 0
            ? <EmptyState icon={<RateReviewRoundedIcon />} title="Ainda não há Productions"
                description="As respostas dos alunos aparecerão aqui para sua avaliação." />
            : <Stack spacing={1.5}>
                {dashboard.submissoes.map(submission => {
                  const meta = statusMeta[submission.status];
                  return (
                    <Paper key={submission.id} sx={{ p: 2.5, borderRadius: 4, bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={2}>
                        <Avatar sx={{ bgcolor: `${meta.color}22`, color: meta.color }}>{submission.aluno[0]}</Avatar>
                        <Box flex={1} minWidth={0}>
                          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                            <Typography fontWeight={900}>{submission.aluno}</Typography>
                            <Chip size="small" label={meta.label} sx={{ color: meta.color, border: `1px solid ${meta.color}77`, bgcolor: `${meta.color}14` }} />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">{submission.turma} · {submission.modulo}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Enviado em {new Date(submission.enviadaEm).toLocaleString('pt-BR')}
                          </Typography>
                        </Box>
                        <Button variant={submission.status === 'PENDENTE' ? 'contained' : 'outlined'}
                          startIcon={<EditNoteRoundedIcon />}
                          onClick={() => {
                            setReviewing(submission);
                            setReviewForm({ feedback: submission.feedback || '', nota: String(submission.nota || 100) });
                          }}
                          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800 }}>
                          {submission.status === 'PENDENTE' ? 'Corrigir agora' : 'Ver correção'}
                        </Button>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
        )}
      </Box>

      <Menu
        anchorEl={moduleMenu?.anchor || null}
        open={Boolean(moduleMenu)}
        onClose={() => setModuleMenu(null)}
      >
        <MenuItem onClick={() => {
          if (moduleMenu) openEditModule(moduleMenu.module);
          setModuleMenu(null);
        }}>
          <EditRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
          Editar módulo
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={() => {
          if (moduleMenu) {
            setDeleteTarget({
              kind: 'module',
              id: moduleMenu.module.id,
              title: moduleMenu.module.titulo,
            });
          }
          setModuleMenu(null);
        }}>
          <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
          Excluir módulo
        </MenuItem>
      </Menu>

      <Dialog open={moduleOpen} onClose={closeModuleBuilder} fullScreen>
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: colors.background,
        }}>
          <Box sx={{
            px: { xs: 2, sm: 3 },
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: colors.nav,
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <Button
              onClick={closeModuleBuilder}
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                px: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 800,
                '&:hover': {
                  bgcolor: theme => theme.palette.action.hover,
                  transform: 'translateX(-2px)',
                },
                transition: 'transform 160ms ease, background-color 160ms ease',
              }}
            >
              Voltar
            </Button>
            <Box flex={1}>
              <Typography fontWeight={900}>
                {builderModuleId || editingModule ? 'Editor visual do módulo' : 'Novo módulo'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Edite à esquerda e acompanhe a página do aluno à direita.
              </Typography>
            </Box>
            <Button variant="outlined" onClick={() => void saveModule(false)}
              disabled={saving || coverUploading || !moduleForm.titulo.trim()}
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, textTransform: 'none' }}>
              Salvar rascunho
            </Button>
            <Button variant="contained" onClick={() => void saveModule(true)}
              disabled={saving || coverUploading || !moduleForm.titulo.trim()}
              sx={{ textTransform: 'none', fontWeight: 900 }}>
              {saving ? 'Salvando...' : 'Salvar e sair'}
            </Button>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', minHeight: 0, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{
              width: { xs: '100%', md: 370 },
              flexShrink: 0,
              p: 2.5,
              overflowY: 'auto',
              bgcolor: colors.surface,
              borderRight: { md: `1px solid ${colors.border}` },
              borderBottom: { xs: `1px solid ${colors.border}`, md: 0 },
            }}>
              <Typography variant="overline" color="primary" fontWeight={900}>Configurações da página</Typography>
              <Stack spacing={2} sx={{ mt: 1.5 }}>
                <TextField required label="Título do módulo" value={moduleForm.titulo}
                  onChange={event => setModuleForm(form => ({ ...form, titulo: event.target.value }))}
                  placeholder="Ex.: Simple Past com Stranger Things" />
                <TextField multiline minRows={3} label="Descrição" value={moduleForm.descricao}
                  onChange={event => setModuleForm(form => ({ ...form, descricao: event.target.value }))}
                  placeholder="Explique em poucas palavras o que o aluno aprenderá." />
                <FormControl>
                  <InputLabel>Nível</InputLabel>
                  <Select label="Nível" value={moduleForm.nivel}
                    onChange={event => setModuleForm(form => ({ ...form, nivel: event.target.value }))}>
                    <MenuItem value="INICIANTE">Iniciante</MenuItem>
                    <MenuItem value="INTERMEDIARIO">Intermediário</MenuItem>
                    <MenuItem value="AVANCADO">Avançado</MenuItem>
                  </Select>
                </FormControl>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                  <Box sx={{
                    width: '100%',
                    height: 135,
                    mb: 1.5,
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: `${colors.primary}12`,
                    border: `1px dashed ${colors.border}`,
                  }}>
                    {moduleForm.imagemCapaUrl
                      ? <Box component="img" src={moduleForm.imagemCapaUrl} alt="Prévia da capa"
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <ImageRoundedIcon sx={{ fontSize: 46, color: 'text.secondary' }} />}
                  </Box>
                  <Typography fontWeight={850}>Imagem de capa</Typography>
                  <Typography variant="caption" color="text.secondary">
                    JPG, PNG ou WebP de até 8 MB.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                    <Button component="label" size="small" variant="outlined"
                      startIcon={coverUploading ? <CircularProgress size={16} /> : <CloudUploadRoundedIcon />}
                      disabled={coverUploading} sx={{ textTransform: 'none' }}>
                      {moduleForm.imagemCapaUrl ? 'Trocar' : 'Carregar imagem'}
                      <input hidden type="file" accept="image/png,image/jpeg,image/webp,image/avif"
                        onChange={uploadModuleCover} />
                    </Button>
                    {moduleForm.imagemCapaUrl && (
                      <Button size="small" color="error" onClick={() =>
                        setModuleForm(form => ({ ...form, imagemCapaUrl: '' }))
                      } sx={{ textTransform: 'none' }}>Remover</Button>
                    )}
                  </Stack>
                  {coverError && <Alert severity="error" sx={{ mt: 1.5 }}>{coverError}</Alert>}
                </Paper>
                <Stack direction="row" justifyContent="space-between" alignItems="center"
                  sx={{ p: 1.5, borderRadius: 3, bgcolor: `${colors.primary}0d` }}>
                  <Box>
                    <Typography fontWeight={800}>Publicar para alunos</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Desative enquanto estiver montando.
                    </Typography>
                  </Box>
                  <Switch checked={moduleForm.publicado}
                    onChange={event => setModuleForm(form => ({ ...form, publicado: event.target.checked }))} />
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', p: { xs: 2, sm: 3, lg: 4 } }}>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>
                Prévia da página do aluno
              </Typography>
              <Paper sx={{
                mt: 1,
                maxWidth: 980,
                mx: 'auto',
                overflow: 'hidden',
                borderRadius: 4,
                bgcolor: colors.surface,
                border: `1px solid ${colors.border}`,
              }}>
                <Box sx={{
                  minHeight: 230,
                  p: { xs: 3, sm: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#fff',
                  background: moduleForm.imagemCapaUrl
                    ? `linear-gradient(0deg, rgba(7,14,31,.92), rgba(7,14,31,.25)), url("${moduleForm.imagemCapaUrl}") center/cover`
                    : `linear-gradient(135deg, ${colors.nav}, ${colors.primary}99)`,
                }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip size="small" label={levelLabels[moduleForm.nivel]} sx={{ bgcolor: '#0d193bcc', color: '#fff' }} />
                    <Chip size="small" label={moduleForm.publicado ? 'Publicado' : 'Rascunho'}
                      sx={{ bgcolor: moduleForm.publicado ? '#527537dd' : '#5a6070dd', color: '#fff' }} />
                  </Stack>
                  <Typography variant="h3" fontWeight={950}>
                    {moduleForm.titulo || 'Título da sua aula'}
                  </Typography>
                  <Typography sx={{ mt: 1, maxWidth: 720, color: '#ffffffcc' }}>
                    {moduleForm.descricao || 'A descrição aparecerá aqui para apresentar o conteúdo aos alunos.'}
                  </Typography>
                </Box>

                <Stack spacing={3} sx={{ p: { xs: 2, sm: 4 } }}>
                  {([
                    ['APRESENTACAO', 'Presentation', 'Apresente o tema com vídeo, música, imagem ou texto.'],
                    ['PRATICA', 'Practice', 'Adicione atividades para o aluno praticar.'],
                    ['PRODUCTION', 'Production', 'Proponha uma resposta que será corrigida pelo professor.'],
                  ] as [ContentStep, string, string][]).map(([etapa, title, description]) => {
                    const activities = dashboard.conteudos.filter(activity =>
                      activity.moduloId === (builderModuleId || editingModule?.id)
                      && activity.etapa === etapa);
                    return (
                      <Box key={etapa}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}
                          alignItems={{ sm: 'center' }} justifyContent="space-between">
                          <Box>
                            <Typography variant="h5" fontWeight={900}>{title}</Typography>
                            <Typography variant="body2" color="text.secondary">{description}</Typography>
                          </Box>
                          <Button variant="outlined" startIcon={<AddRoundedIcon />}
                            onClick={() => void addBuilderContent(etapa)}
                            disabled={saving || !moduleForm.titulo.trim()}
                            sx={{ textTransform: 'none', borderRadius: 3, whiteSpace: 'nowrap' }}>
                            Adicionar
                          </Button>
                        </Stack>
                        <Stack spacing={1.25} sx={{ mt: 2 }}>
                          {activities.length === 0 ? (
                            <Paper variant="outlined" sx={{
                              p: 2.5,
                              textAlign: 'center',
                              borderRadius: 3,
                              borderStyle: 'dashed',
                              bgcolor: `${colors.primary}08`,
                            }}>
                              <Typography color="text.secondary">
                                Esta parte ainda está vazia. Clique em “Adicionar”.
                              </Typography>
                            </Paper>
                          ) : activities.map((activity, index) => (
                            <Paper key={`${activity.etapa}-${activity.id}`} variant="outlined"
                              sx={{ p: 2, borderRadius: 3 }}>
                              <Stack direction="row" alignItems="center" gap={1.5}>
                                <Avatar sx={{ width: 34, height: 34, bgcolor: `${colors.primary}22`, color: colors.primary }}>
                                  {index + 1}
                                </Avatar>
                                <Box flex={1} minWidth={0}>
                                  <Typography fontWeight={850}>{activityTypeLabel(activity)}</Typography>
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {activity.instrucao || activity.transcricao || activity.midiaUrl || 'Conteúdo configurado'}
                                  </Typography>
                                </Box>
                                <IconButton aria-label="Editar atividade" onClick={() => openEditContent(activity)}>
                                  <EditRoundedIcon />
                                </IconButton>
                                <IconButton color="error" aria-label="Excluir atividade"
                                  onClick={() => setDeleteTarget({
                                    kind: 'content',
                                    id: activity.id,
                                    etapa: activity.etapa,
                                    title: activityTypeLabel(activity),
                                  })}>
                                  <DeleteOutlineRoundedIcon />
                                </IconButton>
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={contentOpen} onClose={() => {
        setContentOpen(false);
        setEditingContent(null);
      }} fullScreen>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: colors.background }}>
          <Box sx={{
            px: { xs: 2, sm: 3 },
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: colors.nav,
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <Button
              onClick={() => {
                setContentOpen(false);
                setEditingContent(null);
              }}
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                px: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 800,
                '&:hover': {
                  bgcolor: theme => theme.palette.action.hover,
                  transform: 'translateX(-2px)',
                },
                transition: 'transform 160ms ease, background-color 160ms ease',
              }}
            >
              Voltar para o módulo
            </Button>
            <Box flex={1}>
              <Typography fontWeight={900}>
                {editingContent ? 'Editar página' : 'Nova página'} · {
                  contentForm.etapa === 'APRESENTACAO'
                    ? 'Presentation'
                    : contentForm.etapa === 'PRATICA' ? 'Practice' : 'Production'
                }
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Edite diretamente a página abaixo; o resultado será o mesmo visto pelo aluno.
              </Typography>
            </Box>
            <Button variant="contained" onClick={saveContent}
              disabled={saving || !contentForm.moduloId || !contentForm.tipo}
              sx={{ textTransform: 'none', fontWeight: 900 }}>
              {saving ? 'Salvando...' : 'Salvar página'}
            </Button>
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: { xs: 2, sm: 3, xl: 4 } }}>
            <Paper variant="outlined" sx={{
              maxWidth: 1180,
              mx: 'auto',
              mb: 2,
              p: 1.5,
              borderRadius: 3,
              bgcolor: colors.surface,
              borderColor: colors.border,
            }}>
              <Grid container spacing={1.5}>
                {!moduleOpen && (
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <FormControl fullWidth required size="small">
                      <InputLabel>Módulo</InputLabel>
                      <Select label="Módulo" value={contentForm.moduloId} disabled={Boolean(editingContent)}
                        onChange={event => setContentForm(form => ({ ...form, moduloId: event.target.value }))}>
                        {dashboard.modulos.filter(module => module.editavel).map(module =>
                          <MenuItem key={module.id} value={module.id}>{module.titulo}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Etapa</InputLabel>
                    <Select label="Etapa" value={contentForm.etapa} disabled={Boolean(editingContent)}
                      onChange={event => {
                        const etapa = event.target.value as ContentStep;
                        setContentForm(form => ({
                          ...form,
                          etapa,
                          tipo: contentTypes[etapa][0].value,
                          enunciado: '',
                          itens: '',
                          resposta: '',
                          transcricao: '',
                          blocos: etapa === 'APRESENTACAO'
                            ? [newPresentationBlock('TITULO'), newPresentationBlock('TEXTO')]
                            : [],
                        }));
                      }}>
                      <MenuItem value="APRESENTACAO">Presentation · conteúdo</MenuItem>
                      <MenuItem value="PRATICA">Practice · atividade autocorrigida</MenuItem>
                      <MenuItem value="PRODUCTION">Production · resposta avaliada</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo de conteúdo</InputLabel>
                    <Select label="Tipo de conteúdo" value={contentForm.tipo}
                      onChange={event => changeContentType(event.target.value)}>
                      {contentTypes[contentForm.etapa].map(type =>
                        <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Classificação Pop Culture</InputLabel>
                    <Select label="Classificação Pop Culture" value={contentForm.classificacao}
                      onChange={event => setContentForm(form => ({ ...form, classificacao: event.target.value }))}>
                      <MenuItem value=""><em>Sem classificação</em></MenuItem>
                      {categoryOptions.map(option =>
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ minWidth: 0 }}>
              <Box sx={{
                maxWidth: 1500,
                mx: 'auto',
                minHeight: 'calc(100vh - 150px)',
                borderRadius: 4,
                bgcolor: theme => theme.palette.mode === 'light' ? '#456379' : '#000',
                border: `1px solid ${colors.border}`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
              }}>
                <StudioStudentSidebar
                  moduleTitle={
                    dashboard.modulos.find(module => module.id === Number(contentForm.moduloId))?.titulo
                    || editingModule?.titulo
                    || moduleForm.titulo
                  }
                  activities={dashboard.conteudos.filter(activity =>
                    activity.moduloId === Number(contentForm.moduloId))}
                  form={contentForm}
                  editingContent={editingContent}
                />
                <Box sx={{ flex: 1, minWidth: 0, p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
                      Progresso: 0%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={0}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
                        '& .MuiLinearProgress-bar': { bgcolor: '#a8c97f' },
                      }}
                    />
                  </Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#e0e0e0', fontStyle: 'italic' }}>
                      {contentForm.etapa === 'APRESENTACAO'
                        ? 'Presentation'
                        : contentForm.etapa === 'PRATICA' ? 'Practice' : 'Production'}
                    </Typography>
                    <Typography sx={{ color: '#b3b3b3' }}>
                      {contentTypes[contentForm.etapa].find(type => type.value === contentForm.tipo)?.label}
                    </Typography>
                  </Box>
                  {contentForm.classificacao && (
                    <Chip label={categoryOptions.find(option =>
                      option.value === contentForm.classificacao)?.label} color="primary" variant="outlined" />
                  )}
                </Stack>

                {contentForm.etapa === 'APRESENTACAO' ? (
                  <Stack spacing={2.5}>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'minmax(0, 1fr)',
                        md: contentForm.tipo === 'TEXTO'
                          ? 'minmax(0, 1fr)'
                          : 'minmax(0, 1.35fr) minmax(320px, 0.85fr)',
                      },
                      alignItems: 'stretch',
                      gap: 2,
                    }}>
                      {contentForm.tipo !== 'TEXTO' && (
                        <StudioMediaCanvas form={contentForm} setForm={setContentForm} />
                      )}
                      <StudioSupportEditor
                        form={contentForm}
                        setForm={setContentForm}
                        tab={presentationSupportTab}
                        onTabChange={setPresentationSupportTab}
                      />
                    </Box>
                    <Divider sx={{ color: '#8da4b8', '&::before, &::after': { borderColor: '#31445a' } }}>
                      <Chip label="Page blocks" size="small" />
                    </Divider>
                    {contentForm.blocos.length === 0 ? (
                      <Paper sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
                        color: '#b3b3b3',
                        border: '1px dashed #3e5874',
                        borderRadius: 3,
                      }}>
                        Comece adicionando um bloco abaixo.
                      </Paper>
                    ) : contentForm.blocos.map((bloco, index) => (
                      <InlinePresentationBlock
                        key={bloco.id}
                        block={bloco}
                        index={index}
                        total={contentForm.blocos.length}
                        onChange={changes => updatePresentationBlock(bloco.id, changes)}
                        onMove={direction => movePresentationBlock(index, direction)}
                        onDelete={() => setContentForm(form => ({
                          ...form,
                          blocos: form.blocos.filter(item => item.id !== bloco.id),
                        }))}
                      />
                    ))}
                    <Paper variant="outlined" sx={{
                      p: 2,
                      bgcolor: theme => theme.palette.mode === 'light' ? '#1B2A4A' : '#161616',
                      borderColor: '#3e5874',
                      borderStyle: 'dashed',
                      borderRadius: 3,
                    }}>
                      <Typography color="#e0e0e0" fontWeight={900}>Add a new block</Typography>
                      <Typography variant="body2" color="#8da4b8" sx={{ mb: 1.5 }}>
                        O novo bloco aparecerá aqui e poderá ser preenchido imediatamente.
                      </Typography>
                      <Grid container spacing={1}>
                        {(Object.entries(presentationBlockLabels) as [PresentationBlockType, string][]).map(([tipo, label]) => (
                          <Grid size={{ xs: 6, sm: 3 }} key={tipo}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<AddRoundedIcon />}
                              onClick={() => setContentForm(form => ({
                                ...form,
                                blocos: [...form.blocos, newPresentationBlock(tipo)],
                              }))}
                              sx={{ textTransform: 'none', borderRadius: 2.5 }}
                            >
                              {label}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Stack>
                ) : (
                  <ActivityPageEditor form={contentForm} setForm={setContentForm} />
                )}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardRoundedIcon />}
                      aria-disabled
                      sx={{
                        bgcolor: '#75c3ff',
                        color: '#fff',
                        fontWeight: 850,
                        pointerEvents: 'none',
                        '&:hover': { bgcolor: '#75c3ff' },
                      }}
                    >
                      Próximo
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => !saving && setDeleteTarget(null)}
        fullWidth maxWidth="xs">
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja realmente excluir <strong>{deleteTarget?.title}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            {deleteTarget?.kind === 'module'
              ? 'As atividades, respostas e o progresso associados a este módulo também serão removidos.'
              : 'Respostas e progresso associados a esta atividade também serão removidos.'}
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={saving}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}
            startIcon={<DeleteOutlineRoundedIcon />}>
            {saving ? 'Excluindo...' : 'Excluir definitivamente'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(reviewing)} onClose={() => setReviewing(null)} fullWidth maxWidth="md">
        {reviewing && <>
          <DialogTitle>
            <Stack direction="row" gap={2} alignItems="center">
              <Avatar sx={{ bgcolor: colors.primary }}>{reviewing.aluno[0]}</Avatar>
              <Box>
                <Typography variant="h5">Production de {reviewing.aluno}</Typography>
                <Typography variant="body2" color="text.secondary">{reviewing.turma} · {reviewing.modulo}</Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Ao aprovar, a atividade será concluída e a recompensa do aluno será liberada automaticamente.
            </Alert>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 2 }}>
              <Typography variant="overline" color="text.secondary">Proposta</Typography>
              <Typography>{reviewing.atividade}</Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: colors.surfaceRaised, mb: 3 }}>
              <Typography variant="overline" color="text.secondary">Resposta do aluno</Typography>
              <SubmissionResponse response={reviewing.resposta || {}} />
            </Paper>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField fullWidth type="number" label="Nota (0–100)" value={reviewForm.nota}
                  onChange={event => setReviewForm(form => ({ ...form, nota: event.target.value }))}
                  slotProps={{ htmlInput: { min: 0, max: 100 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <TextField fullWidth multiline minRows={4} label="Feedback para o aluno" value={reviewForm.feedback}
                  onChange={event => setReviewForm(form => ({ ...form, feedback: event.target.value }))}
                  placeholder="Aponte acertos e explique o que pode melhorar." />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
            <Button onClick={() => setReviewing(null)}>Fechar</Button>
            <Stack direction="row" spacing={1}>
              <Button color="warning" variant="outlined" startIcon={<ReplayRoundedIcon />}
                disabled={saving || reviewing.status === 'APROVADA'}
                onClick={() => review('AJUSTES_SOLICITADOS')}>
                Solicitar ajustes
              </Button>
              <Button color="success" variant="contained" startIcon={<CheckCircleRoundedIcon />}
                disabled={saving || reviewing.status === 'APROVADA'}
                onClick={() => review('APROVADA')}>
                Aprovar resposta
              </Button>
            </Stack>
          </DialogActions>
        </>}
      </Dialog>
    </Box>
  );
}

function ActivityPageEditor({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  const itemLines = lines(form.itens);
  const embedUrl = youtubeEmbedUrl(form.midiaUrl);
  const [mediaSourceMode, setMediaSourceMode] = useState<'LINK' | 'UPLOAD'>(
    form.midiaUrl.startsWith('/api/files/content/') ? 'UPLOAD' : 'LINK',
  );
  const [activityMediaUploading, setActivityMediaUploading] = useState(false);
  const [activityMediaError, setActivityMediaError] = useState('');
  const [uploadedMediaName, setUploadedMediaName] = useState('');
  const update = (changes: Partial<ContentFormState>) =>
    setForm(current => ({ ...current, ...changes }));
  const cleanMediaPath = form.midiaUrl.split(/[?#]/)[0].toLowerCase();
  const mediaIsImage = /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/.test(cleanMediaPath);
  const mediaIsAudio = /\.(aac|flac|m4a|mp3|ogg|wav)$/.test(cleanMediaPath);
  const mediaIsVideo = /\.(m4v|mov|mp4|mpeg|ogv|webm)$/.test(cleanMediaPath);
  const mediaIsPdf = /\.pdf$/.test(cleanMediaPath);

  useEffect(() => {
    if (form.midiaUrl.startsWith('/api/files/content/')) {
      setMediaSourceMode('UPLOAD');
    }
  }, [form.midiaUrl]);

  const uploadActivityMedia = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const supported = file.type.startsWith('image/')
      || file.type.startsWith('audio/')
      || file.type.startsWith('video/')
      || file.type === 'application/pdf';
    if (!supported) {
      setActivityMediaError('Envie uma imagem, um áudio, um vídeo ou um PDF.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setActivityMediaError('A mídia deve ter no máximo 100 MB.');
      return;
    }

    setActivityMediaUploading(true);
    setActivityMediaError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<{
        fileDownloadUri: string;
        originalFileName: string;
      }>('/files/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedMediaName(response.data.originalFileName || file.name);
      setForm(current => ({ ...current, midiaUrl: response.data.fileDownloadUri }));
    } catch (requestError) {
      console.error(requestError);
      setActivityMediaError('Não foi possível enviar a mídia. Tente novamente.');
    } finally {
      setActivityMediaUploading(false);
    }
  };
  const panelSx = {
    p: { xs: 2.5, sm: 4 },
    borderRadius: 3,
    bgcolor: (theme: { palette: { mode: 'light' | 'dark' } }) =>
      theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
    color: '#e0e0e0',
  };
  const emptyLabel = (label: string) => (
    <Typography color="#888" fontStyle="italic">{label}</Typography>
  );

  const header = (
    <TextField
      fullWidth
      multiline
      minRows={1}
      variant="standard"
      value={form.instrucao}
      onChange={event => update({ instrucao: event.target.value })}
      placeholder="Digite aqui a instrução que o aluno verá..."
      slotProps={{ input: { disableUnderline: true } }}
      sx={{
        mb: 2.5,
        '& .MuiInputBase-root': {
          color: '#e0e0e0',
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          lineHeight: 1.35,
          fontWeight: 850,
        },
        '& textarea::placeholder': { color: '#9b9b9b', opacity: 1 },
      }}
    />
  );

  const mediaEditor = (
    <Paper variant="outlined" sx={{
      p: 1.5,
      mb: 2,
      bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#161616',
      borderColor: '#3e5874',
      borderRadius: 3,
    }}>
      <Tabs
        value={mediaSourceMode}
        onChange={(_event, value: 'LINK' | 'UPLOAD') => {
          setMediaSourceMode(value);
          setActivityMediaError('');
        }}
        sx={{ mb: 1.5, minHeight: 36 }}
      >
        <Tab value="LINK" label="Colar link" sx={{ minHeight: 36, textTransform: 'none' }} />
        <Tab value="UPLOAD" label="Enviar arquivo" sx={{ minHeight: 36, textTransform: 'none' }} />
      </Tabs>

      {mediaSourceMode === 'LINK' ? (
        <TextField
          fullWidth
          size="small"
          label={form.tipo === 'COMPLETAR_IMAGEM'
            ? 'Link da imagem da atividade'
            : form.tipo === 'FOTO_E_TEXTO'
              ? 'Link de apoio sugerido ao aluno'
              : 'Link de vídeo, áudio ou imagem (opcional)'}
          value={form.midiaUrl}
          onChange={event => update({ midiaUrl: event.target.value })}
          placeholder="Cole o link diretamente aqui"
        />
      ) : (
        <Paper variant="outlined" sx={{
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          borderRadius: 2.5,
          borderStyle: 'dashed',
          bgcolor: 'transparent',
        }}>
          <Box>
            <Typography fontWeight={850}>
              {uploadedMediaName
                || (form.midiaUrl.startsWith('/api/files/content/')
                  ? decodeURIComponent(form.midiaUrl.split('/').pop() || 'Mídia enviada')
                  : 'Selecione a mídia da atividade')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Imagem, áudio, vídeo ou PDF de até 100 MB.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              component="label"
              variant="contained"
              startIcon={activityMediaUploading
                ? <CircularProgress size={17} color="inherit" />
                : <CloudUploadRoundedIcon />}
              disabled={activityMediaUploading}
              sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
            >
              {form.midiaUrl.startsWith('/api/files/content/') ? 'Trocar arquivo' : 'Escolher arquivo'}
              <input
                hidden
                type="file"
                accept="image/*,audio/*,video/*,application/pdf"
                onChange={uploadActivityMedia}
              />
            </Button>
            {form.midiaUrl && (
              <Button
                color="error"
                onClick={() => {
                  update({ midiaUrl: '' });
                  setUploadedMediaName('');
                }}
                sx={{ textTransform: 'none' }}
              >
                Remover
              </Button>
            )}
          </Stack>
        </Paper>
      )}
      {activityMediaError && <Alert severity="error" sx={{ mt: 1.5 }}>{activityMediaError}</Alert>}
      {embedUrl && (
        <Box sx={{ position: 'relative', aspectRatio: '16 / 9', mt: 1.5, borderRadius: 2.5, overflow: 'hidden' }}>
          <Box component="iframe" src={embedUrl} title="Prévia do vídeo" allowFullScreen
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
        </Box>
      )}
      {form.midiaUrl && !embedUrl && mediaIsImage && (
        <Box component="img" src={form.midiaUrl} alt="Prévia da atividade"
          sx={{ display: 'block', width: '100%', maxHeight: 420, objectFit: 'contain', mt: 1.5, borderRadius: 2.5 }} />
      )}
      {form.midiaUrl && !embedUrl && mediaIsAudio && (
        <Box component="audio" src={form.midiaUrl} controls
          sx={{ display: 'block', width: '100%', mt: 1.5 }} />
      )}
      {form.midiaUrl && !embedUrl && mediaIsVideo && (
        <Box component="video" src={form.midiaUrl} controls
          sx={{ display: 'block', width: '100%', maxHeight: 520, mt: 1.5, borderRadius: 2.5 }} />
      )}
      {form.midiaUrl && !embedUrl && mediaIsPdf && (
        <Button
          component="a"
          href={form.midiaUrl}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          sx={{ mt: 1.5, textTransform: 'none' }}
        >
          Abrir PDF enviado
        </Button>
      )}
    </Paper>
  );

  const contentEditor = (
    <Paper variant="outlined" sx={{
      p: 2,
      mb: 2.5,
      bgcolor: theme => theme.palette.mode === 'light' ? '#32415f' : '#202020',
      borderColor: '#3e5874',
      borderStyle: 'dashed',
      borderRadius: 3,
    }}>
      <Typography variant="overline" color="#75c3ff" fontWeight={900}>
        Preencha o conteúdo nesta página
      </Typography>
      <Grid container spacing={1.5} sx={{ mt: 0.25 }}>
        <ActivityFields form={form} setForm={setForm} />
      </Grid>
    </Paper>
  );

  if (form.etapa === 'PRODUCTION') {
    return (
      <Paper sx={panelSx}>
        {header}
        {mediaEditor}
        {contentEditor}
        <Divider sx={{ mb: 2.5, color: '#8da4b8', '&::before, &::after': { borderColor: '#444' } }}>
          Área de resposta do aluno
        </Divider>
        {form.tipo === 'AUDIO' && (
          <Box>
            <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
              {form.enunciado || 'O texto com as lacunas aparecerá aqui.'}
            </Typography>
            <TextField fullWidth disabled placeholder="O aluno escreverá o que ouviu"
              sx={{ input: { color: '#e0e0e0' } }} />
          </Box>
        )}
        {form.tipo === 'TEXTO_LONGO' && (
          <TextField fullWidth multiline minRows={7} disabled
            placeholder={`Resposta escrita do aluno · mínimo de ${form.resposta || '50'} palavras`} />
        )}
        {form.tipo === 'FOTO_E_TEXTO' && (
          <Stack spacing={2}>
            <Box sx={{ height: 150, display: 'grid', placeItems: 'center', border: '2px dashed #75c3ff66', borderRadius: 3 }}>
              <ImageRoundedIcon sx={{ fontSize: 42, color: '#75c3ff' }} />
              <Typography color="#75c3ff">O aluno enviará uma imagem</Typography>
            </Box>
            <TextField fullWidth multiline minRows={4} disabled placeholder="Texto que acompanha a imagem" />
          </Stack>
        )}
        {form.tipo === 'UPLOAD_ARQUIVO' && (
          <Box sx={{ height: 180, display: 'grid', placeItems: 'center', textAlign: 'center', border: '2px dashed #75c3ff66', borderRadius: 3 }}>
            <Box>
              <CloudUploadRoundedIcon sx={{ fontSize: 46, color: '#75c3ff' }} />
              <Typography fontWeight={800}>Arraste ou selecione um arquivo</Typography>
              <Typography variant="body2" color="#b3b3b3">
                {itemLines.length ? itemLines.join(', ') : 'Formatos definidos pelo professor'}
              </Typography>
            </Box>
          </Box>
        )}
        {form.tipo === 'COMPLETAR_IMAGEM' && (
          <Box sx={{ minHeight: 220, display: 'grid', placeItems: 'center', border: '1px solid #555', borderRadius: 3 }}>
            {form.midiaUrl
              ? <Box component="img" src={form.midiaUrl} alt="Atividade" sx={{ maxWidth: '100%', maxHeight: 400 }} />
              : emptyLabel('A imagem com campos aparecerá aqui.')}
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <Paper sx={panelSx}>
      {header}
      {mediaEditor}
      {contentEditor}
      <Divider sx={{ mb: 2.5, color: '#8da4b8', '&::before, &::after': { borderColor: '#444' } }}>
        Como o aluno responderá
      </Divider>

      {form.tipo === 'MULTIPLA_ESCOLHA' && (
        <Box>
          <Typography fontWeight={750} sx={{ mb: 2 }}>
            {form.enunciado || 'A pergunta aparecerá aqui.'}
          </Typography>
          <Stack spacing={1.25}>
            {(itemLines.length ? itemLines : ['Opção 1', 'Opção 2', 'Opção 3']).map((item, index) => (
              <Paper key={`${item}-${index}`} variant="outlined"
                sx={{ p: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'transparent', color: '#e0e0e0', borderRadius: 2.5 }}>
                <Box sx={{ width: 18, height: 18, border: '2px solid #75c3ff', borderRadius: '50%' }} />
                {item}
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {form.tipo === 'PREENCHER_LACUNA' && (
        <Typography variant="h6" sx={{ lineHeight: 2 }}>
          {(form.enunciado || 'Escreva uma frase usando ___ para a lacuna.')
            .split('___')
            .map((part, index, parts) => (
              <Box component="span" key={`${part}-${index}`}>
                {part}
                {index < parts.length - 1 && (
                  <Box component="span" sx={{ display: 'inline-block', width: 130, mx: 1, borderBottom: '2px solid #75c3ff' }} />
                )}
              </Box>
            ))}
        </Typography>
      )}

      {form.tipo === 'LISTA_PALAVRAS' && (
        <Stack spacing={1.25}>
          {Array.from({ length: Math.max(1, Number(form.resposta) || itemLines.length || 3) }, (_, index) => (
            <TextField key={index} fullWidth disabled placeholder={`Resposta ${index + 1}`} />
          ))}
        </Stack>
      )}

      {form.tipo === 'SELECIONAR_PALAVRAS' && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {(form.enunciado || 'As palavras do texto aparecerão aqui para serem selecionadas.')
            .split(/\s+/)
            .filter(Boolean)
            .map((word, index) => (
              <Chip key={`${word}-${index}`} label={word}
                sx={{
                  color: '#e0e0e0',
                  border: '1px solid #75c3ff55',
                  bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#1b2a4a',
                }} />
            ))}
        </Box>
      )}

      {form.tipo === 'RELACIONAR_COLUNAS' && (
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography color="#75c3ff" fontWeight={800} sx={{ mb: 1 }}>Coluna A</Typography>
            <Stack spacing={1}>
              {(itemLines.length ? itemLines : ['Item 1 | Frase 1', 'Item 2 | Frase 2']).map((line, index) => (
                <Paper key={index} sx={{
                  p: 1.5,
                  bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#1b2a4a',
                  color: '#e0e0e0',
                }}>
                  {line.split('|')[0]?.trim()}
                </Paper>
              ))}
            </Stack>
          </Grid>
          <Grid size={6}>
            <Typography color="#75c3ff" fontWeight={800} sx={{ mb: 1 }}>Coluna B</Typography>
            <Stack spacing={1}>
              {(itemLines.length ? itemLines : ['Item 1 | Frase 1', 'Item 2 | Frase 2']).map((line, index) => (
                <Paper key={index} sx={{
                  p: 1.5,
                  bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#1b2a4a',
                  color: '#e0e0e0',
                }}>
                  {line.split('|')[1]?.trim()}
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      )}

      {form.tipo === 'SUBSTITUIR_PALAVRAS' && (
        <Box>
          <Typography sx={{ lineHeight: 2.2, mb: 2 }}>
            {(form.enunciado || 'Use [palavra] para criar uma palavra substituível.')
              .split(/(\[[^\]]+\])/g)
              .filter(Boolean)
              .map((part, index) => part.startsWith('[') && part.endsWith(']')
                ? <Chip key={index} label={part.slice(1, -1)} color="primary" sx={{ mx: 0.5 }} />
                : <Box component="span" key={index}>{part}</Box>)}
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {itemLines.length
              ? itemLines.flatMap(line => (line.split('|')[1] || '').split(',')).map(item => item.trim()).filter(Boolean)
                .map((item, index) => <Chip key={`${item}-${index}`} label={item} variant="outlined" sx={{ color: '#e0e0e0' }} />)
              : emptyLabel('As opções de substituição aparecerão aqui.')}
          </Stack>
        </Box>
      )}
    </Paper>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Paper sx={{ p: 6, borderRadius: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
      <Avatar sx={{ width: 58, height: 58, mx: 'auto', mb: 2, bgcolor: 'action.hover', color: 'primary.main' }}>{icon}</Avatar>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: action ? 2.5 : 0 }}>{description}</Typography>
      {action}
    </Paper>
  );
}

function MultipleChoiceActivityEditor({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  const options = form.itens ? form.itens.split('\n') : [];
  const saveOptions = (nextOptions: string[], oldCorrect = form.resposta) => {
    setForm(current => ({
      ...current,
      itens: nextOptions.join('\n'),
      resposta: nextOptions.includes(oldCorrect) ? oldCorrect : '',
    }));
  };

  return (
    <Grid size={12}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Pergunta"
          value={form.enunciado}
          onChange={event => setForm(current => ({ ...current, enunciado: event.target.value }))}
          placeholder="Digite a pergunta como o aluno irá vê-la."
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
          alignItems={{ sm: 'center' }} gap={1}>
          <Box>
            <Typography fontWeight={850}>Alternativas</Typography>
            <Typography variant="body2" color="text.secondary">
              Adicione cada alternativa e marque a correta.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => saveOptions([...options, `Alternativa ${options.length + 1}`])}
            sx={{ textTransform: 'none' }}
          >
            Adicionar alternativa
          </Button>
        </Stack>
        {options.map((option, index) => (
          <Stack key={index} direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              variant={form.resposta === option && Boolean(option) ? 'contained' : 'outlined'}
              color={form.resposta === option && Boolean(option) ? 'success' : 'primary'}
              startIcon={<CheckCircleRoundedIcon />}
              disabled={!option.trim()}
              onClick={() => setForm(current => ({ ...current, resposta: option }))}
              sx={{ minWidth: 112, textTransform: 'none' }}
            >
              {form.resposta === option && Boolean(option) ? 'Correta' : 'Marcar'}
            </Button>
            <TextField
              fullWidth
              size="small"
              label={`Alternativa ${index + 1}`}
              value={option}
              onChange={event => {
                const nextOptions = [...options];
                nextOptions[index] = event.target.value;
                saveOptions(nextOptions, form.resposta === option ? event.target.value : form.resposta);
              }}
            />
            <IconButton
              color="error"
              aria-label={`Excluir alternativa ${index + 1}`}
              onClick={() => saveOptions(options.filter((_item, optionIndex) => optionIndex !== index))}
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Stack>
        ))}
        {options.length === 0 && (
          <Typography color="text.secondary" textAlign="center">
            Adicione a primeira alternativa.
          </Typography>
        )}
      </Stack>
    </Grid>
  );
}

function FillBlankActivityEditor({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  const segments = form.enunciado.split('___');
  const updateSegments = (nextSegments: string[]) =>
    setForm(current => ({ ...current, enunciado: nextSegments.join('___') }));

  return (
    <Grid size={12}>
      <Stack spacing={2}>
        <Box>
          <Typography fontWeight={850}>Monte a frase na ordem correta</Typography>
          <Typography variant="body2" color="text.secondary">
            Escreva um trecho, adicione a lacuna e continue a frase no campo seguinte.
          </Typography>
        </Box>
        <Stack spacing={1.25}>
          {segments.map((segment, index) => (
            <Box key={index}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label={segments.length === 1
                  ? 'Frase'
                  : index === 0 ? 'Texto antes da lacuna' : `Texto depois da lacuna ${index}`}
                value={segment}
                onChange={event => {
                  const nextSegments = [...segments];
                  nextSegments[index] = event.target.value;
                  updateSegments(nextSegments);
                }}
              />
              {index < segments.length - 1 && (
                <Stack direction="row" alignItems="center" justifyContent="center" gap={1} sx={{ py: 1 }}>
                  <Paper variant="outlined" sx={{
                    px: 3,
                    py: 1,
                    color: '#75c3ff',
                    borderColor: '#75c3ff',
                    borderStyle: 'dashed',
                    bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#142137',
                    borderRadius: 3,
                    fontWeight: 850,
                  }}>
                    Espaço que o aluno preencherá
                  </Paper>
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Remover lacuna"
                    onClick={() => {
                      const nextSegments = [...segments];
                      nextSegments.splice(index, 2, `${segments[index]} ${segments[index + 1]}`.trim());
                      updateSegments(nextSegments);
                    }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
        <Button
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={() => updateSegments([...segments, ''])}
          sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
        >
          Adicionar lacuna aqui
        </Button>
        <TextField
          fullWidth
          label="Resposta correta da lacuna"
          value={form.resposta}
          onChange={event => setForm(current => ({ ...current, resposta: event.target.value }))}
        />
      </Stack>
    </Grid>
  );
}

interface MatchingPair {
  left: string;
  right: string;
}

function readMatchingPairs(value: string): MatchingPair[] {
  return value
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const [left = '', right = ''] = line.split('|').map(part => part.trim());
      return { left, right };
    });
}

function MatchingActivityEditor({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  const pairs = readMatchingPairs(form.itens);
  const savePairs = (nextPairs: MatchingPair[]) =>
    setForm(current => ({
      ...current,
      itens: nextPairs.map(pair => `${pair.left} | ${pair.right}`).join('\n'),
    }));

  return (
    <Grid size={12}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
          alignItems={{ sm: 'center' }} gap={1}>
          <Box>
            <Typography fontWeight={850}>Pares que devem ser interligados</Typography>
            <Typography variant="body2" color="text.secondary">
              Preencha os dois lados do par; cada linha já corresponde à sua resposta correta.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => savePairs([...pairs, { left: '', right: '' }])}
            sx={{ textTransform: 'none' }}
          >
            Adicionar par
          </Button>
        </Stack>
        {pairs.map((pair, index) => (
          <Paper key={index} variant="outlined" sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#181818',
          }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid size={{ xs: 12, sm: 5.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={`Coluna A · item ${index + 1}`}
                  value={pair.left}
                  onChange={event => savePairs(pairs.map((item, pairIndex) =>
                    pairIndex === index ? { ...item, left: event.target.value } : item))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 5.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={`Coluna B · correspondência ${index + 1}`}
                  value={pair.right}
                  onChange={event => savePairs(pairs.map((item, pairIndex) =>
                    pairIndex === index ? { ...item, right: event.target.value } : item))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 1 }}>
                <IconButton
                  color="error"
                  aria-label={`Excluir par ${index + 1}`}
                  onClick={() => savePairs(pairs.filter((_item, pairIndex) => pairIndex !== index))}
                >
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
        {pairs.length === 0 && (
          <Typography color="text.secondary" textAlign="center">
            Adicione o primeiro par de itens.
          </Typography>
        )}
      </Stack>
    </Grid>
  );
}

function SelectWordsActivityEditor({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  const selectedWords = lines(form.itens);
  const words = form.enunciado.split(/\s+/).map(word => word.trim()).filter(Boolean);
  const normalized = (word: string) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  const toggleWord = (word: string) => {
    const cleanWord = normalized(word);
    const nextWords = selectedWords.includes(cleanWord)
      ? selectedWords.filter(item => item !== cleanWord)
      : [...selectedWords, cleanWord];
    setForm(current => ({ ...current, itens: nextWords.filter(Boolean).join('\n') }));
  };

  return (
    <Grid size={12}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Texto que o aluno verá"
          value={form.enunciado}
          onChange={event => {
            const nextText = event.target.value;
            const availableWords = nextText.split(/\s+/).map(normalized);
            setForm(current => ({
              ...current,
              enunciado: nextText,
              itens: lines(current.itens).filter(word => availableWords.includes(word)).join('\n'),
            }));
          }}
        />
        <Box>
          <Typography fontWeight={850}>Clique nas palavras que serão consideradas corretas</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            As palavras azuis são as que o aluno deverá selecionar.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {words.length ? words.map((word, index) => {
              const cleanWord = normalized(word);
              const selected = selectedWords.includes(cleanWord);
              return (
                <Chip
                  key={`${word}-${index}`}
                  label={word}
                  clickable
                  color={selected ? 'primary' : 'default'}
                  variant={selected ? 'filled' : 'outlined'}
                  onClick={() => toggleWord(word)}
                />
              );
            }) : (
              <Typography color="text.secondary">Digite o texto acima para selecionar as palavras.</Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Grid>
  );
}

function WordListActivityEditor({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  const answers = form.itens ? form.itens.split('\n') : [];
  const fieldCount = Math.max(1, Number(form.resposta) || answers.length || 1);
  const saveAnswers = (nextAnswers: string[]) =>
    setForm(current => ({ ...current, itens: nextAnswers.join('\n') }));

  return (
    <Grid size={12}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
          alignItems={{ sm: 'center' }} gap={1}>
          <Box>
            <Typography fontWeight={850}>Respostas aceitas</Typography>
            <Typography variant="body2" color="text.secondary">
              Adicione cada palavra ou expressão que poderá ser aceita.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => saveAnswers([...answers, `Resposta ${answers.length + 1}`])}
            sx={{ textTransform: 'none' }}
          >
            Adicionar resposta
          </Button>
        </Stack>
        {answers.map((answer, index) => (
          <Stack key={index} direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              size="small"
              label={`Resposta aceita ${index + 1}`}
              value={answer}
              onChange={event => {
                const nextAnswers = [...answers];
                nextAnswers[index] = event.target.value;
                saveAnswers(nextAnswers);
              }}
            />
            <IconButton
              color="error"
              aria-label={`Excluir resposta ${index + 1}`}
              onClick={() => saveAnswers(answers.filter((_item, answerIndex) => answerIndex !== index))}
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Stack>
        ))}
        <Paper variant="outlined" sx={{
          p: 1.5,
          borderRadius: 3,
          bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#181818',
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
            <Box>
              <Typography fontWeight={800}>Campos exibidos ao aluno</Typography>
              <Typography variant="body2" color="text.secondary">
                Quantas respostas o aluno deverá escrever.
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button
                variant="outlined"
                disabled={fieldCount <= 1}
                onClick={() => setForm(current => ({ ...current, resposta: String(fieldCount - 1) }))}
              >
                −
              </Button>
              <Chip label={fieldCount} color="primary" />
              <Button
                variant="outlined"
                onClick={() => setForm(current => ({ ...current, resposta: String(fieldCount + 1) }))}
              >
                +
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Grid>
  );
}

interface SubstitutionRule {
  word: string;
  options: string[];
  correct: string;
}

function readSubstitutionRules(value: string): SubstitutionRule[] {
  return value
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const [word = '', options = '', correct = ''] = line.split('|').map(part => part.trim());
      const parsedOptions = options.split(',').map(option => option.trim());
      return {
        word,
        options: parsedOptions.length >= 2 ? parsedOptions : [...parsedOptions, ''].slice(0, 2),
        correct,
      };
    });
}

function writeSubstitutionRules(rules: SubstitutionRule[]) {
  return rules
    .map(rule => `${rule.word.trim()} | ${rule.options.map(option => option.trim()).join(', ')} | ${rule.correct.trim()}`)
    .join('\n');
}

function plainSubstitutionText(value: string) {
  return value.replace(/\[([^\]]+)\]/g, '$1');
}

function markSubstitutionWords(text: string, rules: SubstitutionRule[]) {
  let markedText = plainSubstitutionText(text);
  rules
    .map(rule => rule.word.trim())
    .filter(Boolean)
    .forEach(word => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(^|\\b)${escapedWord}(?=\\b|$)`, 'i');
      markedText = markedText.replace(pattern, match => {
        const prefix = match.length > word.length ? match.slice(0, match.length - word.length) : '';
        return `${prefix}[${word}]`;
      });
    });
  return markedText;
}

function SubstitutionActivityEditor({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  const rules = readSubstitutionRules(form.itens);
  const plainText = plainSubstitutionText(form.enunciado);

  const saveRules = (nextRules: SubstitutionRule[]) => {
    setForm(current => ({
      ...current,
      enunciado: markSubstitutionWords(current.enunciado, nextRules),
      itens: writeSubstitutionRules(nextRules),
    }));
  };

  const updateRule = (index: number, changes: Partial<SubstitutionRule>) => {
    saveRules(rules.map((rule, ruleIndex) =>
      ruleIndex === index ? { ...rule, ...changes } : rule));
  };

  return (
    <Grid size={12}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Texto da atividade"
          value={plainText}
          onChange={event => setForm(current => ({
            ...current,
            enunciado: markSubstitutionWords(event.target.value, readSubstitutionRules(current.itens)),
          }))}
          placeholder="Ex.: They are my friends and I see them every day."
          helperText="Escreva normalmente, sem colchetes ou códigos."
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}
          justifyContent="space-between" gap={1}>
          <Box>
            <Typography fontWeight={850}>Palavras substituíveis</Typography>
            <Typography variant="body2" color="text.secondary">
              Crie um cartão para cada palavra do texto que o aluno deverá trocar.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => saveRules([
              ...rules,
              { word: '', options: ['', ''], correct: '' },
            ])}
            sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            Adicionar palavra
          </Button>
        </Stack>

        {rules.length === 0 ? (
          <Paper variant="outlined" sx={{
            p: 2.5,
            textAlign: 'center',
            borderRadius: 3,
            borderStyle: 'dashed',
            bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#181818',
          }}>
            <Typography color="text.secondary">
              Clique em “Adicionar palavra” para montar a primeira substituição.
            </Typography>
          </Paper>
        ) : rules.map((rule, index) => {
          const wordExists = !rule.word.trim()
            || plainText.toLocaleLowerCase().includes(rule.word.trim().toLocaleLowerCase());
          const availableOptions = rule.options.filter(option => option.trim());
          return (
            <Paper key={index} variant="outlined" sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: theme => theme.palette.mode === 'light' ? '#404E7C' : '#181818',
              borderColor: wordExists ? '#3e5874' : 'error.main',
            }}>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
                <Chip size="small" label={`Palavra ${index + 1}`} color="primary" variant="outlined" />
                <Box flex={1} />
                <IconButton
                  size="small"
                  color="error"
                  aria-label={`Excluir palavra ${index + 1}`}
                  onClick={() => saveRules(rules.filter((_rule, ruleIndex) => ruleIndex !== index))}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Palavra que está no texto"
                    value={rule.word}
                    error={!wordExists}
                    helperText={!wordExists ? 'Não encontramos essa palavra no texto acima.' : ' '}
                    onChange={event => updateRule(index, { word: event.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    {rule.options.map((option, optionIndex) => (
                      <TextField
                        key={optionIndex}
                        fullWidth
                        size="small"
                        label={`Opção ${optionIndex + 1}`}
                        value={option}
                        onChange={event => {
                          const options = [...rule.options];
                          options[optionIndex] = event.target.value;
                          updateRule(index, {
                            options,
                            correct: rule.correct === option ? event.target.value : rule.correct,
                          });
                        }}
                      />
                    ))}
                    <IconButton
                      size="small"
                      aria-label="Adicionar opção"
                      onClick={() => updateRule(index, { options: [...rule.options, ''] })}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Resposta correta</InputLabel>
                    <Select
                      label="Resposta correta"
                      value={availableOptions.includes(rule.correct) ? rule.correct : ''}
                      onChange={event => updateRule(index, { correct: event.target.value })}
                    >
                      {availableOptions.map((option, optionIndex) => (
                        <MenuItem key={`${option}-${optionIndex}`} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </Stack>
    </Grid>
  );
}

function ActivityFields({
  form,
  setForm,
}: {
  form: ContentFormState;
  setForm: Dispatch<SetStateAction<ContentFormState>>;
}) {
  if (form.etapa === 'PRATICA') {
    switch (form.tipo) {
      case 'MULTIPLA_ESCOLHA':
        return <MultipleChoiceActivityEditor form={form} setForm={setForm} />;
      case 'PREENCHER_LACUNA':
        return <FillBlankActivityEditor form={form} setForm={setForm} />;
      case 'LISTA_PALAVRAS':
        return <WordListActivityEditor form={form} setForm={setForm} />;
      case 'SELECIONAR_PALAVRAS':
        return <SelectWordsActivityEditor form={form} setForm={setForm} />;
      case 'RELACIONAR_COLUNAS':
        return <MatchingActivityEditor form={form} setForm={setForm} />;
      case 'SUBSTITUIR_PALAVRAS':
        return <SubstitutionActivityEditor form={form} setForm={setForm} />;
      default:
        break;
    }
  }

  const labels = (() => {
    if (form.etapa === 'PRODUCTION') {
      if (form.tipo === 'AUDIO') return ['Texto com lacunas (use ___)', 'Subtítulo ou orientação', ''];
      if (form.tipo === 'FOTO_E_TEXTO') return ['', '', 'Mínimo de palavras'];
      if (form.tipo === 'UPLOAD_ARQUIVO') return ['', 'Formatos aceitos, um por linha', ''];
      if (form.tipo === 'COMPLETAR_IMAGEM') return ['', '', 'Quantidade de campos'];
      return ['', '', 'Mínimo de palavras'];
    }
    switch (form.tipo) {
      case 'MULTIPLA_ESCOLHA': return ['Pergunta', 'Opções, uma por linha', 'Resposta correta'];
      case 'PREENCHER_LACUNA': return ['Frase da atividade', '', 'Resposta correta'];
      case 'LISTA_PALAVRAS': return ['', 'Respostas aceitas', 'Quantidade de campos'];
      case 'SELECIONAR_PALAVRAS': return ['Texto da atividade', 'Palavras corretas', ''];
      case 'RELACIONAR_COLUNAS': return ['', 'Pares de colunas', ''];
      case 'SUBSTITUIR_PALAVRAS': return ['Texto da atividade', 'Opções de substituição', ''];
      default: return ['Enunciado', 'Itens', 'Resposta'];
    }
  })();

  return (
    <>
      {labels[0] && <Grid size={12}>
        <TextField fullWidth multiline minRows={2} label={labels[0]} value={form.enunciado}
          onChange={event => setForm(current => ({ ...current, enunciado: event.target.value }))} />
      </Grid>}
      {labels[1] && <Grid size={12}>
        <TextField fullWidth multiline minRows={3} label={labels[1]} value={form.itens}
          onChange={event => setForm(current => ({ ...current, itens: event.target.value }))} />
      </Grid>}
      {labels[2] && <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label={labels[2]} value={form.resposta}
          onChange={event => setForm(current => ({ ...current, resposta: event.target.value }))} />
      </Grid>}
    </>
  );
}
