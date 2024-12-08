import {
  Injectable,
  PipeTransform,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(images: Express.Multer.File[]): Express.Multer.File[] {
    const mimetypes = 'jpg|jpeg|png';
    if (images === undefined || images === null) {
      throw new BadRequestException('Validation failed (file expected)');
    }
    if (images.length === 0) {
      throw new BadRequestException('Validation failed (files expected)');
    }
    images.forEach((file) => {
      if (!Boolean(file.mimetype.match(mimetypes)))
        throw new UnsupportedMediaTypeException(
          `File type is not matching: ${mimetypes}`,
        );
    });
    return images;
  }
}
