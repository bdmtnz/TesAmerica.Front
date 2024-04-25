export interface ISeller {
    id: string,
    name: string,
    state: string
}

export interface ISellerReport {
    sellerId: string,
    sellerName: string,
    subtotal: number,
    comission: number,
    year: number,
    month: number
}