/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@mui/material";
import {
  useDeleteData,
  useFetchData,
  useFetchDataById,
  usePostData,
  useUpdateData,
} from "../../hooks/use-crud";

import { useState } from "react";

const Crud = () => {
  const [prodId, setProdId] = useState("1");
  const { data, isLoading, isError, error } = useFetchData("products");

  const { mutate: getItem } = usePostData("products");

  const updateItemMutation = useUpdateData("products");

  const deleteItemMutation = useDeleteData("products");

  const { data: itemByID, isLoading: itemByIDLoading } = useFetchDataById(
    "products",
    prodId
  );

  const handlePostData = () => {
    getItem({
      title: "test product",
      price: 13.5,
      description: "lorem ipsum set",
      image: "https://i.pravatar.cc",
      category: "electronic",
    });
  };

  const handleUpdateData = () => {
    updateItemMutation.mutate({
      id: "7",
      data: {
        title: "test product",
        price: 13.5,
        description: "lorem ipsum set",
        image: "https://i.pravatar.cc",
        category: "electronic",
      },
    });
  };

  const handleDeleteData = () => {
    deleteItemMutation.mutate({
      id: "6",
    });
  };

  const handleDataById = () => {
    setProdId("4");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  return (
    <div className="lyt-main">
      <section>
        <div className="bs-section">
          <h2 className="sec-title">Fetched Data</h2>
          <ul>
            {data?.map((item: any) => (
              <li key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    Price - <span>{item.price}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section>
        <div className="bs-section">
          <h2 className="sec-title">Post Data</h2>
          <Button variant="outlined" onClick={handlePostData}>
            Post Dummy Data
          </Button>
        </div>
      </section>
      <section>
        <div className="bs-section">
          <h2 className="sec-title">Update Data</h2>
          <Button variant="outlined" onClick={handleUpdateData}>
            Update Dummy Data
          </Button>
        </div>
      </section>
      <section>
        <div className="bs-section">
          <h2 className="sec-title">Delete Data</h2>
          <Button variant="outlined" onClick={handleDeleteData}>
            Delete Dummy Data
          </Button>
        </div>
      </section>
      <section>
        <div className="bs-section">
          <h2 className="sec-title">Get Data By ID</h2>
          <Button variant="outlined" onClick={handleDataById}>
            Detail Dummy Data
          </Button>
          {itemByIDLoading && <p>Loading Data</p>}
          {itemByID && <div>{JSON.stringify(itemByID)}</div>}
        </div>
      </section>
    </div>
  );
};

export default Crud;
