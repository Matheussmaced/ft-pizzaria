import { Component, Input, OnInit } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { FinancialService } from '../../services/financial.service';
import { HttpClientModule } from '@angular/common/http';
import { Financial } from '../../../model/financial/Financial';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-container-summary',
  standalone: true,
  imports: [ CustomIconsModule, HttpClientModule, CommonModule ],
  templateUrl: './container-summary.component.html',
  styleUrl: './container-summary.component.scss',
  providers: [ FinancialService ]
})
export class ContainerSummaryComponent implements OnInit {
  financials: Financial[] = [];
  @Input() filteredMonth: Financial[] = [];
  @Input() title: string = "";
  @Input() typeOfValueInformation: keyof Financial = "";
  @Input() icon: string = "";
  @Input() classIcon: string = "";
  @Input() classMainContainer: string = "";

  constructor(private financialService: FinancialService) {}

  ngOnInit(): void {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();

    this.financialService.getFinancial().subscribe((data: Financial[]) => {
      this.financials = data;
    });
  }

  getFinancialValue(financial: Financial): number {
    return financial[this.typeOfValueInformation] as number;
  }
}
