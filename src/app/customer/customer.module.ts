import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { MatButtonModule } from '@angular/material/button';
import { CustomerDetailDialogComponent } from './customer-detail-dialog/customer-detail-dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        CustomerComponent,
        CustomerDetailDialogComponent,
    ],
    imports: [
        MatTableModule,
        MatSortModule,
        CustomerRoutingModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        CommonModule,
        MatMenuModule,
        MatListModule,
    ],
    providers: [],
})
export class CustomerModule { }
