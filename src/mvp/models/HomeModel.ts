import { contentAPI, userInteractionAPI } from '@/services/api';
import { ContentItem, Genre } from '@/types/api';
import { IHomeModel } from '../contracts/HomeContracts';

export class HomeModel implements IHomeModel {
  async getFeaturedContent(): Promise<ContentItem> {
    return await contentAPI.getFeatureContent();
  }

  async getTrendingContent(limit: number): Promise<ContentItem[]> {
    return await contentAPI.getTrendingContent(limit);
  }

  async getRecentContent(limit: number): Promise<ContentItem[]> {
    return await contentAPI.getRecentContent(limit);
  }

  async getTopRatedContent(limit: number): Promise<ContentItem[]> {
    return await contentAPI.getTopRatedContent(limit);
  }

  async getAllGenres(): Promise<Genre[]> {
    return await contentAPI.getAllGenres();
  }

  async getContentByGenre(genreId: string, limit: number): Promise<ContentItem[]> {
    return await contentAPI.getContentByGenre(genreId, limit);
  }

  async getContinueWatching(userId: string): Promise<ContentItem[]> {
    return await userInteractionAPI.getContinueWatching(userId);
  }

  async getRecommendedContent(userId: string): Promise<ContentItem[]> {
    return await userInteractionAPI.getRecommendedContent(userId);
  }
} 