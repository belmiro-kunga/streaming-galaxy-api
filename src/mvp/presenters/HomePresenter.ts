import { IHomeModel, IHomePresenter, IHomeView } from '../contracts/HomeContracts';

export class HomePresenter implements IHomePresenter {
  private model: IHomeModel;
  private view: IHomeView;
  private activeGenres: string[] = ['1', '8'];

  constructor(model: IHomeModel, view: IHomeView) {
    this.model = model;
    this.view = view;
  }

  async initialize(): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Carregar conteúdo em paralelo
      const [
        featuredContent,
        trendingContent,
        recentContent,
        topRatedContent,
        genres
      ] = await Promise.all([
        this.model.getFeaturedContent(),
        this.model.getTrendingContent(20),
        this.model.getRecentContent(15),
        this.model.getTopRatedContent(15),
        this.model.getAllGenres()
      ]);

      // Atualizar a view com os dados iniciais
      this.view.setFeaturedContent(featuredContent);
      this.view.setTrendingContent(trendingContent);
      this.view.setRecentContent(recentContent);
      this.view.setTopRatedContent(topRatedContent);
      this.view.setGenres(genres);

      // Carregar conteúdo por gênero
      const contentGenres: { [key: string]: any[] } = {};
      await Promise.all(
        genres.map(async (genre) => {
          try {
            const content = await this.model.getContentByGenre(genre.id, 10);
            contentGenres[genre.id] = content;
          } catch (error) {
            console.error(`Error fetching content for genre ${genre.nome}:`, error);
            contentGenres[genre.id] = [];
          }
        })
      );
      this.view.setContentByGenre(contentGenres);

      // Carregar dados do usuário
      try {
        const userId = localStorage.getItem('userId') || 'mock-user';
        const [watchingData, recommended] = await Promise.all([
          this.model.getContinueWatching(userId),
          this.model.getRecommendedContent(userId)
        ]);
        
        this.view.setContinueWatching(watchingData);
        this.view.setRecommendedContent(recommended);
      } catch (error) {
        console.log('User not authenticated or error fetching user data:', error);
      }

      // Garantir loading mínimo de 1.5 segundos
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1500 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));

    } catch (error) {
      this.view.showError('Não foi possível carregar os conteúdos. Tente novamente mais tarde.');
    } finally {
      this.view.setLoading(false);
    }
  }

  toggleGenre(genreId: string): void {
    this.activeGenres = this.activeGenres.includes(genreId)
      ? this.activeGenres.filter(id => id !== genreId)
      : [...this.activeGenres, genreId];
  }

  dispose(): void {
    // Cleanup if needed
  }
} 