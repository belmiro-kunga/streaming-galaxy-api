import { ContentItem, Genre } from '@/types/api';
import { contentAPI, userInteractionAPI } from '@/services/api';

export class HomeModel {
  private userId: string;

  constructor() {
    this.userId = localStorage.getItem('userId') || 'mock-user';
  }

  async getFeaturedContent(): Promise<ContentItem> {
    return await contentAPI.getFeatureContent();
  }

  async getTrendingContent(limit: number = 20): Promise<ContentItem[]> {
    return await contentAPI.getTrendingContent(limit);
  }

  async getRecentContent(limit: number = 15): Promise<ContentItem[]> {
    return await contentAPI.getRecentContent(limit);
  }

  async getTopRatedContent(limit: number = 15): Promise<ContentItem[]> {
    return await contentAPI.getTopRatedContent(limit);
  }

  async getAllGenres(): Promise<Genre[]> {
    return await contentAPI.getAllGenres();
  }

  async getContentByGenre(genreId: string, limit: number = 10): Promise<ContentItem[]> {
    return await contentAPI.getContentByGenre(genreId, limit);
  }

  async getContinueWatching(): Promise<ContentItem[]> {
    return await userInteractionAPI.getContinueWatching(this.userId);
  }

  async getRecommendedContent(): Promise<ContentItem[]> {
    return await userInteractionAPI.getRecommendedContent(this.userId);
  }

  async getContentByGenres(genres: Genre[]): Promise<{ [key: string]: ContentItem[] }> {
    const contentByGenre: { [key: string]: ContentItem[] } = {};
    
    for (const genre of genres) {
      try {
        contentByGenre[genre.id] = await this.getContentByGenre(genre.id);
      } catch (error) {
        console.error(`Error fetching content for genre ${genre.nome}:`, error);
        contentByGenre[genre.id] = [];
      }
    }

    return contentByGenre;
  }
} 