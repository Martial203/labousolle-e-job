import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Testimonial } from '../../models/testimonial/testimonial';
import { Cacheable } from 'ts-cacheable';

@Injectable({
  providedIn: 'root',
})
export class TestimonyService {
  
  constructor(private http: HttpClient) {}

  sendTestimonial(rate: number, comment: string): Observable<any>{
    const body = {
      rating: rate,
      content: comment
    }
    return this.http.post<any>(`${environment.apiUrl}/testimonies/`, body)
  }

  @Cacheable({ maxAge: 1000 * 3600 * 24})
  getTestimonies(): Observable<Testimonial[]>{
    return this.http.get<any>(`${environment.apiUrl}/testimonies/`).pipe(
      map(res => this.mapResToTestimonials(res))
    )
  }

  private mapResToTestimonials(testimonials: any[]): Testimonial[]{
    return testimonials.map(val => {
      const testimonial: Testimonial = {
        author: val.author_name,
        rating: val.rating,
        comment: val.content,
        date: new Date(val.updated_date)
      }
      return testimonial;
    })
  }

}
