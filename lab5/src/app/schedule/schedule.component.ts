import {Component, OnInit} from '@angular/core';
import {ScheduleService} from "../services/schedule.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  schedule: any;
  formControls = this.scheduleService.form.controls;
  searchString: string;

  allSchedules = [];

  constructor(public scheduleService: ScheduleService, private formBuilder: FormBuilder, public auth: AuthService) {
  }

  ngOnInit(): void {
    this.loadSchedules();

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
