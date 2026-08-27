const horarioRepository = require('../repositories/horario.repository');

class HorarioService {
  async create(data) {
    return horarioRepository.create(data);
  }

  async findByFicha(fichaId) {
    return horarioRepository.findByFicha(fichaId);
  }

  async findMyHorario(aprendizId) {
    return horarioRepository.findMyHorario(aprendizId);
  }

  async delete(id) {
    return horarioRepository.delete(id);
  }
}

module.exports = new HorarioService();
