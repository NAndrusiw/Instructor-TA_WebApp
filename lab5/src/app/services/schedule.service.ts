
import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";

import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireList} from "@angular/fire/database";

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  schedulesList: AngularFirestoreCollection<any>;
  isScheduleEditMode: boolean;

  constructor(private firestore: AngularFirestore) {
  }

  form = new FormGroup({
    $id: new FormControl(null),
    name: new FormControl('', Validators.required),
    description: new FormControl(),
    published: new FormControl(false),
  })

  getAllSchedules() {
    // @ts-ignore
    this.schedulesList = this.firestore.collection('schedules');
    return this.schedulesList.snapshotChanges();
  }

  populateForm(schedule) {
    const {uid, created_date, courses, updated_date, ...data} = schedule;
    this.form.setValue(data);
    this.isScheduleEditMode = true;
  }

  createSchedule(schedule, uid) {
    this.schedulesList.add({
      ...schedule,
      ...{
        created_date: new Date(),
        updated_date: new Date(),
        uid: uid,
      }
    });
  }

  getCourseForSchedule(schedule) {
    return this.firestore.collection(`schedules/${schedule}`).snapshotChanges();
  }

  addCourseToSchedule($scheduleId, $courseId) {
    console.log($scheduleId, $courseId)
    this.schedulesList.doc($scheduleId).set({
      courses: {
        [$courseId]: true
      }
    }, {merge: true})

  }

  updateSchedule($id, schedule) {
    schedule = {...schedule, updated_date: new Date()}
    this.schedulesList.doc($id).update(schedule).then(() => {
      this.isScheduleEditMode = false;
      console.log('schedule updated!');
    }).catch(error => {
      console.log('course ERROR', error);
    });
  }

  deleteSchedule(schedule) {

    if (confirm('Are you sure you wanna delete this schedule?')) {
      console.log(schedule.$id);
      this.schedulesList.doc(schedule.$id).delete().then(() => {
        console.log('Deleted!');
      }).catch((error) => {
        console.log('Error deleting! ', error);
      })
    }


  }

  getNumberOfCourses(schedule: any) {
    if (schedule.courses) {
      return Object.keys(schedule.courses).length;
    }
  return 0;
  }


  deleteCourse(schedule, courseId) {
    if (confirm('you sure you wanna delete this course')) {
      const {courses} = schedule;
      delete courses[courseId];

      schedule.courses = courses;
      this.updateSchedule(schedule.$id, schedule);
    }

  }
}
