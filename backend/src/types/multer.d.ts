declare module 'multer' {
  import { RequestHandler } from 'express';

  interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }

  interface MulterOptions {
    dest?: string;
    storage?: any;
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      parts?: number;
      headerPairs?: number;
    };
  }

  function multer(options?: MulterOptions): {
    single: (fieldname: string) => RequestHandler;
    array: (fieldname: string, maxCount?: number) => RequestHandler;
    fields: (fields: any[]) => RequestHandler;
    any: () => RequestHandler;
    none: () => RequestHandler;
    memoryStorage: () => any;
    diskStorage: (options: any) => any;
  };

  namespace multer {
    function memoryStorage(): any;
    function diskStorage(options: any): any;
    type File = MulterFile;
  }

  export = multer;
}
