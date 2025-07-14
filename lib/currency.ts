import Rupiah from './rupiah'
export const formatCurrency = (value: any, currency: string) => {
	switch(currency){
	default:
		let price = new Rupiah(value);
    	return price.format;
	}
}