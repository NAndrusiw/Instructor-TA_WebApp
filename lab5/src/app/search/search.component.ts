import { Component, OnInit } from '@angular/core';
import {CoursesService} from "../shared/courses.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private coursesService: CoursesService) { }

  allCourses;

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses = () => this.coursesService.getAll().subscribe(res => this.allCourses = res);
}
