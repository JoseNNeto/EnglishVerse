
import { Box, Typography, CircularProgress } from '@mui/material';
import { useModule } from '../../contexts/ModuleContext';
import MidiaAndTranscption from './MidiaAndTranscption';
import PracticeMarcarContent from '../Practice/PracticeMarcar/PracticeContent';
import PracticeCompletarContent from '../Practice/Completar/PracticeCompletarContent';
import PracticeSelecionarContent from '../Practice/Selecionar/PracticeSelecionarContent';
import PracticeListaContent from '../Practice/Lista/PracticeListaContent';

// Production Components
import ProductionArquivoContent from '../Production/Arquivo/ProductionArquivoContent';
import ProductionOuvirCompletarContent from '../Production/OuvirCompletar/ProductionOuvirCompletarContent';
import ProductionOuvirTextoContent from '../Production/OuvirTexto/ProductionOuvirTextoContent';
import ProductionPostagemContent from '../Production/Postagem/ProductionPostagemContent';
import ProductionRelacionarContent from '../Production/Relacionar/ProductionRelacionarContent';
import ProductionSubstituirContent from '../Production/Substituir/ProductionSubstituirContent';
import ProductionTextoContent from '../Production/Texto/ProductionTextoContent';


export default function ModuleItemViewer() {
    const { loading, activeItem, allItems } = useModule();

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

    const activeItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
    const isLast = activeItemIndex === allItems.length - 1;

    switch (activeItem.type) {
        case 'presentation':
            return <MidiaAndTranscption />;
        case 'practice':
            const practiceData = activeItem.data;
            const practiceKey = `practice-${practiceData.id}`;
            switch (practiceData.tipoAtividade) {
                case 'SELECIONAR_PALAVRAS':
                    return <PracticeSelecionarContent key={practiceKey} data={practiceData} />;
                case 'PREENCHER_LACUNA':
                    return <PracticeCompletarContent key={practiceKey} data={practiceData} />;
                case 'MULTIPLA_ESCOLHA':
                    return <PracticeMarcarContent key={practiceKey} data={practiceData} />;
                case 'LISTA_PALAVRAS':
                    return <PracticeListaContent key={practiceKey} data={practiceData} />;
                default:
                    return (
                        <Box sx={{ p: 4, backgroundColor: '#1a1a1a', color: 'white', borderRadius: '14px', textAlign: 'center' }}>
                            <Typography variant="h5">Tipo de prática desconhecido: {practiceData.tipoAtividade}</Typography>
                        </Box>
                    );
            }
        case 'production':
            const productionData = activeItem.data;
            const productionKey = `production-${productionData.id}`;
            switch (productionData.tipoDesafio) {
                case 'TEXTO_LONGO':
                    return <ProductionTextoContent key={productionKey} data={productionData} isLast={isLast} />;
                case 'FOTO_E_TEXTO':
                    return <ProductionPostagemContent key={productionKey} data={productionData} isLast={isLast} />;
                case 'RELACIONAR_COLUNAS':
                    return <ProductionRelacionarContent key={productionKey} data={productionData} isLast={isLast} />;
                case 'AUDIO':
                    return <ProductionOuvirTextoContent key={productionKey} data={productionData} isLast={isLast} />;
                case 'COMPLETAR_IMAGEM':
                    return <ProductionOuvirCompletarContent key={productionKey} data={productionData} isLast={isLast} />;
                case 'SUBSTITUIR_PALAVRAS':
                    return <ProductionSubstituirContent key={productionKey} data={productionData} isLast={isLast} />;
                case 'UPLOAD_ARQUIVO':
                    return <ProductionArquivoContent key={productionKey} data={productionData} isLast={isLast} />;
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

