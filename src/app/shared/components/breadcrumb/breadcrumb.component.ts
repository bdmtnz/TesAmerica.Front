import { Component, DoCheck } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PathTitle } from '../../models/utils';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  path: string = ''

  constructor(
    private readonly location: Location,
    private readonly router: Router
  ) { }

  ngDoCheck(): void {
    this.path = window.location.pathname
    this.title = PathTitle[this.path]
  }

  get showBack() {
    return this.path === '/' ? false : true
  }

  goBack() {
    this.location.back()
  }

  goHome() {
    this.router.navigateByUrl('/')
  }
}
