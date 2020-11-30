import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommonService } from 'src/app/Services/common.service';
import { FirebaseDBService } from 'src/app/Services/firebase-db.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.page.html',
  styleUrls: ['./add-appointment.page.scss'],
})
export class AddAppointmentPage implements OnInit {
  appointment: FormGroup;
  isEdit: any = false;
  id: any;

  constructor(
    public formBuilder: FormBuilder,
    public fireDB: FirebaseDBService,
    public navCtrl: NavController,
    public common: CommonService,
    public activated: ActivatedRoute
  ) {
    this.appointment = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      date: ['', Validators.required],
      note: ['']
    });

    this.activated.queryParams.subscribe((data: any) => {
      if (data.data) {
        this.isEdit = true;
        this.id = data.data.$key;
        this.fireDB.getappointment(this.id).valueChanges().subscribe(res => {
          this.appointment.setValue(res);
        });
      }
    })
  }

  ngOnInit() {
  }

  submit() {
    console.log('submit');

    if (this.appointment.invalid) {
      this.appointment.markAllAsTouched();
      return;
    }

    if (!this.isEdit) {
      this.fireDB.createAppointment(this.appointment.value).then(res => {
        console.log(res)
        this.appointment.reset();
        this.common.showAlert('Appointment Successfully added', 'Appointment Saved').then(() => {
          this.navCtrl.pop();
        })
      }).catch(error => console.log(error));
    } else {
      this.fireDB.updateAppointment(this.id, this.appointment.value)
        .then(() => {
          this.common.showAlert('Appointment Successfully Updated', 'Appointment Updated').then(() => {
            this.navCtrl.pop();
          })
        })
        .catch(error => console.log(error));
    }


  }
}
