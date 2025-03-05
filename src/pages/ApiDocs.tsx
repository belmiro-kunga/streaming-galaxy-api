
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Copy, Check } from 'lucide-react';

const ApiDocs = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const codeBlocks = [
    {
      title: "Obter Perfil do Usuário",
      endpoint: "GET /profiles/me",
      code: `const response = await api.get('/profiles/me');
const userData = response.data;
console.log(userData);`
    },
    {
      title: "Listar Conteúdos",
      endpoint: "GET /contents",
      code: `const response = await api.get('/contents', { 
  params: { 
    page: 1, 
    pageSize: 10, 
    tipo: 'filme'
  } 
});
const contentList = response.data;
console.log(contentList);`
    },
    {
      title: "Adicionar aos Favoritos",
      endpoint: "POST /favorites",
      code: `const response = await api.post('/favorites', { 
  conteudo_id: '123e4567-e89b-12d3-a456-426614174000'
});
const favorite = response.data;
console.log(favorite);`
    }
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    { category: "Usuários", path: "/profiles/me", method: "GET", description: "Obter perfil do usuário atual" },
    { category: "Usuários", path: "/profiles/me", method: "PATCH", description: "Atualizar perfil do usuário" },
    { category: "Assinaturas", path: "/plans", method: "GET", description: "Listar planos de assinatura" },
    { category: "Assinaturas", path: "/subscriptions/me", method: "GET", description: "Obter assinatura atual" },
    { category: "Assinaturas", path: "/subscriptions", method: "POST", description: "Criar nova assinatura" },
    { category: "Conteúdo", path: "/contents", method: "GET", description: "Listar conteúdos com paginação" },
    { category: "Conteúdo", path: "/contents/:id", method: "GET", description: "Obter detalhes de um conteúdo" },
    { category: "Conteúdo", path: "/contents/featured", method: "GET", description: "Listar conteúdos em destaque" },
    { category: "Episódios", path: "/contents/:id/episodes", method: "GET", description: "Listar episódios de uma série" },
    { category: "Episódios", path: "/episodes/:id", method: "GET", description: "Obter detalhes de um episódio" },
    { category: "Interações", path: "/favorites", method: "GET", description: "Listar favoritos do usuário" },
    { category: "Interações", path: "/favorites", method: "POST", description: "Adicionar conteúdo aos favoritos" },
    { category: "Interações", path: "/favorites/:id", method: "DELETE", description: "Remover conteúdo dos favoritos" },
    { category: "Interações", path: "/playback/history", method: "GET", description: "Obter histórico de reprodução" },
    { category: "Interações", path: "/playback/history", method: "POST", description: "Atualizar progresso de reprodução" },
    { category: "Downloads", path: "/downloads", method: "GET", description: "Listar downloads do usuário" },
    { category: "Downloads", path: "/downloads", method: "POST", description: "Criar novo download" },
    { category: "Dispositivos", path: "/devices", method: "GET", description: "Listar dispositivos registrados" },
    { category: "Dispositivos", path: "/devices", method: "POST", description: "Registrar novo dispositivo" },
    { category: "Gêneros", path: "/genres", method: "GET", description: "Listar todos os gêneros" },
    { category: "Estatísticas", path: "/statistics/me", method: "GET", description: "Obter estatísticas do usuário" },
  ];

  const categories = [...new Set(endpoints.map(e => e.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentação da API</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore a API do Streaming Galaxy para integrar nossos recursos em sua aplicação
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="examples">Exemplos</TabsTrigger>
            <TabsTrigger value="reference">Referência</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700/50 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Introdução</h2>
                <p className="text-gray-300 mb-4">
                  A API do Streaming Galaxy permite que desenvolvedores acessem e interajam com nossos dados 
                  de streaming, incluindo gerenciamento de usuários, conteúdo, assinaturas e muito mais.
                </p>
                <p className="text-gray-300 mb-4">
                  Nossa API segue os princípios RESTful e utiliza JSON para formatação de dados.
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700/50 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Autenticação</h2>
                <p className="text-gray-300 mb-4">
                  Todas as solicitações à API devem ser autenticadas usando um token JWT no cabeçalho Authorization:
                </p>
                <div className="bg-gray-900 p-4 rounded-md font-mono text-sm mb-4">
                  Authorization: Bearer seu_token_jwt
                </div>
                <p className="text-gray-300">
                  Para obter um token, utilize os endpoints de autenticação do Supabase.
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700/50">
                <h2 className="text-2xl font-semibold mb-4">Formato de Resposta</h2>
                <p className="text-gray-300 mb-4">
                  Todas as respostas seguem este formato padrão:
                </p>
                <div className="bg-gray-900 p-4 rounded-md font-mono text-sm">
                  {`{
  "data": { ... }, // Os dados solicitados
  "status": 200,   // Código de status HTTP
  "message": "OK"  // Mensagem descritiva
}`}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="examples">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {codeBlocks.map((block, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{block.title}</h3>
                      <p className="text-gray-400 font-mono text-sm">{block.endpoint}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(block.code, index)}
                      className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                      aria-label="Copy code"
                    >
                      {copiedIndex === index ? 
                        <Check className="h-5 w-5 text-green-400" /> : 
                        <Copy className="h-5 w-5 text-gray-400" />
                      }
                    </button>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre>{block.code}</pre>
                  </div>
                </div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="reference">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50">
                <h2 className="text-2xl font-semibold mb-6">Referência de Endpoints</h2>
                
                <div className="space-y-8">
                  {categories.map((category) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-xl font-medium text-white mb-4">{category}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Método</th>
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Endpoint</th>
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Descrição</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoints
                              .filter(e => e.category === category)
                              .map((endpoint, index) => (
                                <tr key={index} className="border-b border-gray-800">
                                  <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                                      ${endpoint.method === 'GET' ? 'bg-blue-900/50 text-blue-300' : 
                                        endpoint.method === 'POST' ? 'bg-green-900/50 text-green-300' : 
                                        endpoint.method === 'PATCH' ? 'bg-yellow-900/50 text-yellow-300' : 
                                        'bg-red-900/50 text-red-300'}`}>
                                      {endpoint.method}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 font-mono text-sm">{endpoint.path}</td>
                                  <td className="px-4 py-3 text-gray-300">{endpoint.description}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ApiDocs;
