import React, { useEffect, useState } from 'react';
import api from '../api';
import type { Pizza, CreatePizzaDTO } from '../types';

const PizzasPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreatePizzaDTO>({
    name: '',
    size: '',
    price: 0,
    imageUrl: '',
  });

  useEffect(() => {
    fetchPizzas();
  }, []);

  async function fetchPizzas() {
    setLoading(true);
    try {
      const res = await api.get<Pizza[]>('/pizzas');
      console.log('pizzas ' + res.data);
      setPizzas(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load pizzas');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.size || form.price <= 0 || !form.imageUrl) {
      alert('Please fill all fields with valid data');
      return;
    }
    try {
      await api.post('/pizzas', form);
      setForm({ name: '', size: '', price: 0, imageUrl: '' });
      fetchPizzas();
    } catch {
      alert('Failed to create pizza');
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Pizzas</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 sm:grid-cols-2 max-w-xl"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Size (e.g. Medium)"
          value={form.size}
          onChange={e => setForm({ ...form, size: e.target.value })}
          className="border rounded p-2"
          required
        />
        <input
          type="number"
          placeholder="Price (cents)"
          value={form.price}
          onChange={e => setForm({ ...form, price: Number(e.target.value) })}
          className="border rounded p-2"
          required
          min={1}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          className="border rounded p-2"
          required
        />
        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 col-span-full"
        >
          Add Pizza
        </button>
      </form>

      {loading && <p>Loading pizzas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {pizzas.map(pizza => (
          <div key={pizza.id} className="border rounded shadow p-4 flex flex-col">
            <img
              src={pizza.imageUrl}
              alt={pizza.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold">{pizza.name}</h3>
            <p className="text-gray-700">Size: {pizza.size}</p>
            <p className="text-gray-700">Price: ${(pizza.price / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PizzasPage;
