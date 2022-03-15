import React, { useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import auth from '../utils/auth';
import { CurrentUserContext, user } from '../contexts/CurrentUserContext';
import { LoadingContext } from '../contexts/LoadingContext';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import RemovePlacePopup from './RemovePlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [inInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(user);
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    async function fetchUserData() {
      const userData = await api.getUserInfo();
      setCurrentUser((user) => ({
        ...user,
        ...userData,
      }));
    }
    try {
      fetchUserData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    const fetchCards = async () => {
      const res = await api.getInitialCards();
      setCards(res);
    };
    try {
      fetchCards();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const tokenCheck = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    auth
      .getContent(localStorage.getItem('token'))
      .then((res) => {
        setLoggedIn(true);
        setCurrentUser((user) => ({
          ...user,
          email: res.data.email,
        }));
      })
      .catch((e) => console.log(e));
  };

  React.useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [loggedIn]);

  React.useEffect(() => {
    tokenCheck();
  }, []);

  const onRegister = (data) => {
    return auth
      .signup(data)
      .then((res) => {
        setRegisterSuccess(true);
      })
      .catch((e) => console.log(e))
      .finally(() => setIsInfoTooltipOpen(true));
  };

  const onLogin = (data) => {
    return auth
      .signin(data)
      .then((res) => {
        localStorage.setItem('token', res.token);
        tokenCheck();
      })
      .catch((e) => console.log(e));
  };

  const onLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
    history.push('/sign-in');
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .likeCard(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  };

  const handelCardDelete = (card) => {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then((res) => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateUser = (userData) => {
    setIsLoading(true);
    api
      .updateUserInfo(userData)
      .then((res) => {
        setCurrentUser((user) => ({
          ...user,
          ...res,
        }));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateAvatar = ({ avatar }) => {
    setIsLoading(true);
    api
      .updateAvatar(avatar)
      .then((res) => {
        setCurrentUser((user) => {
          return {
            ...user,
            avatar: res.avatar,
          };
        });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleAddPlaceSubmit = (newPlace) => {
    setIsLoading(true);
    api
      .addCard(newPlace)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleRemoveCardClick = (card) => {
    setIsDeletePopupOpen(true);
    setSelectedCard(card);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <LoadingContext.Provider value={isLoading}>
          <Header loggedIn={loggedIn} onLogout={onLogout} />
          <Switch>
            <Route path="/sign-up">
              <Register
                onRegister={onRegister}
                registerSuccess={registerSuccess}
              />
              <InfoTooltip
                isOpen={inInfoTooltipOpen}
                registerSuccess={registerSuccess}
                onClose={closeAllPopups}
              />
            </Route>
            <Route path="/sign-in">
              <Login onLogin={onLogin} />
            </Route>
            <ProtectedRoute exact path="/" loggedIn={loggedIn}>
              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleRemoveCardClick}
              />
              <Footer />
              <ImagePopup
                isOpen={isImagePopupOpen}
                card={selectedCard}
                onClose={closeAllPopups}
              />
              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
              />
              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
              />
              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit}
              />
              <RemovePlacePopup
                isOpen={isDeletePopupOpen}
                onClose={closeAllPopups}
                onDeleteCard={handelCardDelete}
                card={selectedCard}
              />
            </ProtectedRoute>

            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </LoadingContext.Provider>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
