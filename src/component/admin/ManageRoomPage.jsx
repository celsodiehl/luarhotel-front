import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import RoomResult from '../common/RoomResult';

const ManageRoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await ApiService.getAllRooms();
                const allRooms = response.roomList;
                setRooms(allRooms);
                setFilteredRooms(allRooms);
            } catch (error) {
                console.error('Erro ao buscar quartos:', error.message);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Erro ao buscar tipos de quartos:', error.message);
            }
        };

        fetchRooms();
        fetchRoomTypes();
    }, []);

    const handleRoomTypeChange = (e) => {
        setSelectedRoomType(e.target.value);
        filterRooms(e.target.value);
    };

    const filterRooms = (type) => {
        if (type === '') {
            setFilteredRooms(rooms);
        } else {
            const filtered = rooms.filter((room) => room.type === type);
            setFilteredRooms(filtered);
        }
        setCurrentPage(1); // Redefinir para a primeira página após a filtragem
    };

    // Paginação
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // Alterar pagina
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='all-rooms'>
            <h2>Todos quartos</h2>
            <div className='all-room-filter-div' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className='filter-select-div'>
                    <label>Buscar por tipo de quarto:</label>
                    <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                        <option value="">Todos</option>
                        {roomTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <button className='add-room-button' onClick={() => navigate('/admin/add-room')}>
                        Adicionar quarto
                    </button>
                </div>
            </div>

            <RoomResult roomSearchResults={currentRooms} />

            <Pagination
                roomsPerPage={roomsPerPage}
                totalRooms={filteredRooms.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default ManageRoomPage;