import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Navbar from '../../Components/HomeComponents/NavBar';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';

const CreateAppointment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [occupiedTimes, setOccupiedTimes] = useState([]);
  const [formData, setFormData] = useState({
    id_usuario: user.id,
    id_medico: '',
    fecha_consulta: null,
    dia_consulta: '',
    hora_consulta: '',
    motivo: '',
    estado: 'Pendiente',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/users/getAllDoctors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al obtener la lista de médicos');
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error('Error al cargar los médicos:', err);
        setError('No se pudo cargar la lista de médicos.');
      }
    };
    fetchDoctors();
  }, []);

  const getCurrentTimeInMexico = () => {
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' });
    const date = new Date(now);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return { hours, minutes };
  };

  const isToday = (selectedDate) => {
    const today = new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' });
    const todayDate = new Date(today).setHours(0, 0, 0, 0);
    const selectedDateNormalized = selectedDate.setHours(0, 0, 0, 0);
    return todayDate === selectedDateNormalized;
  };

  const generateTimeSlots = (start, end, isToday, occupiedTimes) => {
    const allTimes = [];
    let [startHour, startMinute] = start.split(':').map(Number);
    let [endHour, endMinute] = end.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    let adjustedStartTime = startTime;
    if (isToday) {
      const { hours, minutes } = getCurrentTimeInMexico();
      const currentTimeInMinutes = hours * 60 + minutes;
      const nextSlot = Math.ceil(currentTimeInMinutes / 30) * 30;
      adjustedStartTime = Math.max(nextSlot, startTime);
    }

    for (let time = adjustedStartTime; time <= endTime; time += 30) {
      const hour = Math.floor(time / 60).toString().padStart(2, '0');
      const minute = (time % 60).toString().padStart(2, '0');
      const timeString = `${hour}:${minute}`;
      allTimes.push(timeString);
    }

    const available = allTimes.filter(time => !occupiedTimes.includes(time));
    return { available, allTimes };
  };

  const fetchOccupiedTimes = async (id_medico, fecha_consulta, dia_consulta) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/users/getAppointmentsByDoctorAndDate?id_medico=${id_medico}&fecha_consulta=${fecha_consulta}&dia_consulta=${dia_consulta}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Error al obtener citas existentes');
      const data = await response.json();
      // Normalizar las horas ocupadas al formato HH:mm
      const normalizedTimes = data.map(time => time.slice(0, 5)); // Convertir "22:00:00" a "22:00"
      setOccupiedTimes(normalizedTimes);
    } catch (err) {
      console.error('Error al cargar citas ocupadas:', err);
      setOccupiedTimes([]);
    }
  };

  const filterAvailableDates = (date) => {
    if (!selectedDay) return false;
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayIndex = daysOfWeek.indexOf(selectedDay);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() === dayIndex;
  };

  const handleDoctorChange = (e) => {
    const id_medico = e.target.value;
    const doctor = doctors.find(d => d.id_medico === Number(id_medico));
    setSelectedDoctor(doctor);
    setSelectedDay('');
    setAvailableTimes([]);
    setFormData((prev) => ({ ...prev, id_medico, fecha_consulta: null, dia_consulta: '' }));
    setOccupiedTimes([]);
  };

  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDay(day);
    setFormData((prev) => ({ ...prev, dia_consulta: day, fecha_consulta: null, hora_consulta: '' }));
    const schedule = selectedDoctor.schedules.find(s => s.dia_semana === day);
    if (schedule) {
      const today = new Date();
      const { available } = generateTimeSlots(
        schedule.hora_inicio,
        schedule.hora_fin,
        isToday(today),
        occupiedTimes
      );
      setAvailableTimes(available);
    } else {
      setAvailableTimes([]);
    }
  };

  const handleTimeChange = (e) => {
    setFormData((prev) => ({ ...prev, hora_consulta: e.target.value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, fecha_consulta: date }));
    if (selectedDoctor && date && selectedDay) {
      fetchOccupiedTimes(
        selectedDoctor.id_medico,
        date.toISOString().split('T')[0],
        selectedDay
      );
    }
    if (selectedDay && selectedDoctor) {
      const schedule = selectedDoctor.schedules.find(s => s.dia_semana === selectedDay);
      if (schedule) {
        const { available } = generateTimeSlots(
          schedule.hora_inicio,
          schedule.hora_fin,
          isToday(date),
          occupiedTimes
        );
        setAvailableTimes(available);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/users/createAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: formData.id_usuario,
          id_medico: formData.id_medico,
          fecha_consulta: formData.fecha_consulta.toISOString().split('T')[0],
          dia_consulta: formData.dia_consulta,
          hora_consulta: formData.hora_consulta,
          motivo: formData.motivo,
          estado: formData.estado,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la cita');
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Cita creada!',
        text: data.message || 'Cita médica creada exitosamente.',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/patient/home');
    } catch (err) {
      console.error('Error al crear la cita:', err);
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Ocurrió un error al crear la cita.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTimesWithStatus = () => {
    if (!selectedDoctor || !selectedDay) return [];
    const schedule = selectedDoctor.schedules.find(s => s.dia_semana === selectedDay);
    if (!schedule) return [];
    const { allTimes } = generateTimeSlots(
      schedule.hora_inicio,
      schedule.hora_fin,
      isToday(formData.fecha_consulta || new Date()),
      occupiedTimes
    );
    return allTimes.map(time => ({
      time,
      isOccupied: occupiedTimes.includes(time),
    }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-100 flex items-center justify-center py-12">
        <div
          className={`container max-w-3xl mx-auto px-6 py-10 transition-all duration-700 ease-in-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
            }`}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 mb-8 text-center tracking-tight animate-bounce">
            Crear Nueva Cita Médica
          </h1>
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-teal-600">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-teal-800 font-semibold mb-2">Médico</label>
                <select
                  name="id_medico"
                  value={formData.id_medico}
                  onChange={handleDoctorChange}
                  className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Selecciona un médico</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id_medico} value={doctor.id_medico}>
                      {doctor.nombre} {doctor.apellido}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div>
                  <label className="block text-teal-800 font-semibold mb-2">Día de la semana</label>
                  <select
                    value={selectedDay}
                    onChange={handleDayChange}
                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Selecciona un día</option>
                    {selectedDoctor.schedules.map((schedule) => (
                      <option key={schedule.dia_semana} value={schedule.dia_semana}>
                        {schedule.dia_semana}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedDay && (
                <div>
                  <label className="block text-teal-800 font-semibold mb-2">Fecha de la Consulta</label>
                  <DatePicker
                    selected={formData.fecha_consulta}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    minDate={new Date()}
                    filterDate={filterAvailableDates}
                    placeholderText="Selecciona una fecha disponible"
                    required
                  />
                </div>
              )}

              {selectedDay && (
                <div>
                  <label className="block text-teal-800 font-semibold mb-2">Hora de la consulta</label>
                  <select
                    value={formData.hora_consulta}
                    onChange={handleTimeChange}
                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Selecciona una hora</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {getAllTimesWithStatus().length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Horarios disponibles y ocupados:</p>
                      <ul className="list-none space-y-1">
                        {getAllTimesWithStatus().map(({ time, isOccupied }) => (
                          <li
                            key={time}
                            className={`flex items-center ${isOccupied ? 'text-red-600' : 'text-green-600'
                              }`}
                          >
                            {isOccupied ? (
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.402 1.376 1 1.723V15a1 1 0 001 1h2a1 1 0 001-1v-2.277c.598-.347 1-.985 1-1.723zm9-5v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                            {time} {isOccupied ? '(Ocupado)' : '(Disponible)'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-teal-800 font-semibold mb-2">Motivo de la Consulta</label>
                <textarea
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="5"
                  placeholder="Describe el motivo de la consulta..."
                  required
                />
              </div>

              <div>
                <label className="block text-teal-800 font-semibold mb-2">Estado</label>
                <input
                  type="text"
                  value={formData.estado}
                  className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                  readOnly
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'
                    }`}
                >
                  {isLoading ? 'Creando...' : 'Crear Cita Médica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAppointment;