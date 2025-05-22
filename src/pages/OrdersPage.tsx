import React, { useEffect, useState } from 'react';
import api from '../api';
import type { PizzaOrder, Customer, Pizza, CreatePizzaOrderItemDTO, CreatePizzaOrderDTO } from '../types';


const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PizzaOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New order form
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<CreatePizzaOrderItemDTO[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [ordersRes, customersRes, pizzasRes] = await Promise.all([
        api.get<PizzaOrder[]>('/pizza-order'),
        api.get<Customer[]>('/customer'),
        api.get<Pizza[]>('/pizzas'),
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setPizzas(pizzasRes.data);
      setError(null);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function addOrderItem() {
    setOrderItems([...orderItems, { pizzaId: 0, quantity: 1 }]);
  }

  function updateOrderItem(index: number, field: 'pizzaId' | 'quantity', value: number) {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  }

  function removeOrderItem(index: number) {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Select a customer');
      return;
    }
    if (orderItems.length === 0) {
      alert('Add at least one pizza to the order');
      return;
    }
    if (orderItems.some(item => item.pizzaId === 0 || item.quantity <= 0)) {
      alert('Fill all order items correctly');
      return;
    }

    const payload: CreatePizzaOrderDTO = {
      customer: selectedCustomerId,
      date: new Date().toISOString(),
      pizzaOrderItems: orderItems,
    };

    try {
      await api.post('/pizza-order', payload);
      setSelectedCustomerId(null);
      setOrderItems([]);
      fetchAll();
    } catch {
      alert('Failed to create order');
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Orders</h2>

      <form onSubmit={handleSubmit} className="mb-8 max-w-3xl space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Customer</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedCustomerId ?? ''}
            onChange={e => setSelectedCustomerId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Select Customer
            </option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Order Items</label>
          {orderItems.map((item, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <select
                className="border rounded p-2 flex-grow"
                value={item.pizzaId}
                onChange={e =>
                  updateOrderItem(i, 'pizzaId', Number(e.target.value))
                }
                required
              >
                <option value={0} disabled>
                  Select Pizza
                </option>
                {pizzas.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.size}) - ${(p.price / 100).toFixed(2)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                className="border rounded p-2 w-24"
                value={item.quantity}
                onChange={e =>
                  updateOrderItem(i, 'quantity', Number(e.target.value))
                }
                required
              />
              <button
                type="button"
                className="text-red-600 font-bold px-2"
                onClick={() => removeOrderItem(i)}
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOrderItem}
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Add Pizza
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded w-full hover:bg-green-700"
        >
          Place Order
        </button>
      </form>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order.id}
            className="border rounded shadow p-4 bg-white max-w-4xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <p className="font-semibold text-lg">
                  Order #{order.id} -{' '}
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  Customer: {order.customer.name} ({order.customer.email})
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {order.pizzaOrderItems.map(item => (
                <div key={item.id} className="border rounded p-3 flex flex-col items-center">
                  <img
                    src={item.pizza.imageUrl}
                    alt={item.pizza.name}
                    className="w-full h-36 object-cover rounded mb-2"
                  />
                  <p className="font-semibold">{item.pizza.name}</p>
                  <p className="text-sm text-gray-600">Size: {item.pizza.size}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ${(item.pizza.price / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
