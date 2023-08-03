import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ImageService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * 
   * @param file a image
   * @returns url of image on cloud
   * @link https://api.imgbb.com/ 
   */
  async saveImageToCloud(file: Express.Multer.File) : Promise<String> {
    // prepare form data
    const formData = new FormData();

    // add to form data key 'image', value is file in base64 form (maximum 32 MB)
    formData.append('image', file.buffer.toString('base64'));

    // send form data vie POST request, get property "data" of return 
    // remember to put your api key from imgbb
    const { data: imageData } = await firstValueFrom(
      this.httpService
        .post(
          `https://api.imgbb.com/1/upload?key=${process.env.IMAGE_KEY}`,
          formData,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException(
              'save image to cloud server error : ' + error,
            );
          }),
        ),
    );

    // return the url of image
    return imageData.data.url;
  }
}
