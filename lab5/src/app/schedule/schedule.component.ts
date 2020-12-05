import {Component, OnInit} from '@angular/core';
import {ScheduleService} from "../services/schedule.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {CoursesService} from "../shared/courses.service";

declare var $: any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  schedule: any;
  formControls = this.scheduleService.form.controls;
  searchString: string;
  selectedSchedule: any;
  selectedScheduleCourses: any;
  allCourses =[];

  allSchedules = [];

  constructor(public scheduleService: ScheduleService, private coursesService: CoursesService, private formBuilder: FormBuilder, public auth: AuthService) {
  }

  ngOnInit(): void {
    this.loadSchedules();
    this.getCourses();

  }

  getCourses = () => this.coursesService.getAll().subscribe(res => {


    this.allCourses = res.map(item => {
      // console.log(item);
      return {
        // @ts-ignore
        $id: item.payload.doc.id,
        // @ts-ignore
        ...item.payload.doc.data()
      };
    });


  });


  deleteCourseInSchedule(selectedSchedule, courseId) {
    this.scheduleService.deleteCourse(selectedSchedule, courseId);
    this.getCoursesInSchedule(selectedSchedule);
  }

  getCoursesInSchedule(schedule) {

    $('#showcourses').modal('show');

    this.selectedSchedule = schedule;

    if (!schedule.courses) {
      return [];
    }


    this.selectedScheduleCourses = this.allCourses.filter(i => Object.keys(schedule.courses).includes(i.id));

  }

  loadSchedules() {
    this.scheduleService.getAllSchedules().subscribe(res => {
      this.allSchedules = res;
      this.allSchedules = res.map(item => {
        // console.log(item);
        return {
          // @ts-ignore
          $id: item.payload.doc.id,
          // @ts-ignore
          ...item.payload.doc.data()
        };
      });
    });
  }


  onDelete(schedule) {

        this.scheduleService.deleteSchedule(schedule);

  }

  saveSchedule() {

    const {$id, ...formData} = this.scheduleService.form.value;
    if (this.scheduleService.form.get('$id').value == null) {
      // insert
      this.auth.user$.subscribe(ref => {
        this.scheduleService.createSchedule(formData, ref.uid);
        this.scheduleService.form.reset();
      })

    } else {
      this.scheduleService.updateSchedule($id, formData);
      // this.scheduleService.form.reset();
    }

  }

}
