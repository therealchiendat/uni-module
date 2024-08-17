import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseBuilderComponent } from './components/course-builder/course-builder.component';

export const appRoutes: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'create', component: CourseBuilderComponent },
  { path: 'edit/:id', component: CourseBuilderComponent },
  // Add other routes here as needed
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect unknown routes to home
];
