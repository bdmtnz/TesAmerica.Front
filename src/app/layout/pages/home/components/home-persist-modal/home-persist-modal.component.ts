import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from './home-persist-modal.model';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-persist-modal',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './home-persist-modal.component.html',
  styleUrl: './home-persist-modal.component.scss'
})
export class HomePersistModalComponent {
  formGroup: FormGroup
  constructor(
    public dialogRef: MatDialogRef<HomePersistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      id: new FormControl({ value: '', disabled: false}, { validators: [ ] }),
      clientId: new FormControl({ value: '', disabled: false}, { validators: [ Validators.required ] }),
      date: new FormControl({ value: new Date(), disabled: false}, { validators: [ Validators.required ] }),
      sellerId: new FormControl({ value: '', disabled: false}, { validators: [ Validators.required ] })
    })
    /*
    {
      id: string,
      clientId: string,
      date: Date,
      sellerId: string
    }
    */
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
