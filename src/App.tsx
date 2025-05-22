import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PizzasPage from "./pages/PizzasPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";
import { NavBar } from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-red-600 text-white px-4 py-0 pizza-text text-[24px]">
          <NavBar />
        </header>
        <main className="container mx-auto p-4 flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pizzas" element={<PizzasPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-100 text-center p-4 text-sm text-gray-500">
          &copy; 2025 Pizza Admin
        </footer>
      </div>
    </Router>
  );
}

const HomePage = () => (
  <div className="text-center mt-20 text-gray-700">
    <h1 className="text-4xl font-bold mb-4">Welcome to Pizza Admin</h1>
    <p className="text-lg">
      Manage pizzas, customers, and orders from the menu above.
    </p>
  </div>
);

export default App;
