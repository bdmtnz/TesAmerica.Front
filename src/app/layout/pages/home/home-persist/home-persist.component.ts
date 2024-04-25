import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { IItem } from '../../../../shared/models/item';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { IOrder } from '../../../../shared/models/order';
import { environment } from '../../../../../environments/environment';
import { IApiResponse } from '../../../../shared/models/api';
import { IClient } from '../../../../shared/models/client';
import { ISeller } from '../../../../shared/models/seller';
import { IProduct } from '../../../../shared/models/product';
import { Router } from '@angular/router';

interface Item {
  id: string,
  name: string,
  tag?: string
}

@Component({
  selector: 'app-home-persist',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatStepperModule,
    MatButtonModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTableModule,
    AsyncPipe,
    CurrencyPipe
  ],
  templateUrl: './home-persist.component.html',
  styleUrl: './home-persist.component.scss'
})
export class HomePersistComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['productId', 'price', 'quantity', 'subtotal'];
  dataSource: MatTableDataSource<IItem>;

  @ViewChild(MatSort) sort!: MatSort;

  clientId: FormControl
  sellerId: FormControl
  productId: FormControl
  firstFormGroup: FormGroup
  secondFormGroup: FormGroup

  data: IItem[] = []
  
  filteredClientOptions!: Observable<Item[]>;
  filteredSellerOptions!: Observable<Item[]>;
  filteredProductOptions!: Observable<Item[]>;

  clients: Item[] = [];
  sellers: Item[] = [];
  products: Item[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.clientId = new FormControl({ value: undefined, disabled: false }, { validators: [ Validators.required ] })
    this.sellerId = new FormControl({ value: undefined, disabled: false }, { validators: [ Validators.required ] })
    this.productId = new FormControl({ value: undefined, disabled: false }, { validators: [ Validators.required ] })
    this.firstFormGroup = this.formBuilder.group({
      id: new FormControl({ value: '', disabled: false}, { validators: [ ] }),
      clientId: new FormControl({ value: '', disabled: false}, { validators: [ Validators.required, Validators.minLength(1) ] }),
      date: new FormControl({ value: new Date(), disabled: false}, { validators: [ Validators.required ] }),
      sellerId: new FormControl({ value: '', disabled: false}, { validators: [ Validators.required, Validators.minLength(1) ] })
    })
    this.secondFormGroup = this.formBuilder.group({
      orderId: new FormControl({ value: '', disabled: false}, { validators: [ ] }),
      productId: new FormControl({ value: '', disabled: false}, { validators: [ Validators.required ] }),
      price: new FormControl({ value: 0, disabled: true}, { validators: [ Validators.required ] }),
      quantity: new FormControl({ value: 1, disabled: false}, { validators: [ Validators.required, Validators.min(1) ] }),
      subtotal: new FormControl({ value: 0, disabled: true}, { validators: [ Validators.required ] })
    })

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    this.filteredClientOptions = this.clientId.valueChanges
      .pipe(
        startWith<string | Item>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.clients) : this.clients.slice())
      );
    this.filteredSellerOptions = this.sellerId.valueChanges
      .pipe(
        startWith<string | Item>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.sellers) : this.sellers.slice())
      );
    this.filteredProductOptions = this.productId.valueChanges
      .pipe(
        startWith<string | Item>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.products) : this.products.slice())
      );
    this.clientId.valueChanges.subscribe(data => {
      this.firstFormGroup.patchValue({ 'clientId': data.id })
    })
    this.sellerId.valueChanges.subscribe(data => {
      this.firstFormGroup.patchValue({ 'sellerId': data.id })
    })
    this.firstFormGroup.valueChanges.subscribe(data => {
      console.log('1er Form:', data)
    })
    this.productId.valueChanges.subscribe(data => {
      let price = Number(data.tag)
      let quantity = Number(this.secondFormGroup.controls['quantity'].value)
      this.secondFormGroup.patchValue({ 'productId': data.id })
      this.secondFormGroup.patchValue({ 'price': price })
      this.secondFormGroup.patchValue({ 'subtotal': Number(price * quantity)  })
    })
    this.secondFormGroup.controls['quantity'].valueChanges.subscribe(data => {
      let price = Number(this.secondFormGroup.controls['price'].value)
      this.secondFormGroup.patchValue({ 'subtotal': Number(data * price)  })
    })
    this.secondFormGroup.valueChanges.subscribe(data => {
      console.log('2do Form:', data)
    })
    this.sendClientRequest("")
    this.sendSellerRequest("")
    this.sendProductRequest("")
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  displayFn(item: Item): string {
    return item ? item.name : '';
  }

  private _filter(name: string, source: Item[]): Item[] {
    const filterValue = name.toLowerCase();

    return source.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  addItem() {
    if(this.secondFormGroup.invalid) {
      this.secondFormGroup.markAllAsTouched()
      return
    }
    let item = {
      ...this.secondFormGroup.value,
      price: this.secondFormGroup.controls['price'].value,
      quantity: this.secondFormGroup.controls['quantity'].value,
      subtotal: this.secondFormGroup.controls['subtotal'].value
    }
    console.log('Agregando item:', item)
    this.data.push(item)    
    this.dataSource = new MatTableDataSource(this.data);
    this.secondFormGroup.reset()
    this.productId.reset()
  }

  sendClientRequest(searchWord: string) {
    this.http.post<IApiResponse<Array<IClient>>>(`${environment.apiUrl}/Client/GetByName`, 
      {
        "name": searchWord
      }
    )
    .subscribe(resp => {
      this.clients = resp.data
    })
  }

  sendSellerRequest(searchWord: string) {
    this.http.post<IApiResponse<Array<ISeller>>>(`${environment.apiUrl}/Seller/GetByName`, 
      {
        "name": searchWord
      }
    )
    .subscribe(resp => {
      this.sellers = resp.data
    })
  }

  sendProductRequest(searchWord: string) {
    this.http.post<IApiResponse<Array<IProduct>>>(`${environment.apiUrl}/Product`, 
      {
        "name": searchWord
      }
    )
    .subscribe(resp => {
      this.products = resp.data.map(item => {
        return {
          id: item.id,
          name: item.name,
          tag: item.price.toString()
        }
      })
    })
  }

  sendRequest(order: IOrder, items: IItem[]) {
    this.http.post<IApiResponse<any>>(`${environment.apiUrl}/Order`, 
      {
        "order": order,
        "items": items
      }
    )
    .subscribe(resp => {
      console.log(resp)
      this.router.navigateByUrl('/')
    })
  }

  submit() {
    if(this.data.length <= 0) {
      this.secondFormGroup.reset()
      this.productId.reset()
      this.secondFormGroup.markAllAsTouched()
      return
    }
    //Se envía la petición
    console.log('Enviando petición')
    this.sendRequest(this.firstFormGroup.value, this.data)
  }
}
