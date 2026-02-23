import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  
  constructor(private http: HttpClient) {}

  verifyPayment(reference: string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/payments/${reference}/verify/`).pipe(
      map(res => ({
        id: res.payment.id,
        reference: res.payment.reference,
        merchant_reference: res.payment.merchant_reference,
        amount: res.payment.amount,
        currency: res.payment.currency,
        status: res.payment.status,
        status_display: res.payment.status_display,
        payment_method: res.payment.paymen_method,
        completed_at: new Date(res.payment.completed_at)
      }))
    );
  }
}
