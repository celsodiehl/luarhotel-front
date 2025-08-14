import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService'; // Assuming your service is in a file called ApiService.js

const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
    const [error, setError] = useState(null); // Track any errors
    const [success, setSuccessMessage] = useState(null); // Track any errors



    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);


    const acheiveBooking = async (bookingId) => {
        if (!window.confirm('Tem certeza de que deseja obter esta reserva?')) {
            return; // Do nothing if the user cancels
        }

        try {
            const response = await ApiService.cancelBooking(bookingId);
            if (response.statusCode === 200) {
                setSuccessMessage("Reserva realizada com sucesso")

                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Detalhes da reserva</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Detalhes da Reserva</h3>
                    <p>Codigo de Confirmação: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Check-in Date: {bookingDetails.checkInDate}</p>
                    <p>Check-out Date: {bookingDetails.checkOutDate}</p>
                    <p>Qtde de Adultos: {bookingDetails.numOfAdults}</p>
                    <p>Qtde de Crianças: {bookingDetails.numOfChildren}</p>
                    <p>Email de Usuário: {bookingDetails.guestEmail}</p>

                    <br />
                    <hr />
                    <br />
                    <h3>Usuário que fez a reserva</h3>
                    <div>
                        <p> Nome: {bookingDetails.user.name}</p>
                        <p> Email: {bookingDetails.user.email}</p>
                        <p> Telefone: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <h3>Detalhes do Quarto</h3>
                    <div>
                        <p> Tipo de Quarto: {bookingDetails.room.type}</p>
                        <p> Valor: ${bookingDetails.room.price}</p>
                        <p> Descrição: {bookingDetails.room.description}</p>
                        <img src={bookingDetails.room.photoUrl} alt="" sizes="" srcSet="" />
                    </div>
                    <button
                        className="acheive-booking"
                        onClick={() => acheiveBooking(bookingDetails.id)}>Confirmar Reserva
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;