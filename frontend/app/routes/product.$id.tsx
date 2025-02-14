import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddTableField } from "~/components";
import { useLoaderData } from "@remix-run/react";
import { useStatsDispatch } from "~/components/StatsContext";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import invariant from "tiny-invariant";
import { useState } from "react";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Missing id");

  const rand = Math.floor(Math.random() * 1000001);
  const path = `${
    process.env.NODE_ENV === "production"
      ? "https://northwind-worker.cf-tme.workers.dev"
      : "http://127.0.0.1:8789"
  }/api/product?Id=${params.id}&rand=${rand}`;

  const res = await fetch(path);
  const result = (await res.json()) as any;

  return json({ ...result });
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

const Product = () => {
  const navigate = useNavigate();
  const data = useLoaderData<LoaderType>();
  const { product } = data;

  const [updateInventoryBy, setUpdateInventory] = useState(0);
  const [localInventory, setLocalInventory] = useState(product.UnitsInStock);

  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && data.stats && dispatch(data.stats);
  }, [dispatch, data.stats]);

  function handleUpdateInventory() {
    const newInventory = localInventory + updateInventoryBy;
    if (newInventory < 0) return;
    setLocalInventory(newInventory);

    const path = `${
      process.env.NODE_ENV === "production"
        ? "https://northwind-queue-worker.cf-tme.workers.dev"
        : "http://127.0.0.1:8787"
    }`;
    fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateInventoryBy: updateInventoryBy,
        productId: product.Id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      {product ? (
        <div className="card mb-6">
          <header className="card-header">
            <p className="card-header-title">
              <span className="icon material-icons">ballot</span>
              <span className="ml-2">Product information</span>
            </p>
          </header>

          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <AddTableField
                  name="Product Name"
                  value={product.ProductName}
                />
                <AddTableField
                  name="Supplier"
                  link={`/supplier/${product.SupplierId}`}
                  value={product.SupplierName}
                />
                <AddTableField
                  name="Quantity Per Unit"
                  value={product.QuantityPerUnit}
                />
                <AddTableField
                  name="Unit Price"
                  value={`$${product.UnitPrice}`}
                />
              </div>
              <div>
                <AddTableField name="Units In Stock" value={localInventory} />
                <AddTableField
                  name="Units In Order"
                  value={product.UnitsOnOrder}
                />
                <AddTableField
                  name="Reorder Level"
                  value={product.ReorderLevel}
                />
                <AddTableField
                  name="Discontinued"
                  value={product.Discontinued}
                />
              </div>
            </div>

            <hr />

            <div className="field grouped">
              <div className="control">
                <button
                  type="reset"
                  onClick={() => {
                    navigate(`/products`, { replace: false });
                  }}
                  className="button red"
                >
                  Go back
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleUpdateInventory();
                }}
                className="button green mr-2"
              >
                Update Inventory By
              </button>
              <input
                type="number"
                placeholder="#"
                className="input is-small"
                style={{ width: "100px" }}
                onChange={(e) => {
                  setUpdateInventory(Number(e.target.value));
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="card-content">
          <h2>No such product</h2>
        </div>
      )}
    </>
  );
};

export default Product;
