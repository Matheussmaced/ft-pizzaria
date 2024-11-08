import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CustomIconsModule]
})
export class SideMenuComponent {
  menuOpen = false;
  isDesktop = window.innerWidth > 980;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isDesktop = window.innerWidth > 980;

    if (this.isDesktop) {
      this.menuOpen = true;
    } else {
      this.menuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {

    if (!this.isDesktop && this.menuOpen) {
      const target = event.target as HTMLElement;
      const isInsideMenu = target.closest('.main-container') || target.closest('.burguer-menu');

      if (!isInsideMenu) {
        this.menuOpen = false;
      }
    }
  }
}
