import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';

const RoomSearch = ({ handleSearchResult }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Erro ao buscar tipos de quartos:', error.message);
            }
        };
        fetchRoomTypes();
    }, []);

    /** Método usado para mostrar erros */
    const showError = (message, timeout = 5000) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, timeout);
    };

    /**Método usado para buscar quartos disponíveis com base nos dados de pesquisa que serão passados */
    const handleInternalSearch = async () => {
        if (!startDate || !endDate || !roomType) {
            showError('Por favor, preencha todos os campos!');
            return false;
        }
        try {
            // Converter startDate para o formato desejado
            const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
            const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
            // Chama a API para buscar quartos disponíveis
            const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartDate, formattedEndDate, roomType);

            // Verifica se a resposta foi bem-sucedida
            if (response.statusCode === 200) {
                if (response.roomList.length === 0) {
                    showError('Quarto indisponível no momento para este intervalo de datas no tipo de quarto selecionado.');
                    return
                }
                handleSearchResult(response.roomList);
                setError('');
            }
        } catch (error) {
            showError("Ocorreu um erro desconhecido: " + error.response.data.message);
        }
    };

    return (
        <section>
            <div className="search-container">
                <div className="search-field">
                    <label>Data de Entrada</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-in Date"
                    />
                </div>
                <div className="search-field">
                    <label>Data de Saída</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-out Date"
                    />
                </div>

                <div className="search-field">
                    <label>Tipo de Quarto</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                        <option disabled value="">
                            Selecione o tipo de quarto
                        </option>
                        {roomTypes.map((roomType) => (
                            <option key={roomType} value={roomType}>
                                {roomType}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="home-search-button" onClick={handleInternalSearch}>
                    Buscar
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </section>
    );
};

export default RoomSearch;