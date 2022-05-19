import { NgModule } from '@angular/core';
import { ChartModule } from 'angular-highcharts';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

@NgModule({
    declarations: [
        PieChartComponent,
    ],
    imports: [
        ChartModule
    ],
    exports: [PieChartComponent],
    providers: [],
})
export class PieChartModule { }
