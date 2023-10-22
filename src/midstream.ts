import { v4 as uuidv4 } from "uuid";

import {
  PresignedUploadDetails,
  PaginatedVideoList,
  UploadVideoResponse,
  Video,
} from "./types/video";

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

  protected async doGet<T>(url: string): Promise<T> {
    const response = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: {
        "X-API-Key": this.apiKey,
      },
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  }

  protected async doPost<T>(url: string, data: { [key: string]: string }) {
    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "X-API-Key": this.apiKey,
      },
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  }

  protected async doGetPresignedUploadUrl(key: string) {
    return this.doPost<PresignedUploadDetails>(
      `/api/orgs/${this.orgId}/videos/presigned`,
      { key },
    );
  }

  async getVideos(page: number = 1): Promise<PaginatedVideoList> {
    return this.doGet<PaginatedVideoList>(
      `/api/orgs/${this.orgId}/videos?page=${page}`,
    );
  }

  async uploadVideo(file: File, name: string): Promise<UploadVideoResponse> {
    if (!file.type.includes("video")) {
      throw new Error("only video types are supported");
    }
    const newFileKey = uuidv4();
    const uploadUrlDetails = await this.doGetPresignedUploadUrl(newFileKey);

    // upload directly to S3
    const formData = new FormData();
    for (const field in uploadUrlDetails.fields) {
      formData.append(field, uploadUrlDetails.fields[field]);
    }
    formData.append("file", file);
    const uploadResponse = await fetch(uploadUrlDetails.url, {
      method: "POST",
      body: formData,
    });
    if (!uploadResponse.ok) throw new Error(uploadResponse.statusText);

    // add the video to the org
    const addResponse = await this.doPost(`/api/orgs/${this.orgId}/videos`, {
      key: uploadUrlDetails.fields["key"],
      name,
    });
    return {
      id: addResponse.id,
    };
  }
}
