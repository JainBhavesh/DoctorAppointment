import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public navCtrl: NavController,
    public common: CommonService
  ) { }

  ngOnInit() { }

  logIn(email, password) {
    this.common.showLoading();
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
        this.authService.SetUserData(res.user);
        this.common.dismissLoading();
        if (this.authService.isEmailVerified) {
          this.navCtrl.navigateRoot('home');
        } else {
          localStorage.removeItem('user');
          this.common.showAlert('Email is not verified Please verify Email first and try again', 'Verify Email', 'Send Email').then(() => {
            this.authService.SendVerificationMail();
          });
        }
      }).catch((error) => {
        console.log('Error in login => ', error);
        if (error.code == "auth/user-not-found") {
          window.alert(error.message)
        }
      });
  }

  register() {
    this.navCtrl.navigateForward('register');
  }
}
