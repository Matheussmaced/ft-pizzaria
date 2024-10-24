import { Component } from '@angular/core';
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';

@Component({
  selector: 'app-specific-table-page',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule],
  templateUrl: './specific-table-page.component.html',
  styleUrl: './specific-table-page.component.scss'
})
export class SpecificTablePageComponent {

}
