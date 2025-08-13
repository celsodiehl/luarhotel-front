import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const RoomDetailsPage = () => {
    const navigate = useNavigate(); // Acesse a função de navegação para navegar
    const { roomId } = useParams(); // Get room ID from URL parameters
    const [roomDetails, setRoomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track any errors
    const [checkInDate, setCheckInDate] = useState(null); // Variável de estado para check-in date
    const [checkOutDate, setCheckOutDate] = useState(null); // Variável de estado para check-out date
    const [numAdults, setNumAdults] = useState(1); // Variável de estado para number of adults
    const [numChildren, setNumChildren] = useState(0); // Variável de estado para number of children
    const [totalPrice, setTotalPrice] = useState(0); // Variável de estado para total booking price
    const [totalGuests, setTotalGuests] = useState(1); // Variável de estado para total number of guests
    const [showDatePicker, setShowDatePicker] = useState(false); // Variável de estado para control date picker visibility
    const [userId, setUserId] = useState(''); // Set user id
    const [showMessage, setShowMessage] = useState(false); // Variável de estado para control message visibility
    const [confirmationCode, setConfirmationCode] = useState(''); // Variável de estado para booking confirmation code
    const [errorMessage, setErrorMessage] = useState(''); // Variável de estado para error message

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true); // Define o estado de carregamento como verdadeiro
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails(response.room);
                const userProfile = await ApiService.getUserProfile();
                setUserId(userProfile.user.id);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            } finally {
                setIsLoading(false); // Definir estado de carregamento como falso após busca ou erro
            }
        };
        fetchData();
    }, [roomId]); // Re-run effect when roomId changes


    const handleConfirmBooking = async () => {
        // Check if check-in and check-out dates are selected
        if (!checkInDate || !checkOutDate) {
            setErrorMessage('Please select check-in and check-out dates.');
            setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
            return;
        }

        // Check if number of adults and children are valid
        if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
            setErrorMessage('Please enter valid numbers for adults and children.');
            setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
            return;
        }

        // Calculate total number of days
        const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

        // Calculate total number of guests
        const totalGuests = numAdults + numChildren;

        // Calculate total price
        const roomPricePerNight = roomDetails.price;
        const totalPrice = roomPricePerNight * totalDays;

        setTotalPrice(totalPrice);
        setTotalGuests(totalGuests);
    };

    const acceptBooking = async () => {
        try {

            // Ensure checkInDate and checkOutDate are Date objects
            const startDate = new Date(checkInDate);
            const endDate = new Date(checkOutDate);

            // Log the original dates for debugging
            console.log("Original Check-in Date:", startDate);
            console.log("Original Check-out Date:", endDate);

            // Convert dates to YYYY-MM-DD format, adjusting for time zone differences
            const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];


            // Log the original dates for debugging
            console.log("Formated Check-in Date:", formattedCheckInDate);
            console.log("Formated Check-out Date:", formattedCheckOutDate);

            // Create booking object
            const booking = {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                numOfAdults: numAdults,
                numOfChildren: numChildren
            };
            console.log(booking)
            console.log(checkOutDate)

            // Make booking
            const response = await ApiService.bookRoom(roomId, userId, booking);
            if (response.statusCode === 200) {
                setConfirmationCode(response.bookingConfirmationCode); // Set booking confirmation code
                setShowMessage(true); // Show message
                // Hide message and navigate to homepage after 5 seconds
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/rooms'); // Navigate to rooms
                }, 10000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
        }
    };

    if (isLoading) {
        return <p className='room-detail-loading'>Carregando detalhes do quarto...</p>;
    }

    if (error) {
        return <p className='room-detail-loading'>{error}</p>;
    }

    if (!roomDetails) {
        return <p className='room-detail-loading'>Quarto não encontrado.</p>;
    }

    const { type, price, photoUrl, description, bookings } = roomDetails;

    return (
        <div className="room-details-booking">
            {showMessage && (
                <p className="booking-success-message">
                  Reserva efetuada com sucesso! Código de confirmação: {confirmationCode}. Um SMS e um e-mail com os detalhes da sua reserva foram enviados para você.
                </p>
            )}
            {errorMessage && (
                <p className="error-message">
                    {errorMessage}
                </p>
            )}
            <h2>Quarto detalhes</h2>
            <br />
            <img src={photoUrl} alt={type} className="room-details-image" />
            <div className="room-details-info">
                <h3>{type}</h3>
                <p>Valor: R${price} / night</p>
                <p>{description}</p>
            </div>
            {bookings && bookings.length > 0 && (
                <div>
                    <h3>Detalhes da reserva existente</h3>
                    <ul className="booking-list">
                        {bookings.map((booking, index) => (
                            <li key={booking.id} className="booking-item">
                                <span className="booking-number">Reserva {index + 1} </span>
                                <span className="booking-text">Entrada: {booking.checkInDate} </span>
                                <span className="booking-text">Saída: {booking.checkOutDate}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="booking-info">
                <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Reservar Agora</button>
                <button className="go-back-button" onClick={() => setShowDatePicker(false)}>Voltar</button>
                {showDatePicker && (
                    <div className="date-picker-container">
                        <DatePicker
                            className="detail-search-field"
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            placeholderText="Check-in Date"
                            dateFormat="dd/MM/yyyy"
                        // dateFormat="yyyy-MM-dd"
                        />
                        <DatePicker
                            className="detail-search-field"
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            selectsEnd
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={checkInDate}
                            placeholderText="Check-out Date"
                            // dateFormat="yyyy-MM-dd"
                            dateFormat="dd/MM/yyyy"
                        />

                        <div className='guest-container'>
                            <div className="guest-div">
                                <label>Adultos:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={numAdults}
                                    onChange={(e) => setNumAdults(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="guest-div">
                                <label>Crianças:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={numChildren}
                                    onChange={(e) => setNumChildren(parseInt(e.target.value))}
                                />
                            </div>
                            <button className="confirm-booking" onClick={handleConfirmBooking}>Confirmar Reserva</button>
                        </div>
                    </div>
                )}
                {totalPrice > 0 && (
                    <div className="total-price">
                        <p>Valor Total: R${totalPrice}</p>
                        <p>Total Usuários: {totalGuests}</p>
                        <button onClick={acceptBooking} className="accept-booking">Aceitar Reserva</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomDetailsPage;