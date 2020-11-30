import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { CommonService } from 'src/app/Services/common.service';
import { FirebaseDBService } from 'src/app/Services/firebase-db.service';
import { Appointment } from 'src/app/Services/shared/Appointment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  appointment: any = [];
  constructor(
    public navCtrl: NavController,
    public fireDB: FirebaseDBService,
    public common: CommonService,
    public authService: AuthenticationService
  ) {

  }

  add() {
    this.navCtrl.navigateForward('add-appointment');
  }

  view(param) {
    this.navCtrl.navigateForward('add-appointment', {
      queryParams: {
        data: param
      }
    });
  }

  ngOnInit() {
    this.common.showLoading();
    this.fetchBookings();
    let bookingRes = this.fireDB.getAppointmentList();
    bookingRes.snapshotChanges().subscribe(res => {
      this.appointment = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.appointment.push(a as Appointment);
      })
    })
  }

  fetchBookings() {
    this.fireDB.getAppointmentList().valueChanges().subscribe(res => {
      console.log(res);
      this.common.dismissLoading();
    })
  }

  deleteBooking(id) {
    this.common.showAlert('Do you really want to delete?').then(() => {
      this.fireDB.deleteAppointment(id);
    });
  }

}
