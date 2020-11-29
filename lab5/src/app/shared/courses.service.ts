import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private firestore: AngularFirestore) { }

  getAll() {
    return this.firestore.collection("courses").snapshotChanges();
  }
}
