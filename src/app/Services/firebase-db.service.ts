import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Appointment } from './shared/Appointment';


@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  appointmentListRef: AngularFireList<any>;
  appointmentRef: AngularFireObject<any>;
  collectionName = 'appointment';

  constructor(
    public fireDB: AngularFireDatabase,
  ) { }
  // Create
  createAppointment(apt: Appointment) {
    // return this.fireDB.object('/appointment'). set(apt);
    return this.appointmentListRef.push({
      name: apt.name,
      date: apt.date,
      phone: apt.phone,
      note: apt.note
    })
  }

  // Get Single
  getappointment(id: string) {
    this.appointmentRef = this.fireDB.object('/appointment/' + id);
    return this.appointmentRef;
  }

  // Get List
  getAppointmentList() {
    this.appointmentListRef = this.fireDB.list('/appointment');
    return this.appointmentListRef;
  }

  // Update
  updateAppointment(id, apt: Appointment) {
    return this.appointmentRef.update({
      name: apt.name,
      date: apt.date,
      phone: apt.phone,
      note: apt.note
    })
  }

  // Delete
  deleteAppointment(id: string) {
    this.appointmentRef = this.fireDB.object('/appointment/' + id);
    this.appointmentRef.remove();
  }
}
