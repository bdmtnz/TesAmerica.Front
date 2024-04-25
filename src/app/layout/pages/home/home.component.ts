import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IOrder } from '../../../shared/models/order';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HomePersistModalComponent } from './components/home-persist-modal/home-persist-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'clientId', 'sellerId', 'date'];
  dataSource: MatTableDataSource<IOrder>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private readonly router: Router
  ) {
    let data: IOrder[] = [
      {
        clientId: '1',
        date: new Date(),
        id: '2',
        sellerId: '3'
      },
      {
        clientId: '1',
        date: new Date(),
        id: 'lol',
        sellerId: '3'
      },
      {
        clientId: '1',
        date: new Date(),
        id: '2',
        sellerId: '3'
      },
      {
        clientId: '1',
        date: new Date(),
        id: '2',
        sellerId: '3'
      },
      {
        clientId: '1',
        date: new Date(),
        id: '2',
        sellerId: '3'
      },
      {
        clientId: '1',
        date: new Date(),
        id: '2',
        sellerId: '3'
      },
      {
        clientId: '1',
        date: new Date(),
        id: '2',
        sellerId: '3'
      },
      {
        clientId: '8',
        date: new Date(),
        id: '2',
        sellerId: '3'
      },
      {
        clientId: '1',
        date: new Date(),
        id: '2',
        sellerId: '3'
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

  openDialog(): void {
    const dialogRef = this.dialog.open(HomePersistModalComponent, {
      // width: '250px',
      data: {name: 'Name value', animal: 'Animal value'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with this result: ', result);
      // this.animal = result;
    });
  }

  goToPersist() {
    this.router.navigateByUrl('/persist')
  }
}
