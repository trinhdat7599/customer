import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeriesOptionsType } from 'highcharts';
import { debounceTime } from 'rxjs';
import { MODE } from 'src/constants/customer.constant';
import { Customer } from 'src/models/customer.model';
import { CustomerService } from 'src/services/customer.service';
import { ExportService } from 'src/services/export.service';
import { MyErrorStateMatcher } from 'src/services/handle-error-message.service';
import { CustomerDetailDialogComponent } from './customer-detail-dialog/customer-detail-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = ['id', 'name', 'age', 'sex', 'type', 'action'];

  exportColumns: string[] = ['id', 'name', 'age', 'sex', 'type'];

  dataSource: MatTableDataSource<Customer> = new MatTableDataSource();

  searchControl = new FormControl('');

  matcher = new MyErrorStateMatcher();

  series!: SeriesOptionsType[]

  get newDataSource() {
    const currentData = [] as any;
    this.dataSource.data.filter(e => currentData.push({ ...e }));
    return currentData;
  }

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.getCustomerDataSource();
    this.searchControl.valueChanges.pipe(debounceTime(1000)).subscribe(changedValue => {
      this.dataSource.filter = changedValue;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getCustomerDataSource() {
    this.customerService.getCustomerData().subscribe((res) => {
      this.dataSource.data = res;
      this.parseDataSourceToSeriesChart();
    });
  }

  onSorting(evt: any) {
    if (evt.direction) {
      this.liveAnnouncer.announce(`Sorted ${evt.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  onCreate() {
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, {
      width: '500px',
    });
    dialogRef.componentInstance.mode = MODE.CREATE;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newObj = {
          ...result,
          id: this.dataSource.data.length + 1,
        }
        const data = this.dataSource.data;
        data.push(newObj);
        this.dataSource.data = data;
        this.parseDataSourceToSeriesChart();
      }
    });
  }

  onEdit(ele: Customer) {
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, {
      width: '500px',
    });
    dialogRef.componentInstance.mode = MODE.EDIT;
    dialogRef.componentInstance.data = ele;

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.data = this.dataSource.data.map(e => {
        if (e.id === result.id) {
          return result;
        }
        return e;
      });
      this.parseDataSourceToSeriesChart();
    });
  }

  onRemove(ele: Customer) {
    if (window.confirm("Are you sure to want remove this record?")) {
      const newData = this.dataSource.data.filter(e => e.id !== ele.id);
      this.dataSource.data = newData.map((e, index) => ({ ...e, id: index + 1 }));
      this.parseDataSourceToSeriesChart();
    }
  }

  onExportToExcel(col?: string[] | null) {
    if (col) {
      const data = this.removeObjNotInclude(col, this.newDataSource);
      this.exportService.exportAsExcelFile(data, 'customer');
    } else {
      this.exportService.exportAsExcelFile(this.dataSource.data, 'customer');
    }
  }

  onExportToPdf(col?: string[] | null) {
    if (col) {
      let data = this.removeObjNotInclude(col, this.newDataSource);
      data = data.map((e: any) => Object.values(e));
      this.exportService.exportAsPdfFile(col, data);
    } else {
      let data = this.dataSource.data as any;
      data = data.map((e: any) => Object.values(e))
      this.exportService.exportAsPdfFile(this.exportColumns, data);
    }
  }

  removeObjNotInclude(col: string[] | null, source: any) {
    const data = [...source] as any;
    const l = new Set(col);

    for (let obj of data) {
      for (let prop of Object.keys(obj)) {
        if (!l.has(prop)) {
          delete obj[prop];
        }
      }
    }
    return data;
  }

  parseDataSourceToSeriesChart() {
    let rawData: any = {};
    rawData.name = 'Quantity';
    rawData.type = 'pie';
    rawData.data = [];
    const rawSource = _.groupBy(this.dataSource.data, x => x.type);
    Object.keys(rawSource).forEach(e => {
      if (e === undefined) {
        rawData.data.push({
          name: 'Others',
          y: rawSource[e].length,
        });
      } else {
        rawData.data.push({
          name: e,
          y: rawSource[e].length,
        });
      }
    });
    this.series = rawData;
  }
}
