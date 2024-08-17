import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-builder',
  templateUrl: './course-builder.component.html',
  styleUrls: ['./course-builder.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ]
})
export class CourseBuilderComponent implements OnInit {
  @Input() course: Course | null = null;
  courseForm: FormGroup;
  isEditMode: boolean = false;
  editId: string = '';
  disabledFields = ['course_name', 'university', 'country', 'city'];
  filteredUniversities: Observable<string[]> = new Observable();
  filteredCountries: Observable<string[]> = new Observable();
  filteredCities: Observable<string[]> = new Observable();
  filteredCurrencies: Observable<string[]> = new Observable();

  constructor(private fb: FormBuilder, private courseService: CourseService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.courseForm = this.fb.group({
      course_name: ['', Validators.required],
      university: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      currency: ['', Validators.required], 
      price: [0, Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      course_description: [''],
    });
  }

  ngOnInit(): void {
    // if url has `edit/:id`, then we are in edit mode)
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      this.editId = id!;
      this.isEditMode = true;
      if (id) {
        this.fetchCourseData(id);
      }
    });
    this.filteredUniversities = this.courseForm.get('university')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.courseService.getUniversities()))
    );

    this.filteredCountries = this.courseForm.get('country')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.courseService.getCountries()))
    );

    this.filteredCities = this.courseForm.get('city')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.courseService.getCities()))
    );

    this.filteredCurrencies = this.courseForm.get('currency')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.courseService.getCurrencies()))
    );
    
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  fetchCourseData(id: string): void {
    this.courseService.getCourseById(id).subscribe(course => {
      this.courseForm.patchValue(course);
      this.disabledFields.forEach(field => this.courseForm.get(field)!.disable());
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.getRawValue();
      formValue.start_date = formValue.start_date ? this.formatDate(formValue.start_date) : null;
      formValue.end_date = formValue.end_date ? this.formatDate(formValue.end_date) : null;
      if (this.isEditMode) {
        formValue.id = this.editId;
        this.courseService.updateCourse(formValue).subscribe();
      } else {
        this.courseService.createCourse(formValue).subscribe();
      }
    }
    this.router.navigateByUrl('/');

  }

  onCancel(): void {
    this.router.navigateByUrl('/');
  }
}
