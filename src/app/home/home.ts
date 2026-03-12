import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatExpansionModule } from '@angular/material/expansion'

import { ToyModel, ToyTypeModel, AgeGroupModel } from '../../model/toy.model'
import { ToyService } from '../services/toy.service'
import { CartService } from '../services/cart.service'
import { AuthService } from '../services/auth.service'
import { Utils } from '../utils'
import { Loading } from '../loading/loading'
import { Alerts } from '../alerts'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    Loading,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  toys = signal<ToyModel[]>([])
  types = signal<ToyTypeModel[]>([])
  ageGroups = signal<AgeGroupModel[]>([])

  // Filteri
  searchText: string = ''
  selectedType: number | null = null
  selectedAgeGroup: number | null = null
  selectedTargetGroup: string = ''
  minPrice: number | null = null
  maxPrice: number | null = null
  dateFrom: Date | null = null
  dateTo: Date | null = null

  constructor(public utils: Utils) {
    this.loadData()
  }
  async loadData() {
    const toysResponse = await ToyService.getToys()
    this.toys.set(toysResponse.data)

    const typesResponse = await ToyService.getTypes()
    this.types.set(typesResponse.data)

    const ageGroupsResponse = await ToyService.getAgeGroup()
    this.ageGroups.set(ageGroupsResponse.data)
  }

  getRecommendedToys(): ToyModel[] {
    const user = AuthService.getActiveUser()
    if (!user || !user.favoriteToyTypes || user.favoriteToyTypes.length === 0) {
      return []
    }

    return this.toys().filter(toy =>
      user.favoriteToyTypes.includes(toy.type.name)
    )
  }
  filteredToys() {
    return this.toys().filter(toy => {
      // Pretraga po tekstu (ime i opis)
      if (this.searchText) {
        const search = this.searchText.toLowerCase()
        if (!toy.name.toLowerCase().includes(search) &&
          !toy.description.toLowerCase().includes(search)) {
          return false
        }
      }

      // Filter po tipu
      if (this.selectedType && toy.type.typeId !== this.selectedType) {
        return false
      }

      // Filter po uzrastu
      if (this.selectedAgeGroup && toy.ageGroup.ageGroupId !== this.selectedAgeGroup) {
        return false
      }

      // Filter po ciljnoj grupi
      if (this.selectedTargetGroup && toy.targetGroup !== this.selectedTargetGroup) {
        return false
      }

      // Filter po ceni
      if (this.minPrice && toy.price < this.minPrice) {
        return false
      }
      if (this.maxPrice && toy.price > this.maxPrice) {
        return false
      }

      // Filter po datumu proizvodnje
      // Filter po datumu proizvodnje
      if (this.dateFrom) {
        const toyDate = new Date(toy.productionDate)
        if (toyDate < this.dateFrom) {
          return false
        }
      }
      if (this.dateTo) {
        const toyDate = new Date(toy.productionDate)
        if (toyDate > this.dateTo) {
          return false
        }
      }

      return true
    })
  }

  clearFilters() {
    this.searchText = ''
    this.selectedType = null
    this.selectedAgeGroup = null
    this.selectedTargetGroup = ''
    this.minPrice = null
    this.maxPrice = null
    this.dateFrom = null
    this.dateTo = null
  }
  addToCart(toy: ToyModel) {
    CartService.addToCart(toy)
    Alerts.success('Toy added to cart!')
  }

  isLoggedIn() {
    return AuthService.getActiveUser() !== null
  }

  hasFiltersActive(): boolean {
    return !!(this.searchText || this.selectedType || this.selectedAgeGroup ||
      this.selectedTargetGroup || this.minPrice || this.maxPrice ||
      this.dateFrom || this.dateTo)
  }
}