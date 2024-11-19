import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'newsImage',
  standalone: true
})
export class NewsImagePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }
  transform(imageData:string, imageType:string): unknown {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${imageType};base64,${imageData}`);
  }

}
