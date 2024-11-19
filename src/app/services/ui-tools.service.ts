import { Injectable } from '@angular/core';
import Swal, {SweetAlertIcon, SweetAlertResult} from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UiToolsService {

  constructor() { }

  displayMessage(title: string, message: string, icon: SweetAlertIcon, confirmButtonText = 'OK'):Promise<SweetAlertResult<any>>  {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: confirmButtonText
    });
  }

  displayToastMessage(message: string, icon: SweetAlertIcon = "success" ): Promise<SweetAlertResult<any>>{
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    return Toast.fire({
      icon: icon,
      title: message
    });
  }
}
