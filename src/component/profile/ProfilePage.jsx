import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                // Busa reservas de usuários usando com user ID
                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                setUser(userPlusBookings.user)

            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-page">
            {user && <h2>Bem vindo, {user.name}</h2>}
            <div className="profile-actions">
                <button className="edit-profile-button" onClick={handleEditProfile}>Editar Perfil</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {user && (
                <div className="profile-details">
                    <h3>Detalhes do meu perfil</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Telefone:</strong> {user.phoneNumber}</p>
                </div>
            )}
            <div className="bookings-section">
                <h3>Meu histórico de reservas</h3>
                <div className="booking-list">
                    {user && user.bookings.length > 0 ? (
                        user.bookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <p><strong>Codigo de Reserva:</strong> {booking.bookingConfirmationCode}</p>
                                <p><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                                <p><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                                <p><strong>Total de Usuários:</strong> {booking.totalNumOfGuest}</p>
                                <p><strong>Tipo de Quarto:</strong> {booking.room.type}</p>
                                <img src={booking.room.roomPhotoUrl} alt="Room" className="room-photo" />
                            </div>
                        ))
                    ) : (
                            <p>Nenhuma reserva encontrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;