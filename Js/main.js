/**
 * ============================================
 * SISTEMA DE ANIVERSARIANTES TCI
 * JavaScript da Página Principal (index.html)
 * ============================================
 */

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let dadosCompletos = [];

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
 * Obtém o mês atual (1-12)
 */
function obterMesAtual() {
    return new Date().getMonth() + 1;
}

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
 * Converte URL do Google Drive ou processa caminhos de fotos
 * Suporta: URLs completas, fotos locais, Google Drive
 */
function converterURLGoogleDrive(url) {
    if (!url || !url.trim()) return '';

    url = url.trim();

    // Se for URL completa de outro serviço (Imgur, etc), retornar como está
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // Se for Google Drive, tentar converter
        if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
            let fileId = null;

            const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (match1) fileId = match1[1];

            const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (match2) fileId = match2[1];

            const match3 = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
            if (match3) fileId = match3[1];

            const match4 = url.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
            if (match4) fileId = match4[1];

            if (fileId) {
                // AVISO: Google Drive pode ter problemas de CORS
                // Recomendamos usar Imgur ou hospedar localmente
                console.warn('⚠️ Google Drive pode ter problemas de CORS. Considere usar Imgur ou fotos locais.');
                return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
            }
        }
        // Outras URLs (Imgur, etc) funcionam normalmente
        return url;
    }

    // Se for caminho local (relativo), retornar como está
    // Ex: "fotos/joao.jpg" ou "imagens/maria.png"
    return url;
}

// ============================================
// FUNÇÕES DE INTERFACE
// ============================================

/**
 * Atualiza informações do mês no cabeçalho
 */
function atualizarInfoMes() {
    const mesAtual = obterMesAtual();
    const nomesMes = mesesNomes[mesAtual - 1];

    document.getElementById('current-month').textContent = nomesMes + ' ' + new Date().getFullYear();

    const aniversariantesMes = filtrarAniversariantesMes();
    document.getElementById('month-description').textContent =
        `${aniversariantesMes.length} aniversariante(s) este mês`;
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
 * Filtra aniversariantes do mês atual
 */
function filtrarAniversariantesMes() {
    const mesAtual = obterMesAtual();
    
    return dadosCompletos.filter(pessoa => {
        if (!pessoa.Data) return false;
        
        const partes = pessoa.Data.split('/');
        if (partes.length >= 2) {
            const mesPessoa = parseInt(partes[1]);
            return mesPessoa === mesAtual;
        }
        return false;
    });
}

/**
 * Exibe os aniversariantes na tela
 */
function exibirAniversariantes() {
    const container = document.getElementById('aniversariantes');
    const aniversariantesMes = filtrarAniversariantesMes();
    
    container.innerHTML = '';
    
    if (aniversariantesMes.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <h3>🎭 Nenhum aniversariante</h3>
                <p>Não há aniversários em ${mesesNomes[obterMesAtual() - 1]}.</p>
            </div>
        `;
        document.getElementById('saiba-mais-container').style.display = 'block';
        return;
    }

    // Ordenar por dia do mês
    aniversariantesMes.sort((a, b) => {
        const diaA = parseInt(a.Data.split('/')[0]);
        const diaB = parseInt(b.Data.split('/')[0]);
        return diaA - diaB;
    });

    // Mostrar apenas os primeiros 3 aniversariantes
    const aniversariantesLimitados = aniversariantesMes.slice(0, 3);

    aniversariantesLimitados.forEach(pessoa => {
        const card = criarCardAniversariante(pessoa);
        container.appendChild(card);
    });

    // Mostrar botão "Saiba Mais"
    document.getElementById('saiba-mais-container').style.display = 'block';
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

            // Validar dados obrigatórios
            if (!pessoa.Nome || !pessoa.Departamento || !pessoa.Cargo || !pessoa.Data) {
                registrosIgnorados.push(`Linha ${i + 1}: Dados incompletos`);
                continue;
            }

            // Validar departamento
            if (!validarDepartamento(pessoa.Departamento)) {
                registrosIgnorados.push(`Linha ${i + 1}: Departamento inválido - ${pessoa.Departamento}`);
                continue;
            }

            // Validar formato da data
            const partesData = pessoa.Data.split('/');
            if (partesData.length < 2 || partesData.length > 3) {
                registrosIgnorados.push(`Linha ${i + 1}: Formato de data inválido - ${pessoa.Data}`);
                continue;
            }

            const dia = parseInt(partesData[0]);
            const mes = parseInt(partesData[1]);

            if (isNaN(dia) || isNaN(mes) || dia < 1 || dia > 31 || mes < 1 || mes > 12) {
                registrosIgnorados.push(`Linha ${i + 1}: Data inválida - ${pessoa.Data}`);
                continue;
            }

            dados.push(pessoa);
        }
    }

    if (dados.length === 0) {
        let mensagemErro = 'Nenhum registro válido encontrado.';
        if (registrosIgnorados.length > 0) {
            mensagemErro += ' Problemas encontrados:\n' + registrosIgnorados.slice(0, 5).join('\n');
            if (registrosIgnorados.length > 5) {
                mensagemErro += `\n... e mais ${registrosIgnorados.length - 5} problemas.`;
            }
        }
        throw new Error(mensagemErro);
    }

    // Log de registros ignorados
    if (registrosIgnorados.length > 0) {
        console.warn('Registros ignorados:', registrosIgnorados);
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
        let dadosCarregados = false;

        // Tentar carregar cada arquivo da lista
        for (const nomeArquivo of nomesPlanilha) {
            try {
                const response = await fetch(nomeArquivo);
                
                if (response.ok) {
                    const csvText = await response.text();
                    
                    if (csvText && csvText.trim().length > 0) {
                        dadosCompletos = processarCSV(csvText);
                        dadosCarregados = true;
                        console.log(`Dados carregados com sucesso de: ${nomeArquivo}`);
                        break;
                    }
                }
            } catch (error) {
                console.warn(`Erro ao tentar carregar ${nomeArquivo}:`, error.message);
                continue;
            }
        }

        if (!dadosCarregados) {
            throw new Error(`Nenhum arquivo de dados encontrado. Procurei pelos arquivos: ${nomesPlanilha.join(', ')}`);
        }

        // Atualizar interface
        document.getElementById('loading').style.display = 'none';
        atualizarInfoMes();
        exibirAniversariantes();

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro(error.message);
    }
}

// ============================================
// NAVEGAÇÃO
// ============================================

/**
 * Redireciona para a página de todos os aniversariantes
 */
function redirecionarParaTodosAniversariantes() {
    const urlDestino = 'todos_aniversariantes.html';
    
    // Salvar dados no sessionStorage
    try {
        if (typeof(Storage) !== "undefined" && dadosCompletos.length > 0) {
            sessionStorage.setItem('dadosAniversariantes', JSON.stringify(dadosCompletos));
        }
    } catch (e) {
        console.warn('SessionStorage não disponível:', e);
    }
    
    // Tentar abrir a nova página
    try {
        window.open(urlDestino, '_blank');
    } catch (error) {
        window.location.href = urlDestino;
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa o sistema quando a página carregar
 */
function inicializar() {
    console.log('Sistema de Aniversariantes TCI iniciado');
    atualizarInfoMes();
    carregarDados();
}

// Event listeners
document.addEventListener('DOMContentLoaded', inicializar);

// Para compatibilidade com SharePoint
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}