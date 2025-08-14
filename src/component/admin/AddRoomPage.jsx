import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';


const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        photoUrl: '',
        type: '',
        price: '',
        description: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);


    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Erro ao buscar tipos de quarto:', error.message);
            }
        };
        fetchRoomTypes();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewRoomType(true);
            setRoomDetails(prevState => ({ ...prevState, type: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prevState => ({ ...prevState, type: e.target.value }));
        }
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


    const addRoom = async () => {
        if (!roomDetails.type || !roomDetails.price || !roomDetails.description) {
            setError('Todos os detalhes do quarto devem ser fornecidos.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (!window.confirm('Você quer adicionar este quarto?')) {
            return
        }

        try {
            const formData = new FormData();
            formData.append('type', roomDetails.type);
            formData.append('price', roomDetails.price);
            formData.append('description', roomDetails.description);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.addRoom(formData);
            if (result.statusCode === 200) {
                setSuccess('Quarto adicionado com sucesso.');

                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="edit-room-container">
            <h2>Adicionar novo quarto</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="edit-room-form">
                <div className="form-group">
                    {preview && (
                        <img src={preview} alt="Room Preview" className="room-photo-preview" />
                    )}
                    <input
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group">
                    <label>Tipo de quarto</label>
                    <select value={roomDetails.type} onChange={handleRoomTypeChange}>
                        <option value="">Selecione um tipo de quarto</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="new">Outro (por favor especifique)</option>
                    </select>
                    {newRoomType && (
                        <input
                            type="text"
                            name="type"
                            placeholder="Digite um novo tipo de quarto"
                            value={roomDetails.roomType}
                            onChange={handleChange}
                        />
                    )}
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
                    <label>Room Description</label>
                    <textarea
                        name="description"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button className="update-button" onClick={addRoom}>Adicionar quarto</button>
            </div>
        </div>
    );
};

export default AddRoomPage;