import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IDepartmentReport } from '../../../shared/models/department';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent implements AfterViewInit {
  displayedColumns: string[] = ['departmentId', 'departmentName', 'sales'];
  dataSource: MatTableDataSource<IDepartmentReport>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    let data: IDepartmentReport[] = [
      {
        departmentId: '1',
        departmentName: 'Sales',
        sales: 20000
      },
      {
        departmentId: '1',
        departmentName: 'Sales',
        sales: 20000
      },
      {
        departmentId: '1',
        departmentName: 'System',
        sales: 20000
      },
      {
        departmentId: '1',
        departmentName: 'X',
        sales: 20000
      },
      {
        departmentId: '1',
        departmentName: 'Y',
        sales: 80000
      }
    ]

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(data);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: any) {
    let filterValue = event.target.value
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
