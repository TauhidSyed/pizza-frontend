import React, { useEffect, useState } from "react";
import api from "../api";
import type {
  PizzaOrder,
  Customer,
  Pizza,
  CreatePizzaOrderItemDTO,
  CreatePizzaOrderDTO,
} from "../types";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PizzaOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New order form
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [orderItems, setOrderItems] = useState<CreatePizzaOrderItemDTO[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [ordersRes, customersRes, pizzasRes] = await Promise.all([
        api.get<PizzaOrder[]>("/pizza-order"),
        api.get<Customer[]>("/customer"),
        api.get<Pizza[]>("/pizzas"),
      ]);
      setOrders(ordersRes.data);
      console.log("ORDERS " + JSON.stringify(ordersRes.data));
      setCustomers(customersRes.data);
      setPizzas(pizzasRes.data);
      setError(null);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function addOrderItem() {
    setOrderItems([...orderItems, { pizzaId: 0, quantity: 1 }]);
  }

  function updateOrderItem(
    index: number,
    field: "pizzaId" | "quantity",
    value: number
  ) {
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
      alert("Select a customer");
      return;
    }
    if (orderItems.length === 0) {
      alert("Add at least one pizza to the order");
      return;
    }
    if (orderItems.some((item) => item.pizzaId === 0 || item.quantity <= 0)) {
      alert("Fill all order items correctly");
      return;
    }

    const payload: CreatePizzaOrderDTO = {
      customer: selectedCustomerId,
      orderDate: new Date().toISOString(),
      pizzaOrderItems: orderItems,
    };

    try {
      await api.post("/pizza-order", payload);
      setSelectedCustomerId(null);
      setOrderItems([]);
      fetchAll();
    } catch {
      alert("Failed to create order");
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold mb-8 text-red-700 tracking-wide">
        Orders
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-10 max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6"
        noValidate
      >
        <div>
          <label className="block mb-2 font-semibold text-gray-800">
            Customer
          </label>
          <select
            className="border border-gray-300 rounded-md p-3 w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            value={selectedCustomerId ?? ""}
            onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Select Customer
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-3 font-semibold text-gray-800">
            Order Items
          </label>
          {orderItems.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-center mb-4 p-4 bg-gray-50 rounded-md border border-gray-200"
            >
              <select
                className="border border-gray-300 rounded-md p-3 flex-grow text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                value={item.pizzaId}
                onChange={(e) =>
                  updateOrderItem(i, "pizzaId", Number(e.target.value))
                }
                required
              >
                <option value={0} disabled>
                  Select Pizza
                </option>
                {pizzas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.size}) - ${(p.price / 100).toFixed(2)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                className="border border-gray-300 rounded-md p-3 w-24 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                value={item.quantity}
                onChange={(e) =>
                  updateOrderItem(i, "quantity", Number(e.target.value))
                }
                required
              />
              <button
                type="button"
                className="text-red-600 font-bold text-2xl px-2 hover:text-red-800 transition"
                onClick={() => removeOrderItem(i)}
                aria-label="Remove pizza item"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOrderItem}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 px-6 rounded-md shadow-md transition"
          >
            Add Pizza
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold py-4 rounded-md w-full shadow-lg transition"
        >
          Place Order
        </button>
      </form>

      {loading && (
        <p className="text-center text-gray-500 italic">Loading orders...</p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      <div className="space-y-10 max-w-5xl mx-auto">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4"
          >
            <h3 className="text-2xl font-bold text-red-700 mb-2">
              Order #{o.id} —{" "}
              {customers.find((c) => c.id === o.customer.id)?.name ??
                "Unknown Customer"}
            </h3>
            <p className="text-gray-600 text-sm italic">
              Date: {new Date(o.orderDate).toLocaleString()}
            </p>

            <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {o.pizzaOrderItems.map((item, idx) => {
                const pizza = pizzas.find((p) => p.id === item.pizza.id);
                if (!pizza) return null;
                return (
                  <li
                    key={idx}
                    className="flex flex-col items-center bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition group"
                  >
                    <div className="w-32 h-32 mb-4 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                      {pizza.imageUrl ? (
                        <img
                          src={pizza.imageUrl}
                          alt={pizza.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-gray-400 text-5xl">🍕</span>
                      )}
                    </div>
                    <div className="mb-1 text-lg font-semibold text-gray-800 text-center">
                      {pizza.name}
                    </div>
                    <div className="mb-1 text-xs text-gray-500 uppercase tracking-wide">
                      {pizza.size}
                    </div>
                    <div className="mb-2 font-bold text-red-600">
                      Quantity: {item.quantity}
                    </div>
                    <div className="text-gray-700 font-mono text-sm">
                      Price each: ${(pizza.price / 100).toFixed(2)}
                    </div>
                    <div className="mt-1 font-semibold text-green-700">
                      Total: ${((pizza.price * item.quantity) / 100).toFixed(2)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
