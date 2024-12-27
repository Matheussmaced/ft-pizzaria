import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Armchair, AlignLeft, FileText, ScrollText, PackageSearch, CircleDollarSign, LogOut, Download, CircleChevronDown, Trash2, Pencil, CircleChevronUp, DollarSign, CircleX, Pizza } from 'lucide-angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LucideAngularModule.pick({Pencil, Download, Trash2, Armchair, FileText, ScrollText, PackageSearch, CircleDollarSign, LogOut, CircleChevronDown, CircleChevronUp, DollarSign, AlignLeft, CircleX, Pizza })
  ],
  exports: [
    LucideAngularModule
  ]
})
export class CustomIconsModule { }
