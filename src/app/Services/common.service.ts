import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  loading: any;
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  async showAlert(msg?: any, header?: any, okTxt?: any) {
    return new Promise(async (resolve: any) => {
      const alert = await this.alertCtrl.create({
        header: header ? header : 'Alert!',
        message: msg,
        animated: true,
        mode: 'ios',
        backdropDismiss: false,
        buttons: [
          {
            text: okTxt ? okTxt : 'OK',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    });

  }

  async showToast(msg, color?) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color
    });
    toast.present();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
}
