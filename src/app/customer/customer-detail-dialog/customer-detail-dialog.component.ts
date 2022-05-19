import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MODE, SEX, TYPE_OF_CUSTOMER } from 'src/constants/customer.constant';
import { Customer } from 'src/models/customer.model';

@Component({
  selector: 'app-customer-detail-dialog',
  templateUrl: './customer-detail-dialog.component.html',
  styleUrls: ['./customer-detail-dialog.component.scss']
})
export class CustomerDetailDialogComponent implements OnInit {

  mode: number = MODE.VIEW;

  sexList = SEX;

  typeList = TYPE_OF_CUSTOMER;

  data!: Customer;

  customerForm!: FormGroup;

  get nameControl() {
    return this.customerForm.get('name');
  }

  constructor(
    private dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.customerForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      age: [''],
      sex: [''],
      type: ['', Validators.required],
    });
    if (this.data) {
      this.customerForm.patchValue(this.data);
    }

    switch (this.mode) {
      case MODE.EDIT:
        this.customerForm.enable();
        break;
      case MODE.VIEW:
        this.customerForm.disable();
        break;
      case MODE.CREATE:
        this.customerForm.reset();
        this.customerForm.enable();
        break;
      default:
        break;
    }
  }

  closeDialog(value: any) {
    this.dialogRef.close(value);
  }

  onSave() {
    if (this.customerForm.valid) {
      this.closeDialog(this.customerForm.value);
    }
  }

}
