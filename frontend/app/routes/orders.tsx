import { useEffect, useState } from "react";
import { Link, LoaderFunctionArgs, useNavigate } from "react-router-dom";
import { Paginate } from "~/components";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useStatsDispatch } from "~/components/StatsContext";

export const loader: LoaderFunction = async ({
  context,
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const count = url.searchParams.get("count");
  const search = url.searchParams.get("search");
  const tokenKey = url.searchParams.get("token") || "admin";

  const jwtTokens = {
    admin: context.JWT_ADMIN,
    user: context.JWT_USER,
    invalid: context.JWT_INVALID,
  };

  const token = jwtTokens[tokenKey as keyof typeof jwtTokens];

  if (!token) {
    return json({
      error: "Unauthorized: Token not provided or invalid",
      orders: [],
      pages: 1,
    });
  }
  const rand = Math.floor(Math.random() * 1000001);
  const path = `${
    process.env.NODE_ENV === "production"
      ? "https://api.cf-northwind.com"
      : "http://127.0.0.1:8789"
  }/api/orders?page=${page}${Number(count) > 0 ? `` : `&count=true`}${
    search ? `&search=${search}` : ""
  }&rand=${rand}`;

  const headers = { token: `${token}` };

  const res = await fetch(path, { headers });
  if (!res.ok) {
    return json({
      error: `Error: ${res.status} ${res.statusText}`,
      orders: [],
      pages: 1,
    });
  }
  const result = (await res.json()) as any;

  return json({ ...result });
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

interface Order {
  Id: string;
  TotalProducts: string;
  TotalProductsPrice: string;
  TotalProductsItems: string;
  OrderDate: string;
  ShipName: string;
  ShipCity: string;
  ShipCountry: string;
}

const Orders = () => {
  const data = useLoaderData<LoaderType>();
  const [selectedToken, setSelectedToken] = useState("admin");

  const navigate = useNavigate();

  const { orders, page, pages } = data;
  const dispatch = useStatsDispatch();

  useEffect(() => {
    dispatch && data.stats && dispatch(data.stats);
  }, [dispatch, data.stats]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setSelectedToken(token);
    }
  }, []);

  const setPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    params.set("token", selectedToken);
    navigate(`?${params.toString()}`);
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedToken(event.target.value);
    const params = new URLSearchParams(window.location.search);
    params.set("token", event.target.value);
    navigate(`?${params.toString()}`);
  };

  return (
    <>
      <div>
        <label className="mr-2">Log In As:</label>
        {[
          { key: "admin", label: "Administrator" },
          { key: "user", label: "User 'Around The Horn'" },
          { key: "invalid", label: "Invalid User" },
        ].map(({ key, label }) => (
          <label key={key} className="radio-inline mr-2">
            <input
              type="radio"
              name="token"
              value={key}
              checked={selectedToken === key}
              onChange={handleTokenChange}
              className="mr-1"
            />
            {label}
          </label>
        ))}
      </div>
      {data.error && (
        <div className="card-content">
          <h2>{data.error}</h2>
        </div>
      )}
      {orders.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Orders</p>
            <button className="card-header-icon">
              <span
                className="material-icons"
                onClick={() => {
                  //eslint-disable-next-line
                  window.location.href = window.location.href;
                }}
              >
                redo
              </span>
            </button>
          </header>
          <div className="card-content">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Total Price</th>
                  <th>Products</th>
                  <th>Quantity</th>
                  <th>Shipped</th>
                  <th>Ship Name</th>
                  <th>City</th>
                  <th>Country</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Order, index: number) => {
                  return (
                    <tr key={index}>
                      <td data-label="Id">
                        <Link className="link" to={`/order/${order.Id}`}>
                          {order.Id}
                        </Link>
                      </td>
                      <td data-label="Price">{`$${parseFloat(
                        order.TotalProductsPrice
                      ).toFixed(2)}`}</td>
                      <td data-label="Products">{order.TotalProducts}</td>
                      <td data-label="Quantity">{order.TotalProductsItems}</td>
                      <td data-label="Date">{order.OrderDate}</td>
                      <td data-label="Name">{order.ShipName}</td>
                      <td data-label="City">{order.ShipCity}</td>
                      <td data-label="Country">{order.ShipCountry}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Paginate pages={pages} page={page} setPage={setPage} />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Orders;
