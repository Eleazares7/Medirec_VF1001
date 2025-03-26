// src/components/DoctorReports/useDoctorReports.js
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const useDoctorReports = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [filters, setFilters] = useState({
        especialidad: '',
        estadoHorario: '',
        fechaInicio: null,
        fechaFin: null,
        nombre: '',
    });
    const [especialidades, setEspecialidades] = useState([]);
    const [showCharts, setShowCharts] = useState(false);

    // Obtener los datos de los médicos al cargar el componente
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/admin/users/reportDoctors', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setDoctors(data.doctors);
                    setFilteredDoctors(data.doctors);

                    // Obtener especialidades únicas
                    const uniqueEspecialidades = [...new Set(data.doctors.map((doctor) => doctor.especialidad))];
                    setEspecialidades(uniqueEspecialidades);
                } else {
                    throw new Error(data.message || 'Error al obtener los médicos');
                }
            } catch (error) {
                console.error('Error al obtener los médicos:', error);
            }
        };

        fetchDoctors();
    }, []);

    // Aplicar filtros
    useEffect(() => {
        let filtered = [...doctors];

        // Filtrar por nombre
        if (filters.nombre) {
            filtered = filtered.filter((doctor) =>
                `${doctor.nombre} ${doctor.apellido}`
                    .toLowerCase()
                    .includes(filters.nombre.toLowerCase())
            );
        }

        // Filtrar por especialidad
        if (filters.especialidad) {
            filtered = filtered.filter((doctor) => doctor.especialidad === filters.especialidad);
        }

        // Filtrar por estado de horarios
        if (filters.estadoHorario) {
            filtered = filtered.filter((doctor) =>
                doctor.horarios.some((horario) => horario.estado === filters.estadoHorario)
            );
        }

        // Filtrar por rango de fechas
        if (filters.fechaInicio && filters.fechaFin) {
            filtered = filtered.filter((doctor) =>
                doctor.horarios.some((horario) => {
                    if (!horario.fecha) return false;
                    const fechaHorario = new Date(horario.fecha);
                    return (
                        fechaHorario >= new Date(filters.fechaInicio) &&
                        fechaHorario <= new Date(filters.fechaFin)
                    );
                })
            );
        }

        setFilteredDoctors(filtered);
    }, [filters, doctors]);

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Manejar cambios en las fechas
    const handleDateChange = (date, field) => {
        setFilters((prev) => ({ ...prev, [field]: date }));
    };

    // Generar datos para la gráfica de barras (médicos por especialidad)
    const barChartData = {
        labels: especialidades,
        datasets: [
            {
                label: 'Número de Médicos',
                data: especialidades.map(
                    (especialidad) =>
                        filteredDoctors.filter((doctor) => doctor.especialidad === especialidad).length
                ),
                backgroundColor: 'rgba(45, 212, 191, 0.6)',
                borderColor: 'rgba(45, 212, 191, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Generar datos para la gráfica de pastel (distribución de horarios por estado)
    const pieChartData = {
        labels: ['Disponible', 'Reservado', 'Cancelado'],
        datasets: [
            {
                label: 'Distribución de Horarios',
                data: [
                    filteredDoctors.reduce(
                        (acc, doctor) =>
                            acc +
                            doctor.horarios.filter((horario) => horario.estado === 'Disponible').length,
                        0
                    ),
                    filteredDoctors.reduce(
                        (acc, doctor) =>
                            acc +
                            doctor.horarios.filter((horario) => horario.estado === 'Reservado').length,
                        0
                    ),
                    filteredDoctors.reduce(
                        (acc, doctor) =>
                            acc +
                            doctor.horarios.filter((horario) => horario.estado === 'Cancelado').length,
                        0
                    ),
                ],
                backgroundColor: [
                    'rgba(45, 212, 191, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(45, 212, 191, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Generar PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // Definir colores
        const primaryColor = [45, 212, 191];
        const secondaryColor = [200, 200, 200];
        const textColor = [50, 50, 50];

        // Encabezado
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Reporte de Médicos', 105, 15, { align: 'center' });

        // Subtítulo con la fecha
        doc.setFontSize(12);
        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 25, { align: 'center' });

        // Preparar datos para la tabla
        const tableData = filteredDoctors.map((doctor) => [
            `${doctor.nombre} ${doctor.apellido}`,
            doctor.especialidad,
            doctor.email,
            doctor.numero_licencia,
            doctor.horarios && doctor.horarios.length > 0
                ? doctor.horarios
                    .map(
                        (h) =>
                            `${h.dia_semana || h.fecha} de ${h.hora_inicio} a ${h.hora_fin} (${h.estado})`
                    )
                    .join('\n')
                : 'Sin horarios',
        ]);

        // Crear tabla con autoTable
        autoTable(doc, {
            startY: 40,
            head: [['Nombre', 'Especialidad', 'Email', 'Número de Licencia', 'Horarios']],
            body: tableData,
            theme: 'striped',
            styles: {
                font: 'helvetica',
                fontSize: 10,
                textColor: textColor,
                lineColor: [150, 150, 150],
                lineWidth: 0.1,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontSize: 11,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: secondaryColor,
            },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 30 },
                2: { cellWidth: 40 },
                3: { cellWidth: 30 },
                4: { cellWidth: 60 },
            },
            margin: { top: 40, left: 10, right: 10 },
            didDrawPage: (data) => {
                const pageCount = doc.internal.getNumberOfPages();
                const pageHeight = doc.internal.pageSize.height;
                doc.setFontSize(10);
                doc.setTextColor(...textColor);
                doc.setFont('helvetica', 'normal');
                doc.text(
                    `Reporte generado por Sistema de Gestión Médica`,
                    105,
                    pageHeight - 10,
                    { align: 'center' }
                );
                doc.text(
                    `Página ${data.pageNumber} de ${pageCount}`,
                    190,
                    pageHeight - 10,
                    { align: 'right' }
                );
            },
        });

        doc.save('reporte_medicos.pdf');
    };

    // Preparar datos para CSV
    const csvData = filteredDoctors.map((doctor) => ({
        Nombre: doctor.nombre,
        Apellido: doctor.apellido,
        Especialidad: doctor.especialidad,
        Email: doctor.email,
        'Número de Licencia': doctor.numero_licencia,
        Horarios: doctor.horarios
            ? doctor.horarios
                .map(
                    (h) =>
                        `${h.dia_semana || h.fecha} de ${h.hora_inicio} a ${h.hora_fin} (${h.estado})`
                )
                .join('; ')
            : 'Sin horarios',
    }));

    return {
        filteredDoctors,
        filters,
        especialidades,
        showCharts,
        barChartData,
        pieChartData,
        csvData,
        handleFilterChange,
        handleDateChange,
        generatePDF,
        setShowCharts,
    };
};

export default useDoctorReports;