import { Box, Typography, CircularProgress } from '@mui/material';
import { useModule } from '../../contexts/ModuleContext';
import MidiaAndTranscption from './MidiaAndTranscption';

// Practice Components
import PracticeMarcarContent from '../Practice/PracticeMarcar/PracticeContent';
import PracticeCompletarContent from '../Practice/Completar/PracticeCompletarContent';
import PracticeSelecionarContent from '../Practice/Selecionar/PracticeSelecionarContent';
import PracticeListaContent from '../Practice/Lista/PracticeListaContent';
import PracticeRelacionarContent from '../Practice/Relacionar/PracticeRelacionarContent'; // New Import
import PracticeSubstituirContent from '../Practice/Substituir/PracticeSubstituirContent'; // New Import

// Production Components
import ProductionArquivoContent from '../Production/Arquivo/ProductionArquivoContent';
import ProductionOuvirCompletarContent from '../Production/OuvirCompletar/ProductionOuvirCompletarContent';
import ProductionOuvirTextoContent from '../Production/OuvirTexto/ProductionOuvirTextoContent';
import ProductionPostagemContent from '../Production/Postagem/ProductionPostagemContent';
// Removed: ProductionRelacionarContent
// Removed: ProductionSubstituirContent
import ProductionTextoContent from '../Production/Texto/ProductionTextoContent';


export default function ModuleItemViewer() {
    const { loading, activeItem } = useModule();

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (!activeItem) {
        return (
            <Box sx={{ p: 4, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', textAlign: 'center' }}>
                <Typography variant="h5">Nenhum conteúdo selecionado.</Typography>
                <Typography>Selecione um item na barra lateral para começar.</Typography>
            </Box>
        );
    }

    switch (activeItem.type) {
        case 'presentation':
            return <MidiaAndTranscption />;
        case 'practice':
            const practiceData = activeItem.data;
            switch (practiceData.tipoAtividade) {
                case 'SELECIONAR_PALAVRAS':
                    return <PracticeSelecionarContent data={practiceData} />;
                case 'PREENCHER_LACUNA':
                    return <PracticeCompletarContent data={practiceData} />;
                case 'MULTIPLA_ESCOLHA':
                    return <PracticeMarcarContent data={practiceData} />;
                case 'LISTA_PALAVRAS':
                    return <PracticeListaContent data={practiceData} />;
                case 'RELACIONAR_COLUNAS': // Moved from Production
                    return <PracticeRelacionarContent data={practiceData} />;
                case 'SUBSTITUIR_PALAVRAS': // Moved from Production
                    return <PracticeSubstituirContent data={practiceData} />;
                default:
                    return (
                        <Box sx={{ p: 4, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', textAlign: 'center' }}>
                            <Typography variant="h5">Tipo de prática desconhecido: {practiceData.tipoAtividade}</Typography>
                        </Box>
                    );
            }
        case 'production':
            const productionData = activeItem.data;
            switch (productionData.tipoDesafio) {
                case 'TEXTO_LONGO':
                    return <ProductionTextoContent data={productionData} />;
                case 'FOTO_E_TEXTO':
                    return <ProductionPostagemContent data={productionData} />;
                // Removed: case 'RELACIONAR_COLUNAS'
                case 'AUDIO':
                    return <ProductionOuvirTextoContent data={productionData} />;
                case 'COMPLETAR_IMAGEM':
                    return <ProductionOuvirCompletarContent data={productionData} />;
                // Removed: case 'SUBSTITUIR_PALAVRAS'
                case 'UPLOAD_ARQUIVO':
                    return <ProductionArquivoContent data={productionData} />;
                default:
                    return (
                        <Box sx={{ p: 4, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', textAlign: 'center' }}>
                            <Typography variant="h5">Tipo de desafio desconhecido: {productionData.tipoDesafio}</Typography>
                        </Box>
                    );
            }
        default:
            return (
                <Box sx={{ p: 4, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', textAlign: 'center' }}>
                    <Typography variant="h5">Tipo de item desconhecido.</Typography>
                </Box>
            );
    }
}
