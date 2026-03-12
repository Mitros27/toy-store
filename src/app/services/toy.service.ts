import axios from 'axios'
import { ToyModel } from '../../model/toy.model'
import { AgeGroupModel } from '../../model/toy.model'
import { ToyTypeModel } from '../../model/toy.model'
const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    headers: {
        'Accept': 'application/json'
    },
    validateStatus(status){
        return status === 200
    }
})
export class ToyService{
    static async getToys(){
        return await client.get<ToyModel[]>('/toy')
    }
    static async getToyById(id: number){
        return await client.get<ToyModel>('/toy/' + id)
    }
    static async getToyBYPermalink(permalink: string){
        return await client.get<ToyModel>('/toy/permalink' + permalink)
    }
    static async getToyByIds(ids: number){
        return await client.get<ToyModel[]>('/toy/' + ids)
    }
    static async getAgeGroup(){
        return await client.get<AgeGroupModel[]>('/age-group')
    }
    static async getTypes(){
        return await client.get<ToyTypeModel[]>('/type')
    }
}
