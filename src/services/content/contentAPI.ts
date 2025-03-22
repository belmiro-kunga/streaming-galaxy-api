
// Helper function to ensure content items have the correct structure
const validateContentItem = (item: any): ContentItem => {
  return {
    id: item?.id || `mock-${Math.random().toString(36).substr(2, 9)}`,
    tipo: item?.tipo || 'filme',
    titulo: item?.titulo || 'Título não disponível',
    descricao: item?.descricao || 'Descrição não disponível',
    ano_lancamento: item?.ano_lancamento || 2023,
    classificacao_etaria: item?.classificacao_etaria || '16',
    gratuito: item?.gratuito ?? true,
    duracao: item?.duracao || '2h 15min',
    video_url: item?.video_url || '',
    video_url_480p: item?.video_url_480p || '',
    video_url_720p: item?.video_url_720p || '',
    video_url_1080p: item?.video_url_1080p || '',
    poster_url: item?.poster_url || `https://source.unsplash.com/random/300x450?movie,${item?.titulo || 'film'}`,
    backdrop_url: item?.backdrop_url || `https://source.unsplash.com/random/1920x1080?movie,${item?.titulo || 'film'}`,
    trailer_url: item?.trailer_url || '',
    destaque: item?.destaque || false,
    data_adicao: item?.created_at || new Date().toISOString(),
    generos: item?.generos || [],
    status: item?.status || 'pendente',
    metadata: item?.metadata || {}
  };
};
