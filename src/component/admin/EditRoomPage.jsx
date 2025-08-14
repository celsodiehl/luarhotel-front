import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails({
                    photoUrl: response.room.photoUrl,
                    type: response.room.type,
                    price: response.room.price,
                    description: response.room.description,
                });
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchRoomDetails();
    }, [roomId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    };


    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('type', roomDetails.type);
            formData.append('price', roomDetails.price);
            formData.append('description', roomDetails.description);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.updateRoom(roomId, formData);
            if (result.statusCode === 200) {
                setSuccess('Quarto atualizado com successo.');

                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Você quer apagar esta sala?')) {
            try {
                const result = await ApiService.deleteRoom(roomId);
                if (result.statusCode === 200) {
                    setSuccess('Quarto Deletado com successo.');

                    setTimeout(() => {
                        setSuccess('');
                        navigate('/admin/manage-rooms');
                    }, 3000);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setTimeout(() => setError(''), 5000);
            }
        }
    };

    return (
        <div className="edit-room-container">
            <h2>Editar Quarto</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="edit-room-form">
                <div className="form-group">
                    {preview ? (
                        <img src={preview} alt="Room Preview" className="room-photo-preview" />
                    ) : (
                        roomDetails.photoUrl && (
                            <img src={roomDetails.photoUrl} alt="Room" className="room-photo" />
                        )
                    )}
                    <input
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="form-group">
                    <label>Tipo</label>
                    <input
                        type="text"
                        name="type"
                        value={roomDetails.type}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Valor</label>
                    <input
                        type="text"
                        name="price"
                        value={roomDetails.price}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                        name="description"
                        value={roomDetails.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button className="update-button" onClick={handleUpdate}>Atualizar Quarto</button>
                <button className="delete-button" onClick={handleDelete}>Deletar Quarto</button>
            </div>
        </div>
    );
};

export default EditRoomPage;