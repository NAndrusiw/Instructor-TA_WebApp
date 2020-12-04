import { Component, OnInit } from '@angular/core';
import {CoursesService} from "../shared/courses.service";
import {AuthService} from "../services/auth.service";
import FuzzySearch from 'fuzzy-search';
import {ScheduleService} from "../services/schedule.service";
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private coursesService: CoursesService, public scheduleService: ScheduleService, public auth: AuthService) {
  }

  searchInput: string;
  allCourses;
  filteredCourses;
  allSchedules: any;

  subjectInput: string;
  searchComponent: string;

  ngOnInit(): void {
    this.getCourses();
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

    this.filteredCourses = this.allCourses;

  });

  getAllSubjects() {
    let all = this.allCourses.map(item => {
      return item.subject;
    });
    return [...new Set(all)].sort(); // all unique
  }



  search() {

    // console.log('searching')

    if (this.searchInput === "" || this.searchComponent === "" || this.subjectInput === "") {
      this.filteredCourses = this.allCourses;
    }

    if (this.allCourses.length === 0) {
      return;
    }


    this.filteredCourses = this.filteredCourses.filter(item => {


      if (this.subjectInput && !this.searchComponent) {
        return item.subject === this.subjectInput;
      } else if (!this.subjectInput && this.searchComponent) {
        return item.component === this.searchComponent;
      } else if (this.subjectInput && this.searchComponent) {
        return item.subject === this.subjectInput && item.component === this.searchComponent;
      }
      return true;
    });


    const searcher = new FuzzySearch(this.filteredCourses, ['name', 'id', 'number', 'subject'], {
      caseSensitive: false,
      sort: true,
    });

    this.filteredCourses = searcher.search(this.searchInput);

  }
}
