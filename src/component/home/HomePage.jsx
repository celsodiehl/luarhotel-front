import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";




const HomePage = () => {

    const [roomSearchResults, setRoomSearchResults] = useState([]);

    // Função para manipular resultados de pesquisa
    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    };

    return (
        <div className="home">
            {/* HEADER / BANNER ROOM SECTION */}
            <section>
                <header className="header-banner">
                    <img src="./assets/images/hotel.JPG" alt="Luar Hotel" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Bem vindo ao <span className="phegon-color">Luar Hotel</span>
                        </h1><br />
                        <h3>Entre em um refúgio de conforto e cuidado</h3>
                    </div>
                </header>
            </section>

            {/* SEARCH/FIND AVAILABLE ROOM SECTION */}
            <RoomSearch handleSearchResult={handleSearchResult} />
            <RoomResult roomSearchResults={roomSearchResults} />

            <h4><a className="view-rooms-home" href="/rooms">Todos quartos</a></h4>

            <h2 className="home-services">Serviços | <span className="phegon-color">Luar Hotel</span></h2>

            {/* SERVICES SECTION */}
            <section className="service-section"><div className="service-card">
                <img src="./assets/images/ac.JPG" alt="Air Conditioning" />
                <div className="service-details">
                    <h3 className="service-title">Ar Condicionado</h3>
                    <p className="service-description">Mantenha-se confortável durante sua estadia com nosso ar-condicionado controlado individualmente no quarto.</p>
                </div>
            </div>
                <div className="service-card">
                    <img src="./assets/images/minibar.JPG" alt="Mini Bar" />
                    <div className="service-details">
                        <h3 className="service-title">Frigobar</h3>
                        <p className="service-description">Desfrute de uma seleção conveniente de bebidas e lanches disponíveis no frigobar do seu quarto.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/parking.JPG" alt="Parking" />
                    <div className="service-details">
                        <h3 className="service-title">Estacionamento</h3>
                        <p className="service-description">Oferecemos estacionamento no local para sua conveniência. Consulte-nos sobre opções de manobrista, se disponíveis.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/wifi.JPG" alt="WiFi" />
                    <div className="service-details">
                        <h3 className="service-title">WiFi</h3>
                        <p className="service-description">Mantenha-se conectado durante sua estadia com acesso Wi-Fi de alta velocidade gratuito disponível em todos os quartos e áreas públicas.</p>
                    </div>
                </div>

            </section>
            {/* AVAILABLE ROOMS SECTION */}
            <section>

            </section>
        </div>
    );
}

export default HomePage;