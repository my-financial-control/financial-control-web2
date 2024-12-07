import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/types/transaction.type';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrl: './extract.component.scss'
})
export class ExtractComponent implements OnInit {
  transactions: Transaction[] = [];
  columnsToDisplay = ['title', 'description', 'value', 'type', 'currentMonth', 'date'];

  constructor(private readonly transactionService: TransactionService) { }

  ngOnInit() {
    this.getTransactions();
  }

  getTransactions() {
    this.transactionService.getAll().subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}