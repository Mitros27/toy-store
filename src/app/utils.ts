import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ToyModel } from "../model/toy.model";
@Injectable({
    providedIn: 'root'
})
export class Utils{
    constructor(private sanitizer: DomSanitizer){}
   getImageUrl(toy: ToyModel): SafeUrl {
        const url = 'https://toy.pequla.com' + toy.imageUrl
        return this.sanitizer.bypassSecurityTrustUrl(url)
    }
    formatPrice(price: number){
        return price.toLocaleString('sr-Rs') + ' RSD'
    }
    formatDate(dateString: string){
        return new Date(dateString).toLocaleDateString('sr-RS', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }
}