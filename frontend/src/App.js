import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { AddCard } from './components/AddCard';
import { AddCategory } from './components/AddCategory';
import { Modal } from './components/Modal/Modal.js';
import { TableWrapper } from './components/Table/TableWrapper.js';

function App() {

  // Usestate variables to store api data
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cashbacks, setCashbacks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
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
        return <AddCard addCard={addCard} categories={categories} toggleModal={toggleModal} />;
      case 'addCategory':
        return <AddCategory addCat={addCat} categories={categories} />;
      default:
        return null;
    }
  }
  
  // Store initial data from card, category, cashback API on start
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
        setCashbacks(dataCashs);
      });
  }, []);

  // Memoized storage for cashback values per card
  /* const cashbackMatrix = useMemo(() => {
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
  }, [cards, categories, cashbacks]); */

  // Memoized storage for cashbacks in flat array "{cardId}_{catId} = percent"
  const cbMap = useMemo(() => {
    const map = {};
    cards.forEach(card => 
      categories.forEach(cat => {
        map[`${card.id}_${cat.id}`] = 0;
      })
    );
    cashbacks.forEach(({ cardId, catId, percent }) => 
      map[`${cardId}_${catId}`] = percent
    );
    return map;
  }, [cards, categories, cashbacks]);

  // Post request to card api
  async function addCard (cardName, cashbackValues) {
    try {
      const res = await fetch("card", {
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
    for (const [catId, percent] of values) {
      await fetch("cashback", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          cardId: parseInt(newCard.id), 
          catId: parseInt(catId), 
          percent: parseFloat(percent),
        })
    })}
    const resCashbacks = await fetch("cashback");
    const updatedCashbacks = await resCashbacks.json();
    setCashbacks(updatedCashbacks);

    toggleModal();    
    } catch (err) {
      console.error("Error: ", err)
    }
  }
  // Post request to category api
  async function addCat (newCat) {
    const formatName = newCat.toLowerCase().trim();
    if (categories.some(cat => cat.name.toLowerCase() === formatName))
        return;
      
    try {
      const res = await fetch("category", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name: newCat})
    });
    if (!res.ok) throw new Error("Failed to add category");
    const data = await res.json();
    setCategories(prev => [...prev, data]);
    toggleModal();
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  // Update cashback values for a card
  /* async function updateCash (cardId, updatedValues) {
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
  } */

  async function handleSave (newCards, newCats, newCbs) {
    setCards(newCards);
    setCategories(newCats);
    const cbEntries = Object.entries(newCbs);
    const revertCbMap = cbEntries.map(([key, value]) => {
      const [cardId, catId] = key.split("_").map(Number);
      const percent = parseFloat(value) || 0;
      return { cardId, catId, percent }
    })
    setCashbacks(revertCbMap);
    toggleEditing();
  }

  return (
    <div>
      <TableWrapper cards={cards} categories={categories} cbMap={cbMap} isEditing={isEditing} handleSave={handleSave} />
      {isEditing ? (
        <div>  
          <button onClick={() => {setModalType('addCategory'); toggleModal();}}>Add category</button>
          <button onClick={() => {setModalType('addCard'); toggleModal();}}>Add card</button>
        </div>
      ) : <button onClick={toggleEditing}>edit</button>}

      {modalOpen && (
        <Modal onClose={() => setModalType(null)}>
          {modalContent()}
        </Modal>
      )}
    </div>
  );
}

export default App;
