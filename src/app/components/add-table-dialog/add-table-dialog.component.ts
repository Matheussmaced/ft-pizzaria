import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-table-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
    ],
  templateUrl: './add-table-dialog.component.html',
  styleUrl: './add-table-dialog.component.scss'
})
export class AddTableDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddTableDialogComponent>){}

  onCancel(): void{
    this.dialogRef.close();
  }
  onAdd():void{
    console.log("adicionou")
    this.dialogRef.close({success:true});
  }
}
