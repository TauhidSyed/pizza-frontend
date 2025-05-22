import { Link, useLocation } from "react-router-dom";

export const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="container mx-auto flex gap-6 items-center">
      <Link to="/" className="flex items-center font-bold text-[35px] mr-auto">
        <img
          src="/images/pizza-icon.svg"
          alt="Pizza Icon"
          className="w-16 h-16 mr-2 mt-3"
        />
        TauCodes' Pizzeria
      </Link>
      <Link
        to="/pizzas"
        className={`hover:underline ml-[56px] max-w-[56px] ${
          location.pathname === "/pizzas" ? "underline font-bold" : ""
        }`}
        style={{ maxWidth: "56px" }}
      >
        Pizzas
      </Link>
      <Link
        to="/customers"
        className={`hover:underline ${
          location.pathname === "/customers" ? "underline font-bold" : ""
        }`}
      >
        Customers
      </Link>
      <Link
        to="/orders"
        className={`hover:underline mr-18 ${
          location.pathname === "/orders" ? "underline font-bold" : ""
        }`}
      >
        Orders
      </Link>
    </nav>
  );
};
