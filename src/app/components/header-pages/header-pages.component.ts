import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTableDialogComponent } from '../add-table-dialog/add-table-dialog.component';

@Component({
  selector: 'app-header-pages',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './header-pages.component.html',
  styleUrl: './header-pages.component.scss'
})
export class HeaderPagesComponent {
  @Input() nameButton:string = "";
  @Input() title:string = "";

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
