"use client"

import React, {useState} from "react";
import useSWR from "swr";
import styles from "./page.module.css";

const Page = ({ params }) => {
  const Department = params.department;

  const [Search, setSearch] = useState("");

  const [IsUploading, setIsUploading] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/inventory/GET_Items?Department=${encodeURIComponent(Department)}`,
		fetcher
	);

  const onSubmit = async (e) => {
		e.preventDefault();
		setIsUploading(true);
		try {
      const formData = new FormData(e.target); 
      formData.append("Department", Department);

      const response = await fetch("/api/inventory/POST_AddItem", {
          method: "POST",
          body: formData,
      });
   
      if (response.ok) {
        console.log("Complete");
      } else {
          console.log("Failed");
      }
    } catch (err) {
      console.log(err);
		} finally {
      e.target.reset();
			setIsUploading(false);
      mutate();
			return
		}
	}

  const onEdit = async (e) => {
		setIsEditing(true);
		try {
      const formData = new FormData(); 
			formData.append("Department", Department);
      formData.append("Action", e.target.dataset.action);
      formData.append("Id", e.target.dataset.id);

      const response = await fetch("/api/inventory/POST_EditItem", {
          method: "POST",
          body: formData,
      });

      if (response.ok) {
        console.log("Complete");
      } else {
          console.log("Failed");
      }
    } catch (err) {
      console.log(err);
		} finally {
			setIsEditing(false);
      mutate();
			return
		}
	}

  const TestData = [
    {Name: "test 1", Count: 2},
    {Name: "test 2", Count: 2},
    {Name: "test 3", Count: 2},
    {Name: "test 4", Count: 2},
  ]

  const filter = data
    ? data.filter((item) =>
        item.Name.toLowerCase().includes(Search.toLowerCase())
      )
    : [];

  const CreateCard = ({name, count, id}) => {
    return (
      <div className={styles.Card}>
        <p className={styles.Name}>{name}</p>
        <button className={styles.RemoveButtons} data-id={id} data-action="Remove" disabled={IsEditing} onClick={onEdit}>x</button>
        <div className={styles.Buttons}>
          <button className={styles.QuantityButtons} data-id={id} data-action="Less" disabled={IsEditing} onClick={onEdit}>-</button>
          <p>{count}</p>
          <button className={styles.QuantityButtons} data-id={id} data-action="Add" disabled={IsEditing} onClick={onEdit}>+</button>
        </div>
      </div>
    )
  }

  const CreateCardForm = () => {
    return (
      <form className={styles.Card} onSubmit={onSubmit}>
        <input name="Name" type="text" placeholder="Name..." className={styles.NameInput} required disabled={IsUploading}/>
        <input name="Count" type="number" placeholder="Count..." className={styles.NameInput} defaultValue={0} required disabled={IsUploading}/>
        <button className={styles.CreateButtons} disabled={IsUploading}>{IsUploading ? "Uploading..." : "Create"}</button>
      </form>
    )
  }

  return (
    <div className={styles.mainContainer}>
       <div className={styles.Header}>Inventory</div>
       <input className={styles.SearchBar} type="search" onChange={(e)=>setSearch(e.target.value)} placeholder="Search..."/>
       <CreateCardForm />
       <div className={styles.GridView}>
        {isLoading ? (
          "loadding..."
        ) : filter.length > 0 ? (
          filter?.map((item, index) => (
            <CreateCard key={index} name={item.Name} count={item.Count} id={item._id}/>
          ))
        ) : (
          "No results..."
        )}
       </div>
       
    </div>
  )
};

export default Page;


