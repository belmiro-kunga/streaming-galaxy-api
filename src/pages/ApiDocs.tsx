
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ApiDocs = () => {
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      name: 'perfis_usuario',
      title: 'Perfis de Usuário',
      description: 'Obter e atualizar informações do perfil do usuário',
      methods: [
        {
          method: 'GET',
          endpoint: '/perfis/me',
          description: 'Obtém o perfil do usuário atual',
          example: '{ "id": "uuid", "nome": "João Silva", "fuso_horario": "Africa/Luanda" }'
        },
        {
          method: 'PATCH',
          endpoint: '/perfis/me',
          description: 'Atualiza o perfil do usuário atual',
          body: '{ "nome": "João Silva", "fuso_horario": "Africa/Luanda" }',
          example: '{ "id": "uuid", "nome": "João Silva", "fuso_horario": "Africa/Luanda" }'
        }
      ]
    },
    {
      name: 'planos',
      title: 'Planos de Assinatura',
      description: 'Obter informações sobre planos de assinatura disponíveis',
      methods: [
        {
          method: 'GET',
          endpoint: '/planos',
          description: 'Lista todos os planos de assinatura ativos',
          example: '[{ "id": "uuid", "nome": "Premium", "telas_simultaneas": 4 }]'
        },
        {
          method: 'GET',
          endpoint: '/assinaturas/me',
          description: 'Obtém a assinatura ativa do usuário',
          example: '{ "id": "uuid", "plano_id": "uuid", "data_inicio": "2023-01-01" }'
        }
      ]
    },
    {
      name: 'conteudos',
      title: 'Conteúdos',
      description: 'Gerenciar conteúdos (filmes, séries, etc.)',
      methods: [
        {
          method: 'GET',
          endpoint: '/conteudos',
          description: 'Lista conteúdos com paginação e filtros',
          queryParams: '?page=1&pageSize=10&tipo=filme&genero=acao',
          example: '{ "items": [{ "id": "uuid", "tipo": "filme", "titulo": "Nome do Filme" }], "totalCount": 100 }'
        },
        {
          method: 'GET',
          endpoint: '/conteudos/{id}',
          description: 'Obtém detalhes de um conteúdo específico',
          example: '{ "id": "uuid", "tipo": "filme", "titulo": "Nome do Filme", "descricao": "..." }'
        },
        {
          method: 'GET',
          endpoint: '/conteudos/{id}/episodios',
          description: 'Lista episódios de uma série',
          example: '[{ "id": "uuid", "conteudo_id": "uuid", "numero_temporada": 1, "numero_episodio": 1 }]'
        }
      ]
    },
    {
      name: 'favoritos',
      title: 'Favoritos',
      description: 'Gerenciar lista de favoritos do usuário',
      methods: [
        {
          method: 'GET',
          endpoint: '/favoritos',
          description: 'Lista todos os conteúdos favoritos do usuário',
          example: '[{ "id": "uuid", "tipo": "filme", "titulo": "Nome do Filme" }]'
        },
        {
          method: 'POST',
          endpoint: '/favoritos',
          description: 'Adiciona um conteúdo aos favoritos',
          body: '{ "conteudo_id": "uuid" }',
          example: '{ "usuario_id": "uuid", "conteudo_id": "uuid", "created_at": "2023-01-01T00:00:00Z" }'
        },
        {
          method: 'DELETE',
          endpoint: '/favoritos/{conteudo_id}',
          description: 'Remove um conteúdo dos favoritos',
          example: '{ "success": true }'
        }
      ]
    },
    {
      name: 'historico',
      title: 'Histórico de Reprodução',
      description: 'Gerenciar histórico de reprodução de conteúdo',
      methods: [
        {
          method: 'GET',
          endpoint: '/playback/historico',
          description: 'Lista o histórico de reprodução do usuário',
          example: '[{ "id": "uuid", "conteudo_id": "uuid", "posicao_tempo": 1200 }]'
        },
        {
          method: 'POST',
          endpoint: '/playback/historico',
          description: 'Atualiza o progresso de reprodução',
          body: '{ "conteudo_id": "uuid", "posicao_tempo": 1200, "percentual_assistido": 45.5 }',
          example: '{ "id": "uuid", "conteudo_id": "uuid", "posicao_tempo": 1200 }'
        }
      ]
    },
    {
      name: 'downloads',
      title: 'Downloads',
      description: 'Gerenciar downloads de conteúdo para visualização offline',
      methods: [
        {
          method: 'GET',
          endpoint: '/downloads',
          description: 'Lista todos os downloads do usuário',
          example: '[{ "id": "uuid", "arquivo_midia_id": "uuid", "status": "concluido" }]'
        },
        {
          method: 'POST',
          endpoint: '/downloads',
          description: 'Inicia um novo download',
          body: '{ "arquivo_midia_id": "uuid", "dispositivo_id": "uuid" }',
          example: '{ "id": "uuid", "arquivo_midia_id": "uuid", "status": "em_andamento" }'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-gray-300 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Documentação da API</h1>
          <p className="text-gray-400 mb-8 text-lg">
            Explore os endpoints disponíveis na API da Streaming Galaxy
          </p>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
              <CardDescription className="text-gray-400">
                A API da Streaming Galaxy é baseada em REST e utiliza autenticação JWT via Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Base URL</h3>
                  <code className="bg-gray-800 p-2 rounded block">
                    https://api.streaming-galaxy.com/v1
                  </code>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Autenticação</h3>
                  <p className="text-gray-400 mb-2">
                    Todos os endpoints protegidos exigem um token JWT no cabeçalho de autorização:
                  </p>
                  <code className="bg-gray-800 p-2 rounded block">
                    Authorization: Bearer {"<seu_token_jwt>"}
                  </code>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Integração com Supabase</h3>
                  <p className="text-gray-400">
                    A API está integrada com o Supabase para autenticação, armazenamento de dados e gerenciamento de arquivos.
                    As políticas de segurança no nível de linha (RLS) garantem que os usuários só possam acessar seus próprios dados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={endpoints[0].name} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 bg-gray-900">
              {endpoints.map(endpoint => (
                <TabsTrigger 
                  key={endpoint.name} 
                  value={endpoint.name}
                  className="data-[state=active]:bg-gray-800"
                >
                  {endpoint.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {endpoints.map(endpoint => (
              <TabsContent key={endpoint.name} value={endpoint.name} className="mt-0">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>{endpoint.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {endpoint.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {endpoint.methods.map((method, index) => (
                      <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                          <div className="flex items-center">
                            <span className={`
                              inline-block rounded px-2 py-1 text-xs font-medium mr-3
                              ${method.method === 'GET' ? 'bg-blue-900 text-blue-300' : 
                                method.method === 'POST' ? 'bg-green-900 text-green-300' : 
                                method.method === 'PATCH' ? 'bg-yellow-900 text-yellow-300' : 
                                method.method === 'DELETE' ? 'bg-red-900 text-red-300' : ''}
                            `}>
                              {method.method}
                            </span>
                            <code className="text-sm">
                              {method.endpoint}
                              {method.queryParams && <span className="text-gray-400">{method.queryParams}</span>}
                            </code>
                          </div>
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(
                              `${method.method} https://api.streaming-galaxy.com/v1${method.endpoint}`,
                              method.endpoint
                            )}
                            className="h-8 w-8 p-0"
                          >
                            {copiedEndpoint === method.endpoint ? 
                              <CheckCircle className="h-4 w-4 text-green-500" /> : 
                              <Copy className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                        <div className="p-4 border-t border-gray-800">
                          <p className="text-sm text-gray-400 mb-4">{method.description}</p>
                          
                          {method.body && (
                            <div className="mb-4">
                              <h4 className="text-xs uppercase text-gray-500 mb-2">Request Body</h4>
                              <ScrollArea className="h-24 rounded bg-gray-800 p-2">
                                <pre className="text-xs">{method.body}</pre>
                              </ScrollArea>
                            </div>
                          )}
                          
                          <h4 className="text-xs uppercase text-gray-500 mb-2">Response</h4>
                          <ScrollArea className="h-32 rounded bg-gray-800 p-2">
                            <pre className="text-xs">{method.example}</pre>
                          </ScrollArea>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Precisa de mais informações? Entre em contato com nossa equipe de suporte.
            </p>
            <Button variant="outline">
              Contato Suporte
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiDocs;
