import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ISellerReport } from '../../../shared/models/seller';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, map, startWith } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../../shared/models/api';
import { environment } from '../../../../environments/environment';

interface Item {
  id: number,
  name: string
}

interface NumberItem {
  name: number
}

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.scss'
})
export class SellerComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup
  displayedColumns: string[] = ['sellerId', 'sellerName', 'comission', 'month', 'year'];
  dataSource: MatTableDataSource<ISellerReport>;

  monthControl = new FormControl();
  yearControl = new FormControl();
  months: Item[] = [
    {id: 1, name: 'Enero'},
    {id: 2, name: 'Febrero'},
    {id: 3, name: 'Marzo'},
    {id: 4, name: 'Abril'},
    {id: 5, name: 'Mayo'},
    {id: 6, name: 'Junio'},
    {id: 7, name: 'Julio'},
    {id: 8, name: 'Agosto'},
    {id: 9, name: 'Septiembre'},
    {id: 10, name: 'Octubre'},
    {id: 11, name: 'Noviembre'},
    {id: 12, name: 'Diciembre'},
  ];
  years: NumberItem[] = [];
  filteredMonthOptions!: Observable<Item[]>;
  filteredYearOptions!: Observable<NumberItem[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly http: HttpClient
  ) {
    let now = new Date()
    let year = now.getFullYear()
    for (let index = year; index > year - 50; index--) {
      this.years.push({name: index})
    }

    this.formGroup = this.formBuilder.group({
      year: new FormControl({ value: undefined, disabled: false }, { validators: [Validators.required, Validators.min(1900)] }),
      month: new FormControl({ value: undefined, disabled: false }, { validators: [Validators.required, Validators.min(1), Validators.max(12)] })
    })

    let data: ISellerReport[] = []

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(data);
  }

  ngOnInit() {
    this.filteredMonthOptions = this.monthControl.valueChanges
      .pipe(
        startWith<string | Item>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterMonth(name) : this.months.slice())
      );
    this.filteredYearOptions = this.yearControl.valueChanges
      .pipe(
        startWith<string | NumberItem>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterYear(name.toString()) : this.years.slice())
      );
    this.yearControl.valueChanges.subscribe(data => {
      this.formGroup.controls['year'].setValue(data.name)
    })
    this.monthControl.valueChanges.subscribe(data => {
      this.formGroup.controls['month'].setValue(data.id)
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayFn(item: Item): string {
    return item ? item.name : '';
  }

  displayYearFn(item: NumberItem): string {
    return item ? item.name.toString() : '';
  }

  private _filterMonth(name: string): Item[] {
    const filterValue = name.toLowerCase();

    return this.months.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterYear(name: string): NumberItem[] {
    const filterValue = name.toLowerCase();

    return this.years.filter(option => option.name.toString().toLowerCase().indexOf(filterValue) === 0);
  }

  applyFilter(event: any) {
    let filterValue = event.target.value
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendRequest() {
    this.http.post<IApiResponse<Array<ISellerReport>>>(`${environment.apiUrl}/Seller/Report`, 
      // {
      //   "year": 0,
      //   "month": 0
      // }
      {
        ...this.formGroup.value
      }
    ).subscribe(resp => {
      this.dataSource = new MatTableDataSource(resp.data);
      this.ngAfterViewInit()
    })
  }
}
