import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { cardService } from './services/cardService.js';
import { categoryService } from './services/categoryService.js';
import { cashbackService } from './services/cashbackService.js';
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
      case 'addCard': {
        if (categories.length === 0) 
          toggleModal();
        else
          return <AddCard addCard={addCard} categories={categories} toggleModal={toggleModal} />;
        
         break;
      };
      case 'addCategory':
        return <AddCategory addCat={addCat} categories={categories} />;
      default:
        return null;
    }
  }

  // Store initial data from card, category, cashback API on start
  useEffect(() => {
    Promise.all([
      cardService.getCards(),
      categoryService.getCategory(),
      cashbackService.getCashback(),
    ]).then(([cardsRes, categoriesRes, cashbacksRes]) => {
      setCards(cardsRes);
      setCategories(categoriesRes);
      setCashbacks(cashbacksRes);
    })
  }, []);

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
      const newCard = await cardService.createCard({name: cardName});
      setCards(prev => [...prev, newCard]);
      
      const values = Object.entries(cashbackValues).map(([catId, percent]) => ({
        cardId: parseInt(newCard.id),
        catId: parseInt(catId),
        percent: parseFloat(percent),
      }));
      const resCashback = await cashbackService.createCashback(values);
      setCashbacks(prev => [...prev, ...resCashback]);

      toggleModal();    
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  // Post request to category api
  async function addCat (newCat) {
    newCat.trim();
    const formatName = newCat.toLowerCase();
    if (categories.some(cat => cat.name.toLowerCase() === formatName))
        return;
      
    try {
      const res = await categoryService.createCategory({ name: newCat });
      setCategories(prev => [...prev, res]);
      toggleModal();
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  // Handle save all edits to table
  async function handleSave (newCards, newCats, newCbs) {
    const formatCards = Object.entries(newCards).map(([id, name]) => ({ id: parseInt(id), name }));
 
    setCards(prev => 
      prev.map(card => 
        newCards[card.id] ? {...card, name: newCards[card.id]} : card
      )
    );
    setCategories(prev =>
      prev.map(cat => 
        newCats[cat.id] ? {...cat, name: newCats[cat.id]} : cat
      )
    );
    setCashbacks(prev =>
      prev.map(cb => {
        const key = `${cb.cardId}_${cb.catId}`;
        return newCbs[key] !== undefined ? {...cb, percent: newCbs[key]} : cb
      })
    )

    Promise.all([
      cardService.updateCards(formatCards),
      categoryService.udpateCategory(
        Object.entries(newCats).map(([id, name]) => ({ id: parseInt(id), name }))
      ),
      cashbackService.updateCashback(
        Object.entries(newCbs).map((([key, value]) => {
          const [cardId, catId] = key.split('_').map(Number);
          return { cardId, catId, percent: parseFloat(value) }
        }))
      ),
    ]);
    toggleEditing();
  }
  
  // Console log current cards, categories, cashbacks
  useEffect(() =>  {
    console.log("cards", cards);
    console.log("categories", categories);
    console.log("cashbacks", cashbacks);
  }, [cards, categories, cashbacks]);

  return (
    <div>
      <TableWrapper cards={cards} categories={categories} cbMap={cbMap} isEditing={isEditing} handleSave={handleSave} />
      {!isEditing &&
        <div> 
          <button onClick={() => {setModalType('addCategory'); toggleModal();}}>Add category</button>
          <button onClick={() => {setModalType('addCard'); toggleModal();}}>Add card</button>
          <button onClick={toggleEditing}>edit</button>
        </div>
      }
        
      {modalOpen && (
        <Modal onClose={() => setModalType(null)}>
          {modalContent()}
        </Modal>
      )}
    </div>
  );
}

export default App;
