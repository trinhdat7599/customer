import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges {

  @Input() series!: any;
  @Input() title!: string;

  chart!: Chart;

  constructor() {
    this.initChart();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initChart();
    this.chart.addSeries(this.series, true, true);
  }


  initChart() {
    this.chart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: this.title,
      },
      credits: {
        enabled: false
      },
      series: this.series,
    });
  }

}
