import React, { useEffect, useState } from 'react';
import api from '../api';
import type { Customer, CreateCustomerDTO } from '../types';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateCustomerDTO>({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await api.get<Customer[]>('/customer');
      setCustomers(res.data);
      setError(null);
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert('Please fill all fields');
      return;
    }
    try {
      await api.post('/customer', form);
      setForm({ name: '', email: '' });
      fetchCustomers();
    } catch {
      alert('Failed to create customer');
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Customers</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 max-w-md grid gap-4"
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
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border rounded p-2"
          required
        />
        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          Add Customer
        </button>
      </form>

      {loading && <p>Loading customers...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3">
        {customers.map(c => (
          <li key={c.id} className="border rounded p-4 shadow">
            <p className="font-semibold">{c.name}</p>
            <p className="text-gray-700">{c.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersPage;
