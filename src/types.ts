export interface Customer {
  id: number;
  name: string;
  email: string;
  pizzaOrders?: PizzaOrder[];
}

export interface Pizza {
  id: number;
  name: string;
  size: string;
  price: number;
  imageUrl: string;
  orderItems?: PizzaOrderItem[];
}

export interface PizzaOrderItem {
  id: number;
  pizza: Pizza;
  quantity: number;
  order?: PizzaOrder;
}

export interface PizzaOrder {
  id: number;
  customer: Customer;
  orderDate: string;
  pizzaOrderItems: PizzaOrderItem[];
}

export interface CreatePizzaDTO {
  name: string;
  size: string;
  price: number;
  imageUrl: string;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
}

export interface CreatePizzaOrderItemDTO {
  pizzaId: number;
  quantity: number;
}

export interface CreatePizzaOrderDTO {
  customer: number;
  date?: string;
  pizzaOrderItems: CreatePizzaOrderItemDTO[];
}
