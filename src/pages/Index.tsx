
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn } from 'lucide-react';

const Index = () => {
  const backgroundStyle = {
    background: 'linear-gradient(to bottom, #000000, #141414)',
    minHeight: '100vh',
    color: 'white'
  };
  
  return (
    <div style={backgroundStyle} className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 md:px-8">
        <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-black to-gray-900"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            CinePlay
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
            Uma plataforma de streaming angolana com conteúdo premium para todos os gostos
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/home" 
                className="group inline-flex items-center justify-center px-8 py-3 rounded-md bg-white text-black font-medium text-base transition-all duration-300"
              >
                Explorar Catálogo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/login" 
                className="group inline-flex items-center justify-center px-8 py-3 rounded-md bg-primary border border-primary text-white font-medium text-base transition-all duration-300 hover:bg-primary/90"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Recursos da API</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Nossa API robusta permite integrar a plataforma CinePlay em diversos aplicativos e serviços
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Gerenciamento de Usuários",
                description: "APIs para cadastro, autenticação e gerenciamento de perfis de usuários."
              },
              {
                title: "Catálogo de Conteúdo",
                description: "Acesso ao catálogo completo com filmes, séries e outros conteúdos."
              },
              {
                title: "Assinaturas e Pagamentos",
                description: "Integração com planos de assinatura e métodos de pagamento."
              },
              {
                title: "Histórico e Favoritos",
                description: "Controle do histórico de reprodução e lista de favoritos do usuário."
              },
              {
                title: "Sistema de Download",
                description: "API para gerenciar downloads de conteúdo para visualização offline."
              },
              {
                title: "Estatísticas e Relatórios",
                description: "Dados estatísticos sobre o uso da plataforma e comportamento dos usuários."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50"
              >
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
