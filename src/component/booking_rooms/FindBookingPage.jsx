import React, { useState } from 'react';
import ApiService from '../../service/ApiService';

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState(''); // variavel de estado p/ confirmation code
    const [bookingDetails, setBookingDetails] = useState(null); // variavel de estado p/ booking details
    const [error, setError] = useState(null); // Rastrear erros

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Please Enter a booking confirmation code");
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            // chamada para a API para obter detalhes da reserva
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null); // limpa erro se foi bem sucedido
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Buscar Reserva</h2>
            <div className="search-container">
                <input
                    required
                    type="text"
                    placeholder="Digite seu código de confirmação"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Detalhes da Reserva</h3>
                    <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Data de Entrada: {bookingDetails.checkInDate}</p>
                    <p>Data de Saída: {bookingDetails.checkOutDate}</p>
                    <p>Qtde Adultos: {bookingDetails.numOfAdults}</p>
                    <p>Qtde Crianças: {bookingDetails.numOfChildren}</p>

                    <br />
                    <hr />
                    <br />
                    <h3>Reservado por</h3>
                    <div>
                        <p> Nome: {bookingDetails.user.name}</p>
                        <p> Email: {bookingDetails.user.email}</p>
                        <p> Telefone: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <h3>Detalhes do quarto</h3>
                    <div>
                        <p> Tipo de quarto: {bookingDetails.room.type}</p>
                        <img src={bookingDetails.room.photoUrl} alt="" sizes="" srcSet="" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindBookingPage;