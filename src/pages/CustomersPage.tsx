import React, { useEffect, useState } from "react";
import api from "../api";
import type { Customer, CreateCustomerDTO } from "../types";

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateCustomerDTO>({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await api.get<Customer[]>("/customer");
      setCustomers(res.data);
      setError(null);
    } catch {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert("Please fill all fields");
      return;
    }
    try {
      await api.post("/customer", form);
      setForm({ name: "", email: "" });
      fetchCustomers();
    } catch {
      alert("Failed to create customer");
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold mb-8 text-red-700 tracking-wide">
        Customers
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-10 max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-5"
        noValidate
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 rounded-md shadow-md transition"
        >
          Add Customer
        </button>
      </form>

      {loading && (
        <p className="text-center text-gray-500 italic">Loading customers...</p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      <ul className="max-w-3xl mx-auto space-y-6">
        {customers.map((c) => (
          <li
            key={c.id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0"
          >
            <p className="text-xl font-semibold text-gray-900">{c.name}</p>
            <p className="text-gray-600 break-words">{c.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersPage;
