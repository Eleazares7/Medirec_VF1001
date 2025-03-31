import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Navbar from '../../Components/HomeComponents/NavBar';
import Swal from 'sweetalert2';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'es': es },
});

Modal.setAppElement('#root');

const ViewAppointments = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState('calendar');
    const [selectedMonth, setSelectedMonth] = useState(''); // Nuevo estado para el filtro de mes

    useEffect(() => setIsVisible(true), []);

    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/users/getUserAppointments', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Error al obtener las citas');
                const data = await response.json();
                setAppointments(data);
            } catch (err) {
                console.error('Error al cargar las citas:', err);
                setError('No se pudieron cargar las citas. Intenta de nuevo más tarde.');
                Swal.fire({ icon: 'error', title: 'Error', text: err.message });
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();

        // Datos de prueba (descomentar si necesitas)
        /*
        setAppointments([
          { id_consulta: 1, fecha_consulta: '2025-04-15', hora_consulta: '10:00', medico_nombre: 'Juan', medico_apellido: 'Pérez', estado: 'pendiente' },
          { id_consulta: 2, fecha_consulta: '2025-05-20', hora_consulta: '14:30', medico_nombre: 'María', medico_apellido: 'Gómez', estado: 'pendiente' },
          { id_consulta: 3, fecha_consulta: '2025-04-10', hora_consulta: '09:00', medico_nombre: 'Luis', medico_apellido: 'Martínez', estado: 'pendiente' },
          { id_consulta: 4, fecha_consulta: '2025-06-01', hora_consulta: '15:00', medico_nombre: 'Ana', medico_apellido: 'López', estado: 'pendiente' },
        ]);
        */
    }, []);

    const events = appointments.map((appointment) => {
        const startDate = new Date(appointment.fecha_consulta);
        const [hours, minutes] = appointment.hora_consulta.split(':');
        startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + 30);

        return {
            id: appointment.id_consulta,
            title: `Cita con Dr. ${appointment.medico_nombre} ${appointment.medico_apellido}`,
            start: startDate,
            end: endDate,
            allDay: false,
            resource: appointment,
        };
    });

    const eventStyleGetter = (event) => {
        const estado = event.resource.estado;
        const backgroundColor = {
            'pendiente': '#fbbf24',
            'completada': '#10b981',
            'cancelada': '#ef4444',
        }[estado] || '#6b7280';
        return {
            style: { backgroundColor, borderRadius: '8px', opacity: 0.9, color: 'white', border: 'none', padding: '4px 8px' },
        };
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEvent(null);
    };

    const handleCancelAppointment = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción cancelará tu cita.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:5000/users/cancelAppointment/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    });
                    if (!response.ok) throw new Error('Error al cancelar la cita');
                    setAppointments(appointments.map(app => app.id_consulta === id ? { ...app, estado: 'cancelada' } : app));
                    Swal.fire('Cancelada', 'Tu cita ha sido cancelada.', 'success');
                    closeModal();
                } catch (err) {
                    Swal.fire('Error', err.message, 'error');
                }
            }
        });
    };

    const handleRescheduleAppointment = (id) => {
        Swal.fire('Info', 'Funcionalidad de reagendar en desarrollo. ID de cita: ' + id, 'info');
    };

    const CustomToolbar = ({ label, onNavigate, onView }) => (
        <div className="flex justify-between items-center mb-4 p-4 bg-teal-50 rounded-lg shadow-sm">
            <div className="space-x-2">
                <button onClick={() => onNavigate('PREV')} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Anterior
                </button>
                <button onClick={() => onNavigate('NEXT')} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Siguiente
                </button>
                <button onClick={() => onNavigate('TODAY')} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                    Hoy
                </button>
            </div>
            <h2 className="text-xl font-semibold text-teal-900">{label}</h2>
            <div className="space-x-2">
                <button onClick={() => onView('month')} className="px-4 py-2 bg-gray-200 text-teal-800 rounded-lg hover:bg-gray-300">
                    Mes
                </button>
                <button onClick={() => onView('week')} className="px-4 py-2 bg-gray-200 text-teal-800 rounded-lg hover:bg-gray-300">
                    Semana
                </button>
                <button onClick={() => onView('day')} className="px-4 py-2 bg-gray-200 text-teal-800 rounded-lg hover:bg-gray-300">
                    Día
                </button>
            </div>
        </div>
    );

    const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' });
    const getMonthYear = (isoDate) => new Date(isoDate).toLocaleDateString('es-MX', { month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' });

    // Componente de la vista en tabla con ordenamiento y separación por meses
    const TableView = () => {
        // Ordenar citas por fecha (de más cercana a más lejana)
        const sortedAppointments = [...appointments].sort((a, b) => new Date(a.fecha_consulta) - new Date(b.fecha_consulta));

        // Obtener meses únicos para el filtro
        const uniqueMonths = [...new Set(sortedAppointments.map(app => getMonthYear(app.fecha_consulta)))].sort(
            (a, b) => new Date(a) - new Date(b)
        );

        // Filtrar citas según el mes seleccionado (si hay filtro)
        const filteredAppointments = selectedMonth
            ? sortedAppointments.filter(app => getMonthYear(app.fecha_consulta) === selectedMonth)
            : sortedAppointments;

        // Agrupar citas por mes
        const groupedByMonth = filteredAppointments.reduce((acc, app) => {
            const monthYear = getMonthYear(app.fecha_consulta);
            if (!acc[monthYear]) acc[monthYear] = [];
            acc[monthYear].push(app);
            return acc;
        }, {});

        return (
            <div className="overflow-x-auto">
                {/* Filtro de meses */}
                <div className="mb-6">
                    <label htmlFor="monthFilter" className="mr-2 text-teal-900 font-medium">
                        Filtrar por mes:
                    </label>
                    <select
                        id="monthFilter"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-3 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="">Todos los meses</option>
                        {uniqueMonths.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tabla separada por meses */}
                {Object.keys(groupedByMonth).length === 0 ? (
                    <div className="text-center text-teal-900">No hay citas para el mes seleccionado.</div>
                ) : (
                    Object.entries(groupedByMonth).map(([month, monthAppointments]) => (
                        <div key={month} className="mb-8">
                            <h3 className="text-xl font-semibold text-teal-800 mb-4 capitalize">{month}</h3>
                            <table className="min-w-full bg-white rounded-lg shadow-md">
                                <thead className="bg-teal-600 text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Médico</th>
                                        <th className="py-3 px-4 text-left">Fecha</th>
                                        <th className="py-3 px-4 text-left">Hora</th>
                                        <th className="py-3 px-4 text-left">Estado</th>
                                        <th className="py-3 px-4 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthAppointments.map((appointment) => (
                                        <tr key={appointment.id_consulta} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">Dr. {appointment.medico_nombre} {appointment.medico_apellido}</td>
                                            <td className="py-3 px-4">{formatDate(appointment.fecha_consulta)}</td>
                                            <td className="py-3 px-4">{appointment.hora_consulta}</td>
                                            <td className="py-3 px-4 capitalize">{appointment.estado}</td>
                                            <td className="py-3 px-4 flex space-x-2">
                                                {appointment.estado === 'pendiente' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleRescheduleAppointment(appointment.id_consulta)}
                                                            className="px-3 py-1 bg-amber-500 text-white rounded-full hover:bg-amber-600 text-sm"
                                                        >
                                                            Reagendar
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelAppointment(appointment.id_consulta)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-gray-50 p-4">
            <Navbar />
            <div className={`container max-w-6xl mx-auto px-6 py-12 transition-all duration-700 ease-in-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-teal-900">Mis Citas Médicas</h1>
                    <div className="space-x-2">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-2 rounded-lg ${viewMode === 'calendar' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-800'} hover:bg-teal-700 hover:text-white`}
                        >
                            Calendario
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-lg ${viewMode === 'table' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-800'} hover:bg-teal-700 hover:text-white`}
                        >
                            Tabla
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-teal-500">
                    {isLoading ? (
                        <div className="text-center text-teal-900">Cargando citas...</div>
                    ) : error ? (
                        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center text-teal-900">No tienes citas programadas.</div>
                    ) : viewMode === 'calendar' ? (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 650 }}
                            views={['month', 'week', 'day']}
                            defaultView="month"
                            eventPropGetter={eventStyleGetter}
                            onSelectEvent={handleSelectEvent}
                            components={{ toolbar: CustomToolbar }}
                            messages={{ next: 'Siguiente', previous: 'Anterior', today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día', noEventsInRange: 'No hay citas en este rango.' }}
                        />
                    ) : (
                        <TableView />
                    )}
                </div>
            </div>

            {selectedEvent && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={{
                        content: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '550px', width: '90%', padding: '32px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' },
                        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
                    }}
                >
                    <h2 className="text-2xl font-semibold text-teal-900 mb-6">Detalles de la Cita</h2>
                    <div className="space-y-4 text-gray-700">
                        <p><span className="font-medium text-teal-800">Médico:</span> Dr. {selectedEvent.medico_nombre} {selectedEvent.medico_apellido}</p>
                        <p><span className="font-medium text-teal-800">Fecha:</span> {formatDate(selectedEvent.fecha_consulta)}</p>
                        <p><span className="font-medium text-teal-800">Hora:</span> {selectedEvent.hora_consulta}</p>
                        <p><span className="font-medium text-teal-800">Estado:</span> {selectedEvent.estado}</p>
                    </div>
                    <div className="mt-8 flex justify-center space-x-4">
                        {selectedEvent.estado === 'pendiente' && (
                            <>
                                <button onClick={() => handleRescheduleAppointment(selectedEvent.id_consulta)} className="px-5 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600">Reagendar</button>
                                <button onClick={() => handleCancelAppointment(selectedEvent.id_consulta)} className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">Cancelar</button>
                            </>
                        )}
                        <button onClick={closeModal} className="px-5 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700">Cerrar</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ViewAppointments;