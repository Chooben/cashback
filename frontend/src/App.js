import './App.css';
import { useEffect, useState } from 'react';
import { AddCard } from './components/AddCard';
import { AddCategory } from './components/AddCategory';
import { Modal } from './components/Modal/Modal.js';
import { TableWrapper } from './components/Table/TableWrapper.js';
import { DeleteCard } from './components/DeleteCard.js';
import { useCards } from './hooks/useCards.js';
import { useCategories } from './hooks/useCategories.js';
import { useCashbacks } from './hooks/useCashbacks.js';
import { DeleteCategory } from './components/DeleteCategory.js';

function App() {

  // Usestate variables to store api data
  const { 
    cards, 
    setCards, 
    addCard, 
    updateCard, 
    deleteCard 
  } = useCards();
  const { 
    categories, 
    setCategories, 
    addCategory, 
    udpateCategory, 
    deleteCategory,
  } = useCategories();
  const { 
    cashbacks, 
    setCashbacks, 
    cbMap,
    addCashbacks, 
    updateCashbacks 
  } = useCashbacks({cards, categories});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  

  function toggleModal () {
    setModalOpen(!modalOpen);
  };
  const toggleEditing= () => {
    setIsEditing(!isEditing);
    setModalType(null);
  };
  const modalContent = () => {
    switch (modalType) {
      case 'addCard':
        if (categories.length === 0){
          toggleModal();
          return null;
        }
        return <AddCard 
          addCard={addCard} categories={categories} addCashbacks={addCashbacks} toggleModal={toggleModal} 
        />;

      case 'addCategory':
        return <AddCategory 
          addCat={addCategory} categories={categories} addCashbacks={addCashbacks} toggleModal={toggleModal} 
        />;
        
      case 'deleteCard':
        if (cards.length === 0)
          toggleModal();
        return <DeleteCard cards={cards} deleteCard={deleteCard} toggleModal={toggleModal} />;

      case 'deleteCat':
        if (categories.length === 0)
          toggleModal();
        return <DeleteCategory categories={categories} deleteCategory={deleteCategory} toggleModal={toggleModal} />;
      default:
        return null;
      
    }
  };

  // Handle save all edits to table
  async function handleEdit (newCards, newCats, newCbs) {
    Promise.all([
      updateCard(newCards),
      udpateCategory(newCats),
      updateCashbacks(newCbs),
    ]).then(
      toggleEditing()
    );
    
  }
  
  // Console log current cards, categories, cashbacks
  useEffect(() =>  {
    console.log("cards", cards);
    console.log("categories", categories);
    console.log("cashbacks", cashbacks);
    console.log("cbMap", cbMap)
  }, [cards, categories, cashbacks]);

  return (
    <div>
      <TableWrapper cards={cards} categories={categories} cbMap={cbMap} isEditing={isEditing} handleEdit={handleEdit} />
      {!isEditing &&
        <div> 
          <button onClick={() => {setModalType('addCategory'); toggleModal();}}>Add category</button>
          <button onClick={() => {setModalType('addCard'); toggleModal();}}>Add card</button>
          <button onClick={toggleEditing}>edit</button>
          <button onClick={() => {setModalType('deleteCard'); toggleModal();}}>Delete card</button>
          <button onClick={() => {setModalType('deleteCat'); toggleModal();}}>Delete category</button>
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
