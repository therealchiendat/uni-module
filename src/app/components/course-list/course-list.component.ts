import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import { MatError } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
  courses: any = new MatTableDataSource<Course[]>([]);
  isLoading = true;
  duration: number[] = [];
  error = '';
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  skip = (this.pageIndex + 1) * this.pageSize;
  limit = this.pageSize; 
  pageSizeOptions = [5, 10, 25];
  pageEvent!: PageEvent;

  constructor(private courseService: CourseService, private searchService: SearchService, private router: Router, private route: ActivatedRoute) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngAfterViewInit() {
    this.courses.paginator = this.paginator;
  }

  getDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  }

  editCourse(id: string): void {
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

  handleNext = (data: any) => {
    this.courses = data;
    this.isLoading = false;
  };
  handleErr = (err: any) => {
    this.error = 'Failed to load courses';
    this.isLoading = false;
  }

  loadCourses(searchTerm: string = ''): void {
    this.isLoading = true;
    searchTerm
    ? this.courseService.searchCourses(searchTerm).subscribe({
      next: (data) => this.handleNext(data),
      error: (err) => this.handleErr(err),
    }) 
    : this.courseService.getAllCourses((this.pageIndex + 1) * this.pageSize, this.pageSize).subscribe({
      next: (data) => this.handleNext(data),
      error: (err) => this.handleErr(err),
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.skip = (this.pageIndex + 1) * this.pageSize;
    this.limit = this.pageSize;
    this.courseService.getAllCourses(this.skip, this.limit).subscribe({
      next: (data) => this.handleNext(data),
      error: (err) => this.handleErr(err),
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnInit(): void {
    // Subscribe to the search term observable
    this.searchService.searchTerm$.subscribe((term) => {
      term ? this.loadCourses(term) : this.loadCourses();
    });
    this.courseService.getTotalCourses().subscribe((data: number) => {
      this.length = data;
    });
  }
}
