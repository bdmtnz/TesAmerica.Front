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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IApiResponse } from '../../../shared/models/api';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
export class DepartmentComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup

  data: IDepartmentReport[] = []
  displayedColumns: string[] = ['departmentId', 'departmentName', 'sales'];
  dataSource: MatTableDataSource<IDepartmentReport>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly http: HttpClient
  ) {
    this.formGroup = this.formBuilder.group({
      start: new FormControl({ value: new Date(), disabled: false }, { validators: [Validators.required] }),
      end: new FormControl({ value: new Date(), disabled: false }, { validators: [Validators.required] })
    })
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    
  }

  sendRequest() {
    this.http.post<IApiResponse<Array<IDepartmentReport>>>(`${environment.apiUrl}/Department`, 
      // {
      //   "start": "2024-04-25T18:37:31.470Z",
      //   "end": "2024-04-25T18:37:31.471Z"
      // }
      {
        ...this.formGroup.value
      }
    ).subscribe(resp => {
      this.data = resp.data
      this.dataSource = new MatTableDataSource(this.data);
      this.ngAfterViewInit()
    })
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

  submit() {
    if(this.formGroup.invalid) {
      this.formGroup.markAllAsTouched()
      return
    }
    this.sendRequest()
  }
}
