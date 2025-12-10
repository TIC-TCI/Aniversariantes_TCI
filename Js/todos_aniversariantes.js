/**
 * ============================================
 * SISTEMA DE ANIVERSARIANTES TCI
 * JavaScript da Página "Todos os Aniversariantes"
 * ============================================
 */

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let dadosCompletos = [];
let mesAtualSelecionado = new Date().getMonth() + 1;

// Nomes dos meses em português
const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Lista de arquivos para buscar
const nomesPlanilha = [
    'aniversariantes.csv',
    'Data/dados.csv',
    'colaboradores.csv',
    'funcionarios.csv',
    'pessoas.csv'
];

// Departamentos válidos
const departamentosValidos = [
    'Diretoria',
    'Administrativo',
    'Engenharia',
    'Jurídico',
    'Financeiro',
    'Suprimentos',
    'Recursos Humanos / Pessoal',
    'Recursos Humanos',
    'Pessoal',
    'Contábil / Fiscal',
    'Contábil',
    'Fiscal',
    'Tecnologia e Comunicação'
];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Formata data DD/MM/AAAA para DD/MM
 */
function formatarData(dataStr) {
    const partes = dataStr.split('/');
    if (partes.length === 3) {
        return `${partes[0]}/${partes[1]}`;
    }
    return dataStr;
}

/**
 * Obtém iniciais do nome para o avatar
 */
function obterIniciais(nome) {
    return nome.split(' ')
        .map(parte => parte.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

/**
 * Converte URL do Google Drive para formato de imagem direta
 * Suporta vários formatos de URL do Google Drive
 */
function converterURLGoogleDrive(url) {
    if (!url || !url.trim()) return '';

    url = url.trim();

    // Se não for URL do Google Drive, retornar como está
    if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) {
        return url;
    }

    // Extrair ID do arquivo de diferentes formatos de URL
    let fileId = null;

    // Formato: https://drive.google.com/file/d/FILE_ID/view
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) {
        fileId = match1[1];
    }

    // Formato: https://drive.google.com/open?id=FILE_ID
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) {
        fileId = match2[1];
    }

    // Formato: https://drive.google.com/uc?id=FILE_ID
    const match3 = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
    if (match3) {
        fileId = match3[1];
    }

    // Formato: https://drive.google.com/thumbnail?id=FILE_ID
    const match4 = url.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
    if (match4) {
        fileId = match4[1];
    }

    // Se encontrou o ID, usar proxy CORS-friendly
    if (fileId) {
        // Usar lh3.googleusercontent.com que tem melhor suporte CORS
        return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
    }

    // Se já estiver no formato correto, retornar
    if (url.includes('googleusercontent.com') || url.includes('/thumbnail?') || url.includes('/uc?export=view')) {
        return url;
    }

    // Caso não consiga extrair, retornar URL original
    return url;
}

// ============================================
// FUNÇÕES DE INTERFACE
// ============================================

/**
 * Atualiza informações do mês selecionado
 */
function atualizarInfoMes() {
    const nomesMes = mesesNomes[mesAtualSelecionado - 1];
    const anoAtual = new Date().getFullYear();

    document.getElementById('current-month-display').textContent = nomesMes + ' ' + anoAtual;
    document.getElementById('month-select').value = mesAtualSelecionado;

    const aniversariantesMes = filtrarAniversariantesMes();
    document.getElementById('month-description').textContent =
        `${aniversariantesMes.length} aniversariante(s) neste mês`;
}

/**
 * Altera o mês exibido (navegação com setas)
 */
function alterarMes(direcao) {
    mesAtualSelecionado += direcao;

    if (mesAtualSelecionado > 12) {
        mesAtualSelecionado = 1;
    } else if (mesAtualSelecionado < 1) {
        mesAtualSelecionado = 12;
    }

    atualizarInfoMes();
    exibirAniversariantes();
}

/**
 * Seleciona mês via dropdown
 */
function selecionarMes() {
    mesAtualSelecionado = parseInt(document.getElementById('month-select').value);
    atualizarInfoMes();
    exibirAniversariantes();
}

/**
 * Cria um card de aniversariante
 */
function criarCardAniversariante(pessoa) {
    const card = document.createElement('div');
    card.className = 'aniversariante-card';

    const dataFormatada = formatarData(pessoa.Data);
    const iniciais = obterIniciais(pessoa.Nome);

    // Converter URL do Google Drive se necessário
    const urlFoto = converterURLGoogleDrive(pessoa.Foto);

    card.innerHTML = `
        <div class="foto-container">
            ${urlFoto ? 
                `<img src="${urlFoto}" 
                      alt="${pessoa.Nome}" 
                      class="foto" 
                      loading="lazy"
                      referrerpolicy="no-referrer"
                      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                 <div class="foto-placeholder" style="display: none;">${iniciais}</div>` :
                `<div class="foto-placeholder">${iniciais}</div>`
            }
        </div>
        <div class="info">
            <h3>${pessoa.Nome}</h3>
            <p>🏢 ${pessoa.Departamento}</p>
            <p>💼 ${pessoa.Cargo}</p>
            <div class="data-aniversario">🎂 ${dataFormatada}</div>
        </div>
    `;
    
    return card;
}

/**
 * Filtra aniversariantes do mês selecionado
 */
function filtrarAniversariantesMes() {
    return dadosCompletos.filter(pessoa => {
        if (!pessoa.Data) return false;
        
        const partes = pessoa.Data.split('/');
        if (partes.length >= 2) {
            const mesPessoa = parseInt(partes[1]);
            return mesPessoa === mesAtualSelecionado;
        }
        return false;
    });
}

/**
 * Exibe os aniversariantes na tela
 */
function exibirAniversariantes() {
    const container = document.getElementById('aniversariantes');
    const contadorContainer = document.getElementById('contador-container');
    const aniversariantesMes = filtrarAniversariantesMes();
    
    container.innerHTML = '';
    
    if (aniversariantesMes.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <h3>🎭 Nenhum aniversariante</h3>
                <p>Não há aniversários em ${mesesNomes[mesAtualSelecionado - 1]}.</p>
            </div>
        `;
        contadorContainer.style.display = 'none';
        return;
    }

    // Ocultar contador
    contadorContainer.style.display = 'none';

    // Ordenar por dia do mês
    aniversariantesMes.sort((a, b) => {
        const diaA = parseInt(a.Data.split('/')[0]);
        const diaB = parseInt(b.Data.split('/')[0]);
        return diaA - diaB;
    });

    // Mostrar todos os aniversariantes do mês
    aniversariantesMes.forEach(pessoa => {
        const card = criarCardAniversariante(pessoa);
        container.appendChild(card);
    });
}

/**
 * Mostra mensagem de erro
 */
function mostrarErro(mensagem) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-message').textContent = mensagem;
    document.getElementById('error').style.display = 'block';
}

// ============================================
// PROCESSAMENTO DE DADOS
// ============================================

/**
 * Valida se o departamento é válido
 */
function validarDepartamento(departamento) {
    if (!departamento) return false;
    
    const deptNormalizado = departamento.trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    
    return departamentosValidos.some(deptValido => {
        const validoNormalizado = deptValido
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        
        return deptNormalizado === validoNormalizado || 
               deptNormalizado.includes(validoNormalizado) ||
               validoNormalizado.includes(deptNormalizado);
    });
}

/**
 * Processa uma linha do CSV
 */
function processarLinha(linha, separador) {
    if (separador === '\t') {
        return linha.split('\t').map(col => col.trim().replace(/^"|"$/g, ''));
    } else {
        const colunas = [];
        let colunaAtual = '';
        let dentroAspas = false;
        
        for (let i = 0; i < linha.length; i++) {
            const char = linha[i];
            
            if (char === '"') {
                dentroAspas = !dentroAspas;
            } else if (char === separador && !dentroAspas) {
                colunas.push(colunaAtual.trim().replace(/^"|"$/g, ''));
                colunaAtual = '';
            } else {
                colunaAtual += char;
            }
        }
        
        colunas.push(colunaAtual.trim().replace(/^"|"$/g, ''));
        return colunas;
    }
}

/**
 * Processa dados do CSV
 */
function processarDados(linhas, separador) {
    // Processar cabeçalho
    const cabecalho = processarLinha(linhas[0], separador)
        .map(col => col.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    
    // Mapear colunas
    const colunaIndices = {
        nome: cabecalho.findIndex(col => 
            col.includes('nome') || col.includes('name')),
        departamento: cabecalho.findIndex(col => 
            col.includes('departamento') || col.includes('setor') || col.includes('department')),
        cargo: cabecalho.findIndex(col => 
            col.includes('cargo') || col.includes('funcao') || col.includes('função') || col.includes('position')),
        data: cabecalho.findIndex(col => 
            col.includes('data') || col.includes('nascimento') || col.includes('aniversario') || col.includes('birthday')),
        foto: cabecalho.findIndex(col => 
            col.includes('foto') || col.includes('imagem') || col.includes('photo'))
    };

    // Verificar colunas obrigatórias
    const colunasObrigatorias = ['nome', 'departamento', 'cargo', 'data'];
    const colunasNaoEncontradas = colunasObrigatorias.filter(nome => colunaIndices[nome] === -1);

    if (colunasNaoEncontradas.length > 0) {
        throw new Error(`Colunas obrigatórias não encontradas: ${colunasNaoEncontradas.join(', ')}. Verifique se sua planilha tem as colunas: Nome, Departamento, Cargo, Data`);
    }

    // Processar dados
    const dados = [];
    const registrosIgnorados = [];
    
    for (let i = 1; i < linhas.length; i++) {
        const colunas = processarLinha(linhas[i], separador);
        
        if (colunas.length > 0 && colunas[0] && colunas[0].trim()) {
            const pessoa = {
                Nome: (colunas[colunaIndices.nome] || '').trim(),
                Departamento: (colunas[colunaIndices.departamento] || '').trim(),
                Cargo: (colunas[colunaIndices.cargo] || '').trim(),
                Data: (colunas[colunaIndices.data] || '').trim(),
                // Converter URL do Google Drive automaticamente
                Foto: colunaIndices.foto !== -1 ? 
                      converterURLGoogleDrive(colunas[colunaIndices.foto] || '') : ''
            };
            
            if (pessoa.Nome && validarDepartamento(pessoa.Departamento)) {
                dados.push(pessoa);
            } else if (pessoa.Nome) {
                registrosIgnorados.push(`${pessoa.Nome} (${pessoa.Departamento})`);
            }
        }
    }

    // Log dos registros ignorados
    if (registrosIgnorados.length > 0) {
        console.log('Registros ignorados por departamento inválido:', registrosIgnorados);
    }

    return dados;
}

/**
 * Processa o conteúdo do CSV
 */
function processarCSV(csvText) {
    if (!csvText || csvText.trim().length === 0) {
        throw new Error('Arquivo CSV vazio');
    }
    
    // Detectar separador
    const primeiraLinha = csvText.split('\n')[0] || '';
    const separador = primeiraLinha.includes(';') ? ';' : 
                     primeiraLinha.includes('\t') ? '\t' : ',';
    
    // Processar linhas
    const linhas = csvText.split('\n')
        .map(linha => linha.trim())
        .filter(linha => linha.length > 0);
    
    if (linhas.length < 2) {
        throw new Error('O arquivo deve ter pelo menos um cabeçalho e uma linha de dados.');
    }

    return processarDados(linhas, separador);
}

// ============================================
// CARREGAMENTO DE DADOS
// ============================================

/**
 * Carrega dados do arquivo CSV
 */
async function carregarDados() {
    try {
        let arquivoEncontrado = null;
        let csvContent = null;
        
        // Tentar carregar cada arquivo da lista
        for (const nomeArquivo of nomesPlanilha) {
            try {
                const response = await fetch(nomeArquivo);
                
                if (response.ok) {
                    csvContent = await response.text();
                    
                    if (csvContent && csvContent.trim().length > 0) {
                        arquivoEncontrado = nomeArquivo;
                        break;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        
        if (!arquivoEncontrado) {
            throw new Error(`Nenhuma planilha encontrada. Certifique-se de que existe um arquivo CSV na pasta com um dos nomes: ${nomesPlanilha.join(', ')}`);
        }
        
        dadosCompletos = processarCSV(csvContent);

        if (dadosCompletos.length === 0) {
            throw new Error('Nenhum registro válido foi encontrado na planilha.');
        }

        // Ocultar loading
        document.getElementById('loading').style.display = 'none';
        
        // Atualizar interface
        atualizarInfoMes();
        exibirAniversariantes();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro(error.message);
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa o sistema quando a página carregar
 */
function inicializar() {
    console.log('Sistema de Todos os Aniversariantes TCI iniciado');
    carregarDados();
}

// Event listener
document.addEventListener('DOMContentLoaded', inicializar);