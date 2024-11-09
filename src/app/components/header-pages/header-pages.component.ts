import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ButtonHeaderComponent } from "../button-header/button-header.component";

@Component({
  selector: 'app-header-pages',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ButtonHeaderComponent],
  templateUrl: './header-pages.component.html',
  styleUrl: './header-pages.component.scss'
})
export class HeaderPagesComponent {
  @Input() title:string = "";
  @Input() nameButton:string = ""
  @Input() showButton:boolean = true;
}
