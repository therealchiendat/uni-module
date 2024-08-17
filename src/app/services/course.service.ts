import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:8000';
  private extension = 'courses';
  private coursesURL = `${this.apiUrl}/${this.extension}`;
  endpoints = {
    get_all: `${this.coursesURL}/all`,
    get: `${this.coursesURL}`,
    create: `${this.coursesURL}`,
    update: `${this.coursesURL}`,
    delete: `${this.coursesURL}`,
  };

  constructor(private http: HttpClient) {}
  
  // Main CRUD methods
  getAllCourses(skip: number = 0, limit: number = 10): Observable<{ courses: Course[], total: number }> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    return this.http.get<{ courses: Course[], total: number }>(this.endpoints.get_all, { params });
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.endpoints.get}/${id}`);
  }

  searchCourses(searchTerm: string, skip: number = 0, limit: number = 10): Observable<{ courses: Course[], total: number }> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    if (searchTerm) {
      params = params.set('search_term', searchTerm);
    }

    return this.http.get<{ courses: Course[], total: number }>(this.endpoints.get, { params });
  }
  
  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.endpoints.create, course);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.endpoints.update}/${course.id}`, course);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.endpoints.delete}/${id}`);
  }

  // Quality of life methods
  getUniversities(): string[] {
    return ['Harvard University', 'Stanford University', 'MIT'];
  }

  getCountries(): string[] {
    return ['USA', 'Canada', 'UK'];
  }

  getCities(): string[] {
    return ['Cambridge', 'Toronto', 'London'];
  }

  getCurrencies() {
    return ['USD', 'CAD', 'GBP'];
  }
}
