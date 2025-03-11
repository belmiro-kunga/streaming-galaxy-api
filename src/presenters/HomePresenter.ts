import { HomeModel } from '@/models/HomeModel';
import { ContentItem, Genre } from '@/types/api';

export interface HomeView {
  setFeaturedContent(content: ContentItem): void;
  setTrendingContent(content: ContentItem[]): void;
  setContinueWatching(content: ContentItem[]): void;
  setGenres(genres: Genre[]): void;
  setContentByGenre(content: { [key: string]: ContentItem[] }): void;
  setRecentContent(content: ContentItem[]): void;
  setTopRatedContent(content: ContentItem[]): void;
  setRecommendedContent(content: ContentItem[]): void;
  setLoading(loading: boolean): void;
  showError(message: string): void;
}

export class HomePresenter {
  private model: HomeModel;
  private view: HomeView;

  constructor(view: HomeView) {
    this.model = new HomeModel();
    this.view = view;
  }

  async loadInitialData(): Promise<void> {
    const startTime = Date.now();
    this.view.setLoading(true);

    try {
      // Carregar dados em paralelo usando Promise.all
      const [
        featuredContent,
        trendingContent,
        recentContent,
        topRatedContent,
        genres,
        continueWatching,
        recommendedContent
      ] = await Promise.all([
        this.model.getFeaturedContent(),
        this.model.getTrendingContent(),
        this.model.getRecentContent(),
        this.model.getTopRatedContent(),
        this.model.getAllGenres(),
        this.model.getContinueWatching(),
        this.model.getRecommendedContent()
      ]);

      // Atualizar a view com os dados
      this.view.setFeaturedContent(featuredContent);
      this.view.setTrendingContent(trendingContent);
      this.view.setRecentContent(recentContent);
      this.view.setTopRatedContent(topRatedContent);
      this.view.setGenres(genres);
      this.view.setContinueWatching(continueWatching);
      this.view.setRecommendedContent(recommendedContent);

      // Carregar conteúdo por gênero
      const contentByGenre = await this.model.getContentByGenres(genres);
      this.view.setContentByGenre(contentByGenre);

      // Garantir tempo mínimo de loading de 1.5 segundos
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1500 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));

    } catch (error) {
      this.view.showError('Não foi possível carregar os conteúdos. Tente novamente mais tarde.');
      console.error('Error loading initial data:', error);
    } finally {
      this.view.setLoading(false);
    }
  }

  async loadContentByGenre(genreId: string): Promise<void> {
    try {
      const content = await this.model.getContentByGenre(genreId);
      const contentByGenre = { [genreId]: content };
      this.view.setContentByGenre(contentByGenre);
    } catch (error) {
      this.view.showError('Erro ao carregar conteúdo do gênero.');
      console.error('Error loading genre content:', error);
    }
  }
} 