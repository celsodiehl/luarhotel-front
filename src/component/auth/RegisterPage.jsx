import React, { useState } from 'react';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { name, email, password, phoneNumber } = formData;
        if (!name || !email || !password || !phoneNumber) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setErrorMessage('Please fill all the fields.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }
        try {
            // Chamada do método register de ApiService
            const response = await ApiService.registerUser(formData);

            // Verifica se a resposta foi bem-sucedida
            if (response.statusCode === 200) {
                // Limpa os campos do formulário após o registro bem-sucedido
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                setSuccessMessage('Usuário cadastrado com successo!');
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/login');
                }, 3000);
            }
        }
        catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        
        <div className="auth-container">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Telefone:</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Senha:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <button type="submit">Registrar</button>
            </form>
            <p className="register-link">
                Já tem uma conta? <a href="/login">Login</a>
            </p>
        </div>
    );
}

export default RegisterPage;