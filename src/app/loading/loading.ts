import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule, MatCardModule ],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {}
