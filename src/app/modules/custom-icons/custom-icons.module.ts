import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Armchair, FileText, ScrollText, PackageSearch, CircleDollarSign, LogOut, Download, CircleChevronDown, Trash2, Pencil } from 'lucide-angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LucideAngularModule.pick({Pencil, Download, Trash2, Armchair, FileText, ScrollText, PackageSearch, CircleDollarSign, LogOut, CircleChevronDown})
  ],
  exports: [
    LucideAngularModule
  ]
})
export class CustomIconsModule { }
