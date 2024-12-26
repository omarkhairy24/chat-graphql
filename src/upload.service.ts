import { Injectable } from "@nestjs/common";
import { createWriteStream } from "fs";
import { FileUpload } from "graphql-upload-ts/dist/Upload";
import { join } from "path";

@Injectable()
export class UploadService{

    async uploadFile (file: FileUpload){
        let { createReadStream, filename } = file;
        filename = `${Date.now()}-${filename}`;
        const path = join('uploads', filename);
        const stream = createReadStream();
        const out = createWriteStream(path);
        stream.pipe(out);
        await new Promise((resolve, reject) => {
          out.on('finish', resolve);
          out.on('error', reject);
        });
        return filename
    }

    async uploadImages(files){
        const imageUrls = [];
        for (const file of files) {
            let { createReadStream, filename } = await file;
            filename = `${Date.now()}-${filename}`;
            const path = join('uploads', filename);
            const stream = createReadStream();
            const out = createWriteStream(path);
            stream.pipe(out);
            await new Promise((resolve, reject) => {
                out.on('finish', resolve);
                out.on('error', reject);
            });
            imageUrls.push(filename);
        }
        return imageUrls
    }
}