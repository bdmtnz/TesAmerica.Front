import { Component, DoCheck } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PathTitle } from '../../models/utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements DoCheck{
  title: string = ''

  constructor(private readonly location: Location) {    
  }

  ngDoCheck(): void {
    this.title = PathTitle[window.location.pathname]
  }

  goBack() {
    this.location.back()
  }
}
