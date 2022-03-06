export interface IAccountInfo {
	makerCommission: number;
	takerCommission: number;
	buyerCommission: number;
	sellerCommission: number;
	canTrade: boolean;
	canWithdraw: boolean;
	canDeposit: boolean;
	updateTime: number;
	accountType: string;
	balances: {
		asset: string;
		free: string;
		locked: string;
	}[];
	permissions: string[];
}

export interface IOrders {
	symbol: string;
	orderId: number;
	orderListId: number;
	clientOrderId: string;
	price: string;
	origQty: string;
	executedQty: string;
	cummulativeQuoteQty: string;
	status: string;
	timeInForce: string;
	type: string;
	side: string;
	stopPrice: string;
	icebergQty: string;
	time: number;
	updateTime: number;
	isWorking: boolean;
	origQuoteOrderQty: string;
}
