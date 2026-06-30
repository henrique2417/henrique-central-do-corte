import { useEffect, useState } from 'react'
import { useBookingStore, type Service } from '../../stores/useBookingStore'
import './ServiceSelector.css'

export default function ServiceSelector() {
  const [services, setServices] = useState<Service[]>([])
  const { selectedService, setSelectedService } = useBookingStore()

  useEffect(() => {
    fetch('http://localhost:4000/api/services')
      .then((res) => res.json())
      .then((data: Service[]) => setServices(data.filter((s) => s.status === 'ATIVO')))
      .catch((err) => console.error('Erro ao buscar serviços:', err))
  }, [])

  return (
    <div className="service-selector">
      <h2 className="section-title">1. Selecione o Serviço</h2>
      <div className="services-list">
        {services.map((service) => (
          <button
            key={service.id}
            className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
            onClick={() => setSelectedService(service)}
          >
            <div className="service-info">
              <h3>{service.titulo}</h3>
              <p>{service.descricao}</p>
            </div>
            <div className="service-meta">
              <span>{service.duracao_minutos} min</span>
              <span className="price">R$ {service.preco.toFixed(2)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
