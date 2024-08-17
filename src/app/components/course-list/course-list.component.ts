import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import { MatError } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatProgressSpinnerModule, 
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatError, 
    MatIcon,
    MatPaginator,
    MatTooltip
  ],
})

export class CourseListComponent implements OnInit {
  displayedColumns: string[] = ['course_name', 'university', 'city', 'country', 'start_date', 'duration', 'price'];
  courses: any = [];
  isLoading = true;
  duration: number[] = [];
  error = '';

  constructor(private courseService: CourseService, private searchService: SearchService, private router: Router, private route: ActivatedRoute) {}

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  getDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  }

  editCourse(id: string): void {
    console.log('edit course', id);
    this.router.navigateByUrl(`/edit/${id}`);
  }

  deleteCourse(id: string): void {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.loadCourses();
      },
      error: (err) => {
        this.error = 'Failed to delete course';
      },
    });
  }

  loadCourses(searchTerm: string = ''): void {
    this.isLoading = true;
    const handleNext = (data: any) => {
      this.courses = new MatTableDataSource<Course[]>(data);
      this.isLoading = false;
    };
    const handleErr = (err: any) => {
      this.error = 'Failed to load courses';
      this.isLoading = false;
    }
    searchTerm
    ? this.courseService.searchCourses(searchTerm).subscribe({
      next: (data) => handleNext(data),
      error: (err) => handleErr(err),
    }) 
    : this.courseService.getAllCourses().subscribe({
      next: (data) => handleNext(data),
      error: (err) => handleErr(err),
    });
  }

  ngOnInit(): void {
    // Subscribe to the search term observable
    this.searchService.searchTerm$.subscribe((term) => {
      term ? this.loadCourses(term) : this.loadCourses();
    });
  }
}
