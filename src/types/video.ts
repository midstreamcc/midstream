export type Video = {
  id: string;
  name: string;
  thumbnail_file: string;
  encoded_at: Date;
  // encoded_files: VideoFiles;
};

export type PaginatedVideoList = {
  count: number;
  items: Video[];
};

export type PresignedUploadDetails = {
  url: string;
  fields: { [key: string]: string };
};

export type UploadVideoResponse = {
  id: string;
};
