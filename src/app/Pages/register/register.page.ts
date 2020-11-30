import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public navCtrl: NavController,
    public common: CommonService
  ) { }

  ngOnInit() { }

  signUp(email, password) {
    this.common.showLoading();
    this.authService.RegisterUser(email.value, password.value)
      .then((res) => {
        this.authService.SendVerificationMail();
        this.common.showAlert('We will send you verification link in your Email plase check and verify Then login with same email and password.', 'Verify Email').then(() => {
          this.navCtrl.pop();
        });
        this.common.dismissLoading();
      }).catch((error) => {
        this.common.showAlert(error.message, 'Error');
      });
  }

}
