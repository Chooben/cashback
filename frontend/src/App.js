import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { TableHead } from './components/TableHead';
import { TableBody } from './components/TableBody';
import { AddCard } from './components/AddCard';
import { AddCategory } from './components/AddCategory';
import { EditCashback } from './components/EditCashback.js'
import { Modal } from './components/Modal/Modal.js';

function App() {

  //Usestate variables to store api data
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cashbacks, setCashbacks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editTarget, setEditTarget] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  function toggleModal () {
    setModalOpen(!modalOpen);
  }
  const toggleEditing= () => {
    setIsEditing(!isEditing);
    setModalType(null);
  }
  const modalContent = () => {
    switch (modalType) {
      case 'addCard':
        return <AddCard addCard={addCard} categories={categories}/>;
      case 'addCategory':
        return <AddCategory addCat={addCat} categories={categories} />;
      case 'editCashback': 
        return <EditCashback cardName={cards.find(card  => card.id === editTarget.cardId).name} cardId={editTarget.cardId} cashback={editTarget.cashbackValues} cards={cards} categories={categories} updateCash={updateCash}/>;
      default:
        return null;
    }
  }
  
  // Fetch api data from card, category, cashback api
  useEffect(() => {
    Promise.all([
      fetch("card"),
      fetch("category"),
      fetch("cashback")
    ])
      .then(([resCards, resCats, resCashs]) => 
        Promise.all([resCards.json(), resCats.json(), resCashs.json()])
      )
      .then(([dataCards, dataCats, dataCashs]) => {
        setCards(dataCards);
        setCategories(dataCats);
        setCashbacks(dataCashs)
      });
  }, []);

  // Memoized storage for cashback values per card
  const cashbackMatrix = useMemo(() => {
    console.log("Rebuilding cashback matrix");

    const matrix = {};
    cards.forEach(card => {
      matrix[card.id] = {};
      categories.forEach(cat => {
        matrix[card.id][cat.id] = 0;
      });
    });
    cashbacks.forEach(({ cardId, catId, percent }) => {
      if (!matrix[cardId]) matrix[cardId] = {};
      matrix[cardId][catId] = percent;
    });
    return matrix;
  }, [cards, categories, cashbacks]);

  // Post request to card api
  async function addCard (cardName, cashbackValues) {
    try {
      const res = await fetch("http://localhost:5000/card/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: cardName})
    });

    if (!res.ok) throw new Error("Failed to add card");

    const newCard = await res.json();
    setCards(prev => [...prev, newCard]);
    
    const values = Object.entries(cashbackValues);
    console.log("add card values:" ,newCard.id, "and " ,values);

    for (const [catId, percent] of values) {
      
      await fetch("http://localhost:5000/cashback/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          cardId: parseInt(newCard.id), 
          catId: parseInt(catId), 
          percent: parseFloat(percent) 
        })
    })}

    const resCashbacks = await fetch("http://localhost:5000/cashback/");
    const updatedCashbacks = await resCashbacks.json();
    setCashbacks(updatedCashbacks);

    console.log("cashback matrix:",cashbackMatrix)
    toggleModal();    
    } catch (err) {
      console.error("Error: ", err)
    }
  }
  // Post request to category api
  async function addCat (newCat) {
    const formatName = newCat.toLowerCase();
    if (categories.some(cat => cat.name.toLowerCase() === formatName))
        return;
      
    try {
      const res = await fetch("http://localhost:5000/category/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: newCat})
    });

    if (!res.ok) throw new Error("Failed to add category");

    const data = await res.json();
    setCategories(prev => [...prev, data]);

    console.log("added new category");
    toggleModal();
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  // Open edit cashback modal
  function editCash (cardId) {
    const cashbackValues = cashbackMatrix[cardId];
    setEditTarget({ cardId, cashbackValues });
    setModalType('editCashback');
    toggleModal();
  }

  // Update cashback values for a card
  async function updateCash (cardId, updatedValues) {
    const values = Object.entries(updatedValues).map(([catId, percent]) => ({
      cardId,
      catId: parseInt(catId),
      percent: parseFloat(percent)
    }));

    console.log("parsed values:", values)

    setCashbacks(prev => [...prev.filter(cb => cb.id !== cardId), ...values]);

    await Promise.all(values.map(cb => 
      fetch("http://localhost:5000/cashback/", {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(cb)
    }
    )));

    toggleModal();
  }

  console.log('current modal type', modalType);
  return (
    <div>
      <table>
        <TableHead categories={categories}/>
        <TableBody editCash={editCash} cards={cards} categories={categories} cashbacks={cashbackMatrix} isEditing={isEditing}/>
      </table>
      {isEditing ? (
        <div>  
          <button onClick={() => {setModalType('addCategory'); toggleModal();}}>Add category</button>
          <button onClick={() => {setModalType('addCard'); toggleModal();}}>Add card</button>
          <button onClick={toggleEditing}>save</button>
        </div>) : (
          <button onClick={toggleEditing}>edit</button>
      )}

      {modalOpen && (
        <Modal onClose={() => setModalType(null)}>
          {modalContent()}
        </Modal>
      )}
    </div>
  );
}

export default App;
