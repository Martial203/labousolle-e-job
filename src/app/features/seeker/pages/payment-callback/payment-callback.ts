import { Component } from '@angular/core';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment/payment.service';

export interface Payment {
  id: string;
  reference: string;
  merchant_reference: string;
  amount: number;
  currency: string;
  status: string;
  status_display: string;
  payment_method: string;
  completed_at: Date;
}

@Component({
  selector: 'app-payment-callback',
  standalone: false,
  templateUrl: './payment-callback.html',
  styleUrls: ['./payment-callback.scss'],
})
export class PaymentCallback {
  payment!: Payment;
  processState: ProcessState = ProcessState.LOADING;
  readonly PROCESS_STATES = ProcessState;
  
  paymentMethodDisplay!: string;
  formattedDate!: string;

  constructor(private paymentService: PaymentService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const reference = this.route.snapshot.queryParams['reference'];
    this.processState = ProcessState.LOADING;

    this.paymentService.verifyPayment(reference).subscribe({
      next: (res) => {
        this.payment = res;
        this.processState = ProcessState.SUCCESS;
        this.formatPaymentMethod();
        this.formatDate();
        setTimeout(() => this.router.navigate(['/cv-builder']), 5000);
      },
      error: (err) => {
        console.error(err);
        this.processState = ProcessState.ERROR;
      }
    });
  }

  private formatPaymentMethod() {
    const methodMap: { [key: string]: string } = {
      'cm.orange': 'Orange Money',
      'cm.mtng': 'MTN Mobile Money',
      'card': 'Carte bancaire'
    };
    this.paymentMethodDisplay = methodMap[this.payment.payment_method] || this.payment.payment_method;
  }

  private formatDate() {
    const date = new Date(this.payment.completed_at);
    this.formattedDate = date.toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}