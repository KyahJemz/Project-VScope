"use client"

import React, {useState} from "react";
import useSWR from "swr";
import styles from "./page.module.css";

const Page = ({ params }) => {
  const Department = params.department;

  const [Search, setSearch] = useState("");

  const [ActivePanel, setActivePanel] = useState("Inventory");

  const [IsUploading, setIsUploading] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);

  const [Item, setItem] = useState(null);
  const [OpenRequestForm, setOpenRequestForm] = useState(false);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/inventory/GET_Items?Department=${encodeURIComponent(Department)}`,
		fetcher
	);

  const { data: historyData, mutate: historyMutate, error: historyError, isLoading: historyIsLoading } =  useSWR(
		`/api/inventory/GET_ItemsHistory?Department=${encodeURIComponent(Department)}`,
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
        alert("Item Added!");
      } else {
        console.log("Failed");
        alert("Item Failed!");
      }
    } catch (err) {
      console.log(err);
		} finally {
      e.target.reset();
			setIsUploading(false);
      mutate();
      historyMutate();
			return
		}
	}

  const onEdit = async (e) => {
    e.preventDefault();
    let formData = null;
    if(e.target.dataset.action){
      formData = new FormData(); 
    } else {
      console.log(e.target.value);
      formData = new FormData(e.target); 
      const itemCount = parseInt(formData.get("Count"));
      if (itemCount > parseInt(Item.Count) || itemCount < 1) {
        alert("Invalid Item count");
        return;
      }
    }
    setIsEditing(true);
		try {
			formData.append("Department", Department);
      formData.append("ItemName", Item?.Name ?? "");
      formData.append("Id", Item?.Id ?? e?.target?.dataset?.id ?? "");
      formData.append("Action", Item?.Action ?? e.target.dataset.action ?? "");

      const response = await fetch("/api/inventory/POST_EditItem", {
          method: "POST",
          body: formData,
      });

      if (response.ok) {
        console.log("Complete");
        alert("Update Completed");
      } else {
        console.log("Failed");
        alert("Update Failed");
      }
    } catch (err) {
      console.log(err);
		} finally {
			setIsEditing(false);
      mutate();
      historyMutate();
      setOpenRequestForm(false);
      setItem(null);
			return
		}
	}

  const filter = data
    ? data.filter((item) =>
        item.Name.toLowerCase().includes(Search.toLowerCase())
      )
    : [];

  const filterHistory = historyData
    ? historyData.filter((item) =>
        item.Name.toLowerCase().includes(Search.toLowerCase()) ||
        item.ItemName.toLowerCase().includes(Search.toLowerCase())
      )
    : [];

  const CreateCard = ({name, count, id}) => {
    return (
      <div className={styles.Card}>
        <p className={styles.Name}>{name}</p>
        <button className={styles.RemoveButtons} data-id={id} data-action="Remove" disabled={IsEditing} onClick={onEdit}>x</button>
        <div className={styles.Buttons}>
          <p>{count}</p>
          <button className={styles.QuantityButtons} data-action="Give" disabled={IsEditing} onClick={(e)=> {setItem({Name: name, Id: id, Count: count, Action: "Give"}); setOpenRequestForm(true)}}>Give</button>
        </div>
      </div>
    )
  }

  const CreateList = ({name, count, itemName, date, isAdd, notes}) => {
    return (
      <div className={styles.ListItem} title={notes}>
        <span className={styles.ListName} title={notes}>{name}</span>
        <span className={styles.ListDate} title={notes}>{date}</span>
        <span className={styles.ListCount} title={notes}>{isAdd ? "+" : "-"}{count} : {itemName}</span>
      </div>
    )
  }

  const CreateCardForm = () => {
    return (
      <form className={styles.addForm} onSubmit={onSubmit}>
        <span>
          <p className={styles.addLabel}>Item Name:</p>
          <input name="Name" type="text" placeholder="Name..." className={styles.NameInput} required disabled={IsUploading}/>
        </span>
        <span>
          <p className={styles.addLabel}>Item Count:</p>
          <input name="Count" type="number" placeholder="Count..." className={styles.NameInput} defaultValue={0} required disabled={IsUploading}/>
        </span>
        <button className={styles.CreateButtons} disabled={IsUploading}>{IsUploading ? "Uploading..." : "Add"}</button>
      </form>
    )
  }

  const Inventory = () => {
    return(
      <>
        <CreateCardForm />
        <div className={styles.GridView}>
          {isLoading ? (
            "loading..."
          ) : filter.length > 0 ? (
            filter?.map((item, index) => (
              <CreateCard key={index} name={item.Name} count={item.Count} id={item._id}/>
            ))
          ) : (
            "No results..."
          )}
        </div>
      </>
    )
  }

  const History = () => {
    return (
      <>
        <hr />
       <div className={styles.ListView}>
          {historyIsLoading ? (
            "loading..."
          ) : filterHistory.length > 0 ? (
            filterHistory?.map((item, index) => (
              <CreateList key={index} name={item.Name} count={item.Count} itemName={item.ItemName} notes={item.Notes} date={formatDate(item.createdAt)} isAdd={item.Name === Department ? true : false} id={item._id}/>
            ))
          ) : (
            "No results..."
          )}
        </div>
      </>
    )
  }

  const RequestForm = () =>{
    return (
      <form onSubmit={onEdit} className={styles.requestForm}>
        <span>
          <p className={styles.requestFormInputText}>Item Name:</p>
          <input className={styles.NameInput} defaultValue={Item?.Name ?? "?"} disabled/>
        </span>
        <span>
          <p className={styles.requestFormInputText}>Name:</p>
          <input className={styles.NameInput} name="Name" type="text" required/>
        </span>
        <span>
          <p className={styles.requestFormInputText}>Email:</p>
          <input className={styles.NameInput} name="Email" type="email" required/>
        </span>
        <span>
          <p className={styles.requestFormInputText}>Count: <span className={styles.requestFormLight}> Max: {Item?.Count ?? "0"}</span></p>
          <input className={styles.NameInput} name="Count" type="number" defaultValue={0} required/>
        </span>
        <span>
          <p className={styles.requestFormInputText}>Notes:</p>
          <textarea className={styles.NameInput} name="Notes"></textarea>
        </span>
        <span className={styles.Buttons2}>
          <button type="button" className={styles.Button} onClick={()=>{setOpenRequestForm(false); setItem(null)}}>Back</button>
          <button type="submit" className={styles.ButtonActive}>Confirm</button>
        </span>
      </form>
    )
  }

  const formatDate = (timestamp) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
  
    const hours = new Date(timestamp).getHours();
    const minutes = new Date(timestamp).getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
  
    return `${formattedDate} ${formattedTime}`;
};

  return (
    <>
    {OpenRequestForm ? <RequestForm /> : null}
    <div className={styles.mainContainer}>
      
      <div className={styles.Header}>{ActivePanel} <button className={styles.SwitchBtn} onClick={()=>{ActivePanel === "Inventory" ? setActivePanel("History") : setActivePanel("Inventory")}}>View {ActivePanel === "Inventory" ? "History" : "Inventory"}</button></div>
      <input className={styles.SearchBar} type="search" onChange={(e)=>setSearch(e.target.value)} placeholder={`Search ${ActivePanel}...`}/>
      {ActivePanel === "Inventory" ? <Inventory /> : <History />}
    </div>
    </>
  )
};

export default Page;


