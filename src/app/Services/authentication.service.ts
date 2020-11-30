import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: any;
  User: any = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    emailVerified: false
  }

  constructor(
    public fireStire: AngularFirestore,
    public fireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public common: CommonService
  ) {
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  // Login in with email/password
  SignIn(email, password) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  // Register user with email/password
  RegisterUser(email, password) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
  }

  async checkEmailVerification() {
    console.log('email sent => ', (await this.fireAuth.currentUser).emailVerified);
  }

  // Email verification when new user register
  async SendVerificationMail() {
    (await this.fireAuth.currentUser).sendEmailVerification().then(() => {
      this.common.showAlert('Verification Email send successfully please check your inbox and verify.', 'Email Send');
    });
  }
  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.fireStire.doc(`users/${user.uid}`);
    this.User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    console.log('user Data=>', this.User);

    localStorage.setItem('user', JSON.stringify(this.User));

    return userRef.set(this.User, {
      merge: true
    });
  }

  // Sign-out 
  SignOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }
}