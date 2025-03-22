
import React from 'react';
import ImportCSV from './ImportCSV';

const ImportContentTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Importação de Conteúdo</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Importe conteúdos em massa através de arquivos CSV
        </p>
      </div>
      
      <ImportCSV />
      
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium">Instruções para Importação</h3>
        
        <div className="text-sm space-y-4">
          <div>
            <h4 className="font-medium mb-2">Estrutura para Filmes:</h4>
            <p>Cada linha representa um filme e deve conter as seguintes colunas:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Título (obrigatório)</li>
              <li>Título Original (obrigatório)</li>
              <li>Ano (obrigatório)</li>
              <li>Gênero (obrigatório)</li>
              <li>Origem (obrigatório)</li>
              <li>Duração (obrigatório)</li>
              <li>Diretor (obrigatório)</li>
              <li>Elenco (obrigatório)</li>
              <li>Idade (obrigatório)</li>
              <li>Diretório (obrigatório)</li>
              <li>Thumbnail (opcional)</li>
              <li>Link_480p (opcional)</li>
              <li>Link_720p (opcional)</li>
              <li>Link_1080p (opcional)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Estrutura para Séries:</h4>
            <p>Cada linha representa um episódio de uma série e deve conter as seguintes colunas:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Título (obrigatório)</li>
              <li>Título Original (obrigatório)</li>
              <li>Ano (obrigatório)</li>
              <li>Gênero (obrigatório)</li>
              <li>Origem (obrigatório)</li>
              <li>Diretor (obrigatório)</li>
              <li>Elenco (obrigatório)</li>
              <li>Idade (obrigatório)</li>
              <li>Temporada (obrigatório)</li>
              <li>Número Temporadas (obrigatório)</li>
              <li>Episódio (obrigatório)</li>
              <li>Título Episódio (obrigatório)</li>
              <li>Duração (obrigatório)</li>
              <li>Diretório (obrigatório)</li>
              <li>Thumbnail (opcional)</li>
              <li>Link_480p (opcional)</li>
              <li>Link_720p (opcional)</li>
              <li>Link_1080p (opcional)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Diretórios Disponíveis:</h4>
            <ul className="list-disc pl-5 mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              <li>Netflix</li>
              <li>Prime Video</li>
              <li>Disney Plus</li>
              <li>Max</li>
              <li>Paramount Plus</li>
              <li>Globoplay</li>
              <li>Hulu</li>
              <li>Crunchyroll</li>
              <li>Cinema</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Processo de Importação:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Faça o upload do arquivo CSV.</li>
              <li>O sistema validará o arquivo e mostrará uma prévia dos dados.</li>
              <li>Se não houver erros, clique em "Importar" para iniciar o processo.</li>
              <li>Após a importação, todos os conteúdos ficarão com status pendente.</li>
              <li>Verifique e aprove os conteúdos importados na aba "Filmes e Séries".</li>
            </ol>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
            <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-2">Observações Importantes:</h4>
            <ul className="list-disc pl-5 space-y-1 text-amber-700 dark:text-amber-400">
              <li>O sistema identificará automaticamente se a linha representa um filme ou uma série com base na presença dos campos de temporada.</li>
              <li>Os campos de link para vídeos são opcionais. Se não forem preenchidos, o conteúdo será importado sem eles.</li>
              <li>O valor no campo "Diretório" determinará em qual seção do site o conteúdo será exibido.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportContentTab;
