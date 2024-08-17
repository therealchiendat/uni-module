import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatError, MatFormField } from '@angular/material/form-field';
import { Router, RouterOutlet } from '@angular/router';
import { CourseListComponent } from './components/course-list/course-list.component';
import { FormsModule } from '@angular/forms';
import { SearchService } from './services/search.service';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    CommonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatError,
    RouterOutlet,
    CourseListComponent,
    FormsModule,
    MatButton,
    MatInput,
    MatFormField
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'uni-module';
  searchQuery: string = '';
  private searchTimeout: any = null;
  private readonly debounceTime = 500;

  constructor(private searchService: SearchService, private router: Router) {}

  // Method to handle input changes
  onInputChange(): void {
    // Clear the previous timeout if the user is still typing
    clearTimeout(this.searchTimeout);

    // Set a new timeout to execute the search after the debounce time
    this.searchTimeout = setTimeout(() => {
      this.onSearch();
    }, this.debounceTime);
  }

  handleCreateClick(): void {
    this.router.navigateByUrl('/create');
  } 

  onSearch(): void {
      this.searchService.updateSearchTerm(this.searchQuery);
      this.router.navigate(['/'], { queryParams: { search: this.searchQuery } });
  }
}
