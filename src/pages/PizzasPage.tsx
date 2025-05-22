import React, { useEffect, useState } from "react";
import api from "../api";
import type { Pizza, CreatePizzaDTO } from "../types";

const PizzasPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreatePizzaDTO>({
    name: "",
    size: "",
    price: 0,
    imageUrl: "",
  });

  useEffect(() => {
    fetchPizzas();
  }, []);

  async function fetchPizzas() {
    setLoading(true);
    try {
      const res = await api.get<Pizza[]>("/pizzas");
      setPizzas(res.data);
      setError(null);
    } catch {
      setError("Failed to load pizzas");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.size || form.price <= 0 || !form.imageUrl) {
      alert("Please fill all fields correctly");
      return;
    }
    try {
      await api.post("/pizzas", form);
      setForm({ name: "", size: "", price: 0, imageUrl: "" });
      fetchPizzas();
    } catch {
      alert("Failed to create pizza");
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold mb-8 text-red-700 tracking-wide">
        Pizzas
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-10 max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 space-y-5"
        noValidate
      >
        <input
          type="text"
          placeholder="Pizza Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          required
        />
        <input
          type="text"
          placeholder="Size (e.g. Small, Medium, Large)"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          required
        />
        <input
          type="number"
          min={0}
          placeholder="Price (in cents)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          required
        />
        <input
          type="url"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 rounded-md shadow-md transition"
        >
          Add Pizza
        </button>
      </form>

      {loading && (
        <p className="text-center text-gray-500 italic">Loading pizzas...</p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pizzas.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
          >
            <div className="aspect-w-4 aspect-h-3 overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="text-2xl font-bold text-red-700 mb-1">{p.name}</h3>
              <p className="text-gray-600 mb-1">{p.size}</p>
              <p className="font-semibold text-gray-800">
                ${(p.price / 100).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PizzasPage;
