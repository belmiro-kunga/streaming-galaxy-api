import { ContentItem, Genre } from '@/types/api';

export interface IHomeModel {
  getFeaturedContent(): Promise<ContentItem>;
  getTrendingContent(limit: number): Promise<ContentItem[]>;
  getRecentContent(limit: number): Promise<ContentItem[]>;
  getTopRatedContent(limit: number): Promise<ContentItem[]>;
  getAllGenres(): Promise<Genre[]>;
  getContentByGenre(genreId: string, limit: number): Promise<ContentItem[]>;
  getContinueWatching(userId: string): Promise<ContentItem[]>;
  getRecommendedContent(userId: string): Promise<ContentItem[]>;
}

export interface IHomeView {
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

export interface IHomePresenter {
  initialize(): void;
  toggleGenre(genreId: string): void;
  dispose(): void;
} 