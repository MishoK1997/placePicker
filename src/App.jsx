import { useRef, useState, useEffect } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';


// This side effect is intended to render places based on localStorage data
// specifically, this data initializes the pickedPlaces state
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map(id =>
  AVAILABLE_PLACES.find((place) => place.id === id)
)


function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position)=>{
      console.log('Location fetched');
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
       )

       setAvailablePlaces(sortedPlaces);
    })
  }, []); 

  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
    setIsModalOpen(true);
  }

  function handleStopRemovePlace() {
    modal.current.close();
    setIsModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // This picked places data will be saved in local storage 
    // Note that this is another example of Side effect that do not require useEffect()
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces'))|| []
    if(storedIds.indexOf(id) === -1){
      localStorage.setItem(
        'selectedPlaces', 
        JSON.stringify([id, ...storedIds]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();


    // Remove  saved places from local storage
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces'))
    localStorage.setItem(
      'selectedPlaces', 
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    )
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText="Sorting places by distance!"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
