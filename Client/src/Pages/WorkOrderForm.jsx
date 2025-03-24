import React, { useState } from 'react';

const WorkOrderForm = () => {
    // Estados para manejar los valores del formulario
    const [formData, setFormData] = useState({
        tipoImpresion: [],
        observaciones: '',
        plotter: '',
        elaboro: '',
        destino: '',
        clasificacion: '',
        noEmpApe: '',
        autorizo: '',
        tipoServicio: [],
        recepcionado: '',
        encargado: '',
        concepto: '',
        cantidad: '',
        costo: '',
        fecha: '',
        firma: '',
    });

    // Manejar cambios en los campos de texto
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar cambios en las casillas de verificación
    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({ ...formData, [field]: [...formData[field], value] });
        } else {
            setFormData({
                ...formData,
                [field]: formData[field].filter((item) => item !== value),
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-left">
                        <h1 className="text-lg font-bold">
                            UNIVERSIDAD TECNOLÓGICA DE NEZAHUALCÓYOTL
                        </h1>
                        <p className="text-sm">DIRECCIÓN GENERAL</p>
                        <p className="text-sm">DIVISIÓN DE DIFUSIÓN Y EXTENSIÓN UNIVERSITARIA</p>
                        <p className="text-sm">DEPARTAMENTO DE EDICIÓN Y PUBLICACIÓN</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold">ORDEN DE TRABAJO</h2>
                        <div className="mt-2">
                            <label className="text-sm">FECHA:</label>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleInputChange}
                                className="border-b border-gray-400 ml-2 w-32 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Sección de Tipo de Impresión y Observaciones */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Tipo de Impresión */}
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">TIPO DE IMPRESIÓN</h3>
                        <div className="flex flex-col">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="OFFSET"
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                OFFSET
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="SERIGRAFÍA"
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                SERIGRAFÍA
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="PLOTTER"
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                PLOTTER
                            </label>
                            <input
                                type="text"
                                name="plotter"
                                value={formData.plotter}
                                onChange={handleInputChange}
                                placeholder="Especificar"
                                className="border-b border-gray-400 mt-2 w-full focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">OBSERVACIONES</h3>
                        <textarea
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleInputChange}
                            className="w-full h-20 border border-gray-400 p-2 focus:outline-none"
                        />
                    </div>

                    {/* Área Solicitante */}
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">ÁREA SOLICITANTE</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="OTRO"
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                OTRO
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="DIRECCIÓN"
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                DIRECCIÓN
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="PRESTACIÓN DE SERVICIOS (Especificar)"
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                PRESTACIÓN DE SERVICIOS
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="CLASIFICACIÓN (Especificar)"
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                CLASIFICACIÓN
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="NO. DE EMP. A.P.E."
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                NO. DE EMP. A.P.E.
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="AUTORIZÓ"
                                    onChange={(e) => handleCheckboxChange(e, 'tipoImpresion')}
                                    className="mr-2"
                                />
                                AUTORIZÓ
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sección de Titular del Área y Elaboró */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">TITULAR DEL ÁREA SOLICITANTE</h3>
                        <input
                            type="text"
                            name="titular"
                            value={formData.titular}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                        <p className="text-sm mt-2">Nombre y Firma</p>
                    </div>
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">ELABORÓ</h3>
                        <input
                            type="text"
                            name="elaboro"
                            value={formData.elaboro}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                        <p className="text-sm mt-2">Nombre y Firma</p>
                    </div>
                </div>

                {/* Sección de Destino y Clasificación */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">DESTINO</h3>
                        <input
                            type="text"
                            name="destino"
                            value={formData.destino}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">CLASIFICACIÓN</h3>
                        <input
                            type="text"
                            name="clasificacion"
                            value={formData.clasificacion}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Sección de No. de Emp. A.P.E. y Autorizó */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">NO. DE EMP. A.P.E.</h3>
                        <input
                            type="text"
                            name="noEmpApe"
                            value={formData.noEmpApe}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">AUTORIZÓ</h3>
                        <input
                            type="text"
                            name="autorizo"
                            value={formData.autorizo}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Sección de Tipo de Servicio */}
                <div className="border p-2 mb-4">
                    <h3 className="font-bold text-sm mb-2">TIPO DE SERVICIO</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="RECEPCIONADO"
                                onChange={(e) => handleCheckboxChange(e, 'tipoServicio')}
                                className="mr-2"
                            />
                            RECEPCIONADO
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="ENCARGADO"
                                onChange={(e) => handleCheckboxChange(e, 'tipoServicio')}
                                className="mr-2"
                            />
                            ENCARGADO
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="CONCEPTO"
                                onChange={(e) => handleCheckboxChange(e, 'tipoServicio')}
                                className="mr-2"
                            />
                            CONCEPTO
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="CANTIDAD"
                                onChange={(e) => handleCheckboxChange(e, 'tipoServicio')}
                                className="mr-2"
                            />
                            CANTIDAD
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="COSTO"
                                onChange={(e) => handleCheckboxChange(e, 'tipoServicio')}
                                className="mr-2"
                            />
                            COSTO
                        </label>
                    </div>
                </div>

                {/* Sección de Detalles del Servicio */}
                <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">RECEPCIONADO</h3>
                        <input
                            type="text"
                            name="recepcionado"
                            value={formData.recepcionado}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">ENCARGADO</h3>
                        <input
                            type="text"
                            name="encargado"
                            value={formData.encargado}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">CONCEPTO</h3>
                        <input
                            type="text"
                            name="concepto"
                            value={formData.concepto}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">CANTIDAD</h3>
                        <input
                            type="number"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="border p-2">
                        <h3 className="font-bold text-sm mb-2">COSTO</h3>
                        <input
                            type="number"
                            name="costo"
                            value={formData.costo}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-400 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Firma */}
                <div className="border p-2">
                    <h3 className="font-bold text-sm mb-2">FIRMA</h3>
                    <input
                        type="text"
                        name="firma"
                        value={formData.firma}
                        onChange={handleInputChange}
                        className="w-full border-b border-gray-400 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkOrderForm;