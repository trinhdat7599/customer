import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Customer } from "src/models/customer.model";


@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(
        private httpClient: HttpClient,
    ) { }

    getCustomerData() {
        return this.httpClient.get<Customer[]>('./assets/customers.json');
    }
}