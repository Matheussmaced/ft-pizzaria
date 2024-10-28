import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AddTableDialogComponent } from '../add-table-dialog/add-table-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-button-header',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './button-header.component.html',
  styleUrl: './button-header.component.scss'
})
export class ButtonHeaderComponent {
  @Input() nameButton:string = "";
  @Input() showButton:boolean = true;

  constructor(private dialog: MatDialog){}

  openAddTableDialog():void{
    const dialogRef = this.dialog.open(AddTableDialogComponent, {
      width: '30rem',
      panelClass: 'custom-dialog-container',
      backdropClass: 'custom-backdrop',
      position: {top: '-38rem', left: '40%' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.success){
        console.log("Mesa adicionada com sucesso");
      }
    })
  }
}
