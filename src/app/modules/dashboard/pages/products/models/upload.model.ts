export class UploadModel {

    $key: string;
    file: File;
    name: string;
    img_preview_url: string;
    progress: number;
    createdAt: Date = new Date();
  
    constructor(file: File) {
      this.file = file;
    }
  }