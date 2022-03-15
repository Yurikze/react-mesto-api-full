import Popup from "./Popup"
import success from '../images/Union.png';
import fail from '../images/Unionerr.png';

const InfoTooltip = ({registerSuccess, isOpen, onClose}) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
        <div className="popup__content">
          <button
            className="popup__close-btn"
            type="button"
            aria-label="Закрыть"
            data-delete
            onClick={onClose}
          ></button>
          <div className="popup__info-tooltip">
            <img src={registerSuccess ? success : fail} alt="Регистрация" />
            <h2 className="popup__title popup__title_placement_tooltip">
              {registerSuccess ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте еще раз."}
            </h2>
          </div>
        </div>
      </Popup>
  )
}

export default InfoTooltip