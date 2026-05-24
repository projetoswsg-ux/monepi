// fetch-data.js
import fs from 'fs';
import path from 'path';

async function fetchCryptoPrices() {
  console.log('--- Iniciando Coleta de Preços (CoinGecko) ---');

  // A sua URL real com todas as moedas selecionadas
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=monero,bytecoin,ryo-currency,karbo,zclassic,ycash,epic-cash,zcash,dash,firo,oasis-network,secret,pirate-chain,beam,grin,decred&vs_currencies=usd,brl&include_1hr_change=true';

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        // User-Agent padrão para evitar que barrem a requisição automatizada
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`Falha na API do CoinGecko: Status ${response.status}`);
    }

    const priceData = await response.json();

    // Monta a estrutura final do seu JSON customizado
    const outputData = {
      provedor: "Titan Terminal Data Engine",
      status: "success",
      ultima_atualizacao: new Date().toISOString(),
      mercado: priceData
    };

    // Garante que a pasta public existe no ambiente do GitHub
    const publicDir = path.resolve('./public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Salva o JSON formatado pronto para consumo
    fs.writeFileSync(
      path.join(publicDir, 'data.json'), 
      JSON.stringify(outputData, null, 2), 
      'utf-8'
    );

    console.log('--- data.json gerado com sucesso com as cotações atuais! ---');

  } catch (error) {
    console.error('Erro crítico ao puxar dados do CoinGecko:', error);
    process.exit(1); // Avisa o GitHub Actions que o processo falhou
  }
}

fetchCryptoPrices();
