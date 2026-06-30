import React, { useState } from 'react'
import { api } from '../../services/api'
import { Button } from '../../components/ui/Button'
import { useScheduleStore } from '../../stores/useScheduleStore'
import { ConfirmPrompt } from '../../components/feedback/ConfirmPrompt'
import './ServiceModal.css'

interface BarberService {
  id: string
  titulo: string
  descricao: string | null
  duracao_minutos: number
  preco: number
  status: string // 'ATIVO' | 'INATIVO'
}

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service?: BarberService | null
  onSaveSuccess: () => void
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  service = null,
  onSaveSuccess,
}) => {
  const isEditMode = !!service
  const addToast = useScheduleStore((state) => state.addToast)

  // Inicializa o estado diretamente do 'service'. 
  // Para reiniciar esse estado quando o modal abre/fecha ou muda de serviço,
  // utiliza-se a técnica recomendada pelo React de passar um "key" dinâmico no componente pai.
  const [titulo, setTitulo] = useState(service?.titulo || '')
  const [descricao, setDescricao] = useState(service?.descricao || '')
  const [duracao, setDuracao] = useState<number>(service?.duracao_minutos || 30)
  const [preco, setPreco] = useState<number>(service?.preco || 0)
  const [status, setStatus] = useState(service?.status || 'ATIVO')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas no cliente
    if (!titulo.trim() || titulo.trim().length < 3) {
      addToast('O título deve conter pelo menos 3 caracteres.', 'error')
      return
    }

    if (duracao <= 0) {
      addToast('A duração deve ser maior que zero.', 'error')
      return
    }

    if (preco < 0) {
      addToast('O preço não pode ser negativo.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        duracao_minutos: Number(duracao),
        preco: Number(preco),
        status,
      }

      if (isEditMode && service) {
        // Envia requisição real PUT para atualização
        await api.put(`/services/${service.id}`, payload)
        addToast('Serviço atualizado com sucesso!', 'success')
      } else {
        // Envia requisição real POST para criação
        await api.post('/services', payload)
        addToast('Serviço criado com sucesso!', 'success')
      }

      onSaveSuccess()
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar o serviço.'
      addToast(errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = () => {
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!service) return

    setIsConfirmOpen(false)
    setIsDeleting(true)

    try {
      // Envia requisição real DELETE para o backend
      await api.delete(`/services/${service.id}`)
      addToast('Serviço removido com sucesso!', 'success')
      onSaveSuccess()
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir o serviço.'
      addToast(errorMessage, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <button className="btn-close" onClick={onClose} title="Fechar modal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Nome do Serviço */}
          <div className="form-group">
            <label htmlFor="titulo">Nome do Serviço *</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Corte Degradê, Barboterapia"
              required
              disabled={isSubmitting || isDeleting}
            />
          </div>

          {/* Descrição */}
          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva detalhes ou diferenciais do serviço..."
              rows={3}
              disabled={isSubmitting || isDeleting}
            />
          </div>

          {/* Duração e Preço */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="duracao">Duração Média (minutos) *</label>
              <input
                type="number"
                id="duracao"
                value={duracao}
                onChange={(e) => setDuracao(Math.max(1, Number(e.target.value)))}
                min="1"
                required
                disabled={isSubmitting || isDeleting}
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="preco">Preço (R$) *</label>
              <input
                type="number"
                id="preco"
                value={preco}
                onChange={(e) => setPreco(Math.max(0, Number(e.target.value)))}
                min="0"
                step="0.01"
                required
                disabled={isSubmitting || isDeleting}
              />
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">Status do Serviço</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="modal-select"
              disabled={isSubmitting || isDeleting}
            >
              <option value="ATIVO">Ativo (Exibido no agendamento do cliente)</option>
              <option value="INATIVO">Inativo (Indisponível para agendamento)</option>
            </select>
          </div>

          {/* Rodapé de Ações */}
          <div className={`modal-actions ${isEditMode ? 'space-between' : 'justify-end'}`}>
            {isEditMode && (
              <Button
                type="button"
                variant="danger"
                size="md"
                onClick={handleDeleteClick}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir Serviço'}
              </Button>
            )}

            <div className="actions-right">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <ConfirmPrompt
      isOpen={isConfirmOpen}
      title="Excluir Serviço"
      message={`Tem certeza que deseja excluir permanentemente o serviço "${service?.titulo}"? Esta ação não pode ser desfeita.`}
      onConfirm={handleConfirmDelete}
      onCancel={() => setIsConfirmOpen(false)}
    />
    </>
  )
}
