export declare class Midstream {
  orgId: string;
  apiKey: string;
  constructor(orgId?: string, apiKey?: string);
  protected doGet<T>(url: string): Promise<any>;
  getVideos(page?: number): Promise<any>;
}
