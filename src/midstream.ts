import { Video } from "./types/video";

// const API_URL: string = "https://api.production.midstream.cc";
const API_URL: string = "http://localhost:7039";

export class Midstream {
  orgId: string;
  apiKey: string;

  constructor(orgId?: string, apiKey?: string) {
    if (!orgId) {
      throw new Error("orgId is required!");
    }
    if (!apiKey) {
      throw new Error("apiKey is required!");
    }
    this.orgId = orgId;
    this.apiKey = apiKey;
  }

  protected async doGet<T>(url: string) {
    const response = await fetch(`${API_URL}${url}&key=${this.apiKey}`);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  }

  getVideos(page: number = 1) {
    return this.doGet<Video[]>(`/api/orgs/${this.orgId}/videos?page=${page}`);
  }
}
