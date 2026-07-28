import { Alert, Box, Typography, CircularProgress } from '@mui/material';
import { useModule } from '../../contexts/ModuleContext';
import MidiaAndTranscption from './MidiaAndTranscption';

// Practice Components
import PracticeMarcarContent from '../Practice/PracticeMarcar/PracticeContent';
import PracticeCompletarContent from '../Practice/Completar/PracticeCompletarContent';
import PracticeSelecionarContent from '../Practice/Selecionar/PracticeSelecionarContent';
import PracticeListaContent from '../Practice/Lista/PracticeListaContent';


// Production Components
import ProductionArquivoContent from '../Production/Arquivo/ProductionArquivoContent';
import ProductionOuvirCompletarContent from '../Production/OuvirCompletar/ProductionOuvirCompletarContent';
import ProductionOuvirTextoContent from '../Production/OuvirTexto/ProductionOuvirTextoContent';
import ProductionPostagemContent from '../Production/Postagem/ProductionPostagemContent';
// Removed: ProductionRelacionarContent
// Removed: ProductionSubstituirContent
import ProductionTextoContent from '../Production/Texto/ProductionTextoContent';
import PracticeRelacionarContent from '../Practice/Relacionar/PracticeRelacionarContent';
import PracticeSubstituirContent from '../Practice/Substituir/PracticeSubstituirContent';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ActivityMedia from '../ActivityMedia/ActivityMedia';


export default function ModuleItemViewer() {
    const { loading, activeItem, productionSubmissionVersion } = useModule();
    const { user } = useAuth();
    const [latestReview, setLatestReview] = useState<{
        statusCorrecao?: 'PENDENTE' | 'APROVADA' | 'AJUSTES_SOLICITADOS';
        feedbackProfessor?: string;
        xpConcedido?: boolean;
    } | null>(null);

    useEffect(() => {
        if (activeItem?.type !== 'production' || !user) {
            return;
        }
        api.get<Array<{
            challenge: { id: number };
            statusCorrecao?: 'PENDENTE' | 'APROVADA' | 'AJUSTES_SOLICITADOS';
            feedbackProfessor?: string;
            xpConcedido?: boolean;
            dataSubmissao: string;
        }>>('/submissoes/minhas')
            .then(response => {
                const latest = response.data
                    .filter(item => item.challenge.id === activeItem.data.id)
                    .sort((a, b) => b.dataSubmissao.localeCompare(a.dataSubmissao))[0] ?? null;
                setLatestReview(latest);
            })
            .catch(() => setLatestReview(null));
    }, [activeItem, user, productionSubmissionVersion]);

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (!activeItem) {
        return (
            <Box sx={{ p: 4, backgroundColor: (theme) => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828', color: '#e0e0e0', borderRadius: '14px', textAlign: 'center' }}>
                <Typography variant="h5">Nenhum conteúdo selecionado.</Typography>
                <Typography>Selecione um item na barra lateral para começar.</Typography>
            </Box>
        );
    }

    switch (activeItem.type) {
        case 'presentation':
            return <MidiaAndTranscption />;
        case 'practice':
            { const practiceData = activeItem.data;
            const practiceMediaUrl = typeof practiceData.dadosAtividade?.media_url === 'string'
                ? practiceData.dadosAtividade.media_url
                : '';
            const withPracticeMedia = (content: ReactNode) => (
                <Box sx={{ width: '100%' }}>
                    {practiceMediaUrl.startsWith('/api/files/content/') && (
                        <ActivityMedia url={practiceMediaUrl} />
                    )}
                    {content}
                </Box>
            );
            switch (practiceData.tipoAtividade) {
                case 'SELECIONAR_PALAVRAS':
                    return withPracticeMedia(<PracticeSelecionarContent data={practiceData} />);
                case 'PREENCHER_LACUNA':
                    return withPracticeMedia(<PracticeCompletarContent data={practiceData} />);
                case 'MULTIPLA_ESCOLHA':
                    return withPracticeMedia(<PracticeMarcarContent data={practiceData} />);
                case 'LISTA_PALAVRAS':
                    return withPracticeMedia(<PracticeListaContent data={practiceData} />);
                case 'RELACIONAR_COLUNAS': // Moved from Production
                    return withPracticeMedia(<PracticeRelacionarContent data={practiceData} />);
                case 'SUBSTITUIR_PALAVRAS': // Moved from Production
                    return withPracticeMedia(<PracticeSubstituirContent data={practiceData} />);
                default:
                    return (
                        <Box sx={{ p: 4, backgroundColor: (theme) => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828', color: '#e0e0e0', borderRadius: '14px', textAlign: 'center' }}>
                            <Typography variant="h5">Unknown Practice: {practiceData.tipoAtividade}</Typography>
                        </Box>
                    );
            } }
        case 'production':
            { const productionData = activeItem.data;
            const productionMediaUrl = typeof productionData.midiaDesafioUrl === 'string'
                ? productionData.midiaDesafioUrl
                : '';
            const imageUrl = typeof productionData.dadosDesafio?.imageUrl === 'string'
                ? productionData.dadosDesafio.imageUrl
                : '';
            const shouldShowUploadedMedia = productionMediaUrl.startsWith('/api/files/content/')
                && !(productionData.tipoDesafio === 'COMPLETAR_IMAGEM' && imageUrl === productionMediaUrl);
            const withTeacherNotice = (content: ReactNode) => (
                <Box sx={{ width: '100%' }}>
                    <Alert
                        severity={latestReview?.statusCorrecao === 'APROVADA'
                            ? 'success'
                            : latestReview?.statusCorrecao === 'AJUSTES_SOLICITADOS' ? 'warning' : 'info'}
                        sx={{ mb: 2, borderRadius: 3 }}
                    >
                        {latestReview?.statusCorrecao === 'APROVADA'
                            ? <><strong>Production aprovada!</strong> O XP foi liberado pelo seu professor.</>
                            : latestReview?.statusCorrecao === 'AJUSTES_SOLICITADOS'
                                ? <><strong>Seu professor solicitou ajustes.</strong>{latestReview.feedbackProfessor ? ` ${latestReview.feedbackProfessor}` : ''}</>
                                : latestReview?.statusCorrecao === 'PENDENTE'
                                    ? <><strong>Production enviada e aguardando correção.</strong> O XP será liberado após a aprovação.</>
                                    : <><strong>O XP desta Production será liberado após a correção do seu professor.</strong>{' '}Você poderá receber feedback ou uma solicitação de ajustes.</>}
                    </Alert>
                    {shouldShowUploadedMedia && <ActivityMedia url={productionMediaUrl} />}
                    {content}
                </Box>
            );
            switch (productionData.tipoDesafio) {
                case 'TEXTO_LONGO':
                    return withTeacherNotice(<ProductionTextoContent data={productionData} />);
                case 'FOTO_E_TEXTO':
                    return withTeacherNotice(<ProductionPostagemContent data={productionData} />);
                // Removed: case 'RELACIONAR_COLUNAS'
                case 'AUDIO':
                    return withTeacherNotice(<ProductionOuvirTextoContent data={productionData} />);
                case 'COMPLETAR_IMAGEM':
                    return withTeacherNotice(<ProductionOuvirCompletarContent data={productionData} />);
                // Removed: case 'SUBSTITUIR_PALAVRAS'
                case 'UPLOAD_ARQUIVO':
                    return withTeacherNotice(<ProductionArquivoContent data={productionData} />);
                default:
                    return (
                        <Box sx={{ p: 4, backgroundColor: (theme) => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828', color: '#e0e0e0', borderRadius: '14px', textAlign: 'center' }}>
                            <Typography variant="h5">Unknown Production: {productionData.tipoDesafio}</Typography>
                        </Box>
                    );
            } }
        default:
            return (
                <Box sx={{ p: 4, backgroundColor: (theme) => theme.palette.mode === 'light' ? '#1B2A4A' : '#282828', color: '#e0e0e0', borderRadius: '14px', textAlign: 'center' }}>
                    <Typography variant="h5">Unknown Item Type.</Typography>
                </Box>
            );
    }
}
