// fetch-data.js
import fs from 'fs';
import path from 'path';

async function fetchPlatformData() {
  console.log('--- Iniciando Coleta de Dados das APIs ---');

  // URLs fictícias - substitua pelas chaves e endpoints reais das suas plataformas
  const endpoints = {
    plataformaA: 'https://api.exemploA.com/v1/dados',
    plataformaB: 'https://api.exemploB.com/v1/metricas'
  };

  try {
    // Executa as requisições em paralelo para economizar tempo de execução no GitHub Actions
    const [resA, resB] = await Promise.all([
      fetch(endpoints.plataformaA, {
        headers: { 
          // O token será injetado pelo GitHub Actions via variáveis de ambiente
          'Authorization': `Bearer ${process.env.API_KEY_PLATAFORMA_A}`,
          'Accept': 'application/json'
        }
      }).then(res => res.ok ? res.json() : { error: `Falha: Status ${res.status}` }),

      fetch(endpoints.plataformaB, {
        headers: { 
          'Authorization': `Bearer ${process.env.API_KEY_PLATAFORMA_B}`,
          'Accept': 'application/json'
        }
      }).then(res => res.ok ? res.json() : { error: `Falha: Status ${res.status}` })
    ]);

    // Monta o objeto final da sua API customizada
    const outputData = {
      assinatura: "API de Cache Estático",
      ultima_atualizacao: new Date().toISOString(),
      dados: {
        plataformaA: resA,
        plataformaB: resB
      }
    };

    // Garante que a pasta public existe antes de gravar
    const publicDir = path.resolve('./public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Salva o JSON formatado com 2 espaços de recuo
    fs.writeFileSync(
      path.join(publicDir, 'data.json'), 
      JSON.stringify(outputData, null, 2), 
      'utf-8'
    );

    console.log('--- JSON gerado com sucesso em ./public/data.json ---');

  } catch (error) {
    console.error('Erro crítico durante a execução do script:', error);
    process.exit(1); // Força o pipeline do GitHub a acusar falha se algo quebrar feio
  }
}

fetchPlatformData();
